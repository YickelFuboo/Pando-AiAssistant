import { requestKnowledge, getKnowledgeUserId } from './requestKnowledge.js'

const PREFIX = '/api/v1/models'

function query(extra = {}) {
  const uid = getKnowledgeUserId()
  const q = uid ? { user_id: uid } : {}
  return { ...q, ...extra }
}

export async function chat(body) {
  const res = await requestKnowledge(`${PREFIX}/chat`, {
    method: 'POST',
    body: JSON.stringify(body),
  }, query())
  return res
}

export function chatStreamUrl() {
  const path = `${PREFIX}/chat/stream`
  const uid = typeof localStorage !== 'undefined' ? localStorage.getItem('moling_user_id') || '' : ''
  const params = new URLSearchParams()
  if (uid) params.set('user_id', uid)
  const q = params.toString()
  return q ? `${path}?${q}` : path
}
