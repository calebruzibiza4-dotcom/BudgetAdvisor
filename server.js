require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Global handlers to prevent the Node process from exiting on unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const GEMINI_MODEL = 'gemini-2.0-flash';

async function generateGeminiReply(apiKey, prompt) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error?.message || 'Gemini request failed' };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return { error: 'Gemini returned no text' };

    return { reply: text };
  } catch (err) {
    return { error: err.message || String(err) };
  }
}

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

    if (provider === 'local') {
      const localReply = buildFinancialAdvice(financialData);
      return res.json({ reply: localReply, provider: 'local', fallback: false });
    }

    if (provider !== 'gemini') {
      const localReply = buildFinancialAdvice(financialData);
      return res.json({ reply: localReply, provider: 'local', fallback: false });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      const localReply = buildFinancialAdvice(financialData);
      return res.json({ reply: `${localReply}\n\nGemini key is not configured. Using local advisor.`, provider: 'local', fallback: true });
    }

    const prompt = buildBudgetPrompt(financialData, messages);
    const result = await generateGeminiReply(apiKey, prompt);

    if (result.error) {
      console.error('Gemini API returned error:', result.error);
      const fd = financialData || {};
      const fallbackReply = buildFinancialAdvice(fd);
      return res.json({ reply: `${fallbackReply}\n\nGemini error: ${result.error}. Showing local advice instead.`, provider: 'local', fallback: true });
    }

    return res.json({ reply: result.reply, provider: 'gemini', fallback: false });
  } catch (error) {
    console.error('Gemini error:', error);
    // financialData may be undefined here (out of try scope) — use request body defensively
    const fd = (req && req.body && req.body.financialData) ? req.body.financialData : {};
    const fallbackReply = buildFinancialAdvice(fd);
    return res.json({ reply: `${fallbackReply}\n\nGemini is temporarily unavailable, so this local budget advice is being shown instead.`, provider: 'local', fallback: true });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is already in use. Please stop the other server or use a different PORT.`);
  } else {
    console.error('Server error:', err);
  }
});