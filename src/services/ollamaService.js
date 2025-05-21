export const sendChatMessage = async (messages) => {
  const response = await fetch('http://mac:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      messages,
      stream: true
    })
  })
  return response
}