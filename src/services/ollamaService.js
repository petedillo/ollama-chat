const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://mac:11434'

export const sendChatMessage = async (messages) => {
  const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      messages,
      stream: true
    })
  })
  return response
}