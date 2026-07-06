require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://budget-advisor-jgl9.vercel.app';
const allowedOrigins = [FRONTEND_ORIGIN];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && origin?.includes('localhost'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const logError = (error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }
};

// The chat endpoint now returns hard-coded local finance advice only.
// This ensures deterministic, logic-based responses without calling an external model.

function buildFinancialAdvice(data) {
  const { currency_symbol, income, expenses, balance, savings_rate } = data;
  const expenseEntries = Object.entries(expenses || {}).sort((a, b) => b[1] - a[1]);
  const [largestCategory, largestAmount] = expenseEntries[0] || [];
  const safeSavingsTarget = Math.max(0, Math.round(income * 0.2));
  const emergencyGoal = income * 3;

  const summary = `Local Advisor: You are doing a good job reviewing your budget. Your monthly income is ${currency_symbol}${income}, your total expenses are ${currency_symbol}${income - balance}, and your current balance is ${currency_symbol}${balance}.`;

  const insight = savings_rate >= 20
    ? `Your savings rate is ${savings_rate}%, which is a healthy level. Keep building that habit by moving money into savings automatically each month.`
    : `Your savings rate is ${savings_rate}%, so there is room to improve. Aim to save at least ${currency_symbol}${safeSavingsTarget} every month.`;

  const categoryAdvice = largestCategory
    ? `Your biggest spending area is ${largestCategory} at ${currency_symbol}${largestAmount}. Review that category first if you want to free up more money.`
    : 'Your spending is balanced, but reviewing your largest category can still help you improve your cash flow.';

  const nextStep = balance >= 0
    ? `Since your budget is positive, keep the momentum going by setting aside ${currency_symbol}${safeSavingsTarget} for savings and building an emergency fund of ${currency_symbol}${emergencyGoal}.`
    : `Since your budget is negative, reduce flexible spending first and try to keep your savings transfer at ${currency_symbol}${safeSavingsTarget} once your balance improves.`;

  return `${summary}\n\n${insight}\n\n${categoryAdvice}\n\n${nextStep}`;
}

function buildBudgetPrompt(financialData, messages = []) {
  const systemInstructions = `You are a helpful and professional personal finance advisor.
You are analyzing the user's budget.

Here is the user's financial data:
- Currency: ${financialData.currency_name} (${financialData.currency_symbol})
- Monthly Income: ${financialData.income}
- Total Expenses: ${financialData.total_expenses}
- Net Balance: ${financialData.balance}
- Savings Rate: ${financialData.savings_rate}%

Monthly expenses:
${Object.entries(financialData.expenses || {})
  .map(([category, amount]) => `- ${category}: ${financialData.currency_symbol}${amount}`)
  .join('\n')}

Give concise, practical, friendly advice. Use bullet points and short paragraphs.`;

  const history = messages
    .map(msg => {
      const role = msg.role === 'assistant' ? 'Advisor' : 'User';
      return `${role}: ${msg.content}`;
    })
    .join('\n\n');

  return `${systemInstructions}\n\n${history}\n\nAdvisor:`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], financialData, provider = 'gemini' } = req.body;

    if (!financialData) {
      return res.status(400).json({ error: 'Missing financialData' });
    }

      const localReply = buildFinancialAdvice(financialData);
    return res.json({ reply: localReply, provider: 'local', fallback: false });
  } catch (error) {
    logError(error);
    const fd = req.body?.financialData || {};
    const fallbackReply = buildFinancialAdvice(fd);
    return res.json({ reply: `${fallbackReply}\n\nGemini is temporarily unavailable, so this local budget advice is being shown instead.`, provider: 'local', fallback: true });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const payload = { error: err.message || 'Internal server error' };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server listening on http://localhost:${PORT}`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is already in use. Please stop the other server or use a different PORT.`);
  } else {
    console.error('Server error:', err);
  }
});