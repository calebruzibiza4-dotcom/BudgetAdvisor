export async function sendMessage(messages, financialData, provider = 'gemini') {
  const response = await fetch('/api/chat', {
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
    const errorMessage = payload?.error || rawText || 'Unable to reach the advisor service.'
    throw new Error(`Error sending message: ${errorMessage}`)
  }

  return payload || {}
}
