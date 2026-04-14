/** AIAgent Worker 服务（智能助手） */
export const API_AGENT_SERVICE_URL = (() => {
  const v = import.meta.env.VITE_API_AGENT_SERVICE_URL
  return (v !== undefined && v !== '') ? v : ''
})()

export const isDevelopment = import.meta.env.DEV
