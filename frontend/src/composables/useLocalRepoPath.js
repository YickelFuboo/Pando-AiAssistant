import { ref } from 'vue'

const STORAGE_KEY = 'pando_repo_local_path'

function getInitialValue() {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

const repoLocalPath = ref(getInitialValue())

function setRepoLocalPath(path) {
  const next = (path ?? '').trim()
  repoLocalPath.value = next
  if (typeof window === 'undefined') return
  try {
    if (next) localStorage.setItem(STORAGE_KEY, next)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function useLocalRepoPath() {
  return {
    repoLocalPath,
    setRepoLocalPath,
  }
}
