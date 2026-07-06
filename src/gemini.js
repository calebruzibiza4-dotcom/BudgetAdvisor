const API_BASE = import.meta.env.VITE_API_URL || ''

function buildLocalFallback(financialData) {
  const currencySymbol = financialData?.currency_symbol || '$'
  const income = Number(financialData?.income || 0)
  const totalExpenses = Number(financialData?.total_expenses ?? Object.values(financialData?.expenses || {}).reduce((sum, value) => sum + Number(value), 0))
  const balance = Number(financialData?.balance ?? income - totalExpenses)
  const savingsRate = Number(financialData?.savings_rate ?? (income > 0 ? Math.round(((income - totalExpenses) / income) * 100) : 0))
  const expenseEntries = Object.entries(financialData?.expenses || {}).sort((a, b) => b[1] - a[1])
  const [largestCategory, largestAmount] = expenseEntries[0] || []
  const safeSavingsTarget = Math.max(0, Math.round(income * 0.2))
  const emergencyGoal = income * 3

  const summary = `Local Advisor: You are doing a good job reviewing your budget. Your monthly income is ${currencySymbol}${income}, your total expenses are ${currencySymbol}${totalExpenses}, and your current balance is ${currencySymbol}${balance}.`

  const insight = savingsRate >= 20
    ? `Your savings rate is ${savingsRate}%, which is a healthy level. Keep building that habit by moving money into savings automatically each month.`
    : `Your savings rate is ${savingsRate}%, so there is room to improve. Aim to save at least ${currencySymbol}${safeSavingsTarget} every month.`

  const categoryAdvice = largestCategory
    ? `Your biggest spending area is ${largestCategory} at ${currencySymbol}${largestAmount}. Review that category first if you want to free up more money.`
    : 'Your spending is balanced, but reviewing your largest category can still help you improve your cash flow.'

  const nextStep = balance >= 0
    ? `Since your budget is positive, keep the momentum going by setting aside ${currencySymbol}${safeSavingsTarget} for savings and building an emergency fund of ${currencySymbol}${emergencyGoal}.`
    : `Since your budget is negative, reduce flexible spending first and try to keep your savings transfer at ${currencySymbol}${safeSavingsTarget} once your balance improves.`

  return `${summary}\n\n${insight}\n\n${categoryAdvice}\n\n${nextStep}`
}

export async function sendMessage(messages, financialData, provider = 'gemini') {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        financialData,
        provider
      })
    })

    const rawText = await response.text()
    let payload = null

    try {
      payload = rawText ? JSON.parse(rawText) : null
    } catch {
      payload = null
    }

    if (!response.ok) {
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        return { reply: buildLocalFallback(financialData), provider: 'local', fallback: true }
      }
      const errorMessage = payload?.error || rawText || 'Unable to reach the advisor service.'
      throw new Error(`Error sending message: ${errorMessage}`)
    }

    return payload || {}
  } catch (error) {
    return { reply: buildLocalFallback(financialData), provider: 'local', fallback: true }
  }

  try {
    payload = rawText ? JSON.parse(rawText) : null
  } catch {
    payload = null
  }

  if (!response.ok) {
    const errorMessage = payload?.error || rawText || 'Unable to reach the advisor service.'
    throw new Error(`Error sending message: ${errorMessage}`)
  }

  return payload || {}
}
