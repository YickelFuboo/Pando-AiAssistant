import { computed, ref } from 'vue'

const LOCAL_USER_ID = 'local_user'
const token = ref('')
const user = ref({
  id: LOCAL_USER_ID,
  user_id: LOCAL_USER_ID,
  user_name: LOCAL_USER_ID,
  username: LOCAL_USER_ID,
  user_full_name: '本地用户',
  email: '',
})
const avatarObjectUrls = ref({})
const USER_ID_KEY = 'moling_user_id'

function ensureLocalUser() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(USER_ID_KEY, LOCAL_USER_ID)
  }
}

ensureLocalUser()

export function useAuth() {
  const isLoggedIn = computed(() => true)
  const userId = computed(() => LOCAL_USER_ID)
  const userDisplayName = computed(() => LOCAL_USER_ID)

  function setToken() {
    token.value = ''
    ensureLocalUser()
  }

  async function fetchUser() {
    ensureLocalUser()
    return user.value
  }

  async function updateUser(body) {
    const next = { ...user.value }
    if (body?.description !== undefined) next.user_full_name = String(body.description || '')
    if (body?.username !== undefined) next.user_name = String(body.username || LOCAL_USER_ID)
    user.value = next
  }

  async function changePassword() {
    return true
  }

  async function uploadAvatarFile(file) {
    if (!(file instanceof Blob)) return false
    const current = avatarObjectUrls.value[LOCAL_USER_ID]
    if (current) URL.revokeObjectURL(current)
    const url = URL.createObjectURL(file)
    avatarObjectUrls.value = { ...avatarObjectUrls.value, [LOCAL_USER_ID]: url }
    return true
  }

  function loadAvatar() {}

  function avatarUrl(uid) {
    const id = uid || LOCAL_USER_ID
    return avatarObjectUrls.value[id] || ''
  }

  function revokeAvatar(uid) {
    const id = uid || LOCAL_USER_ID
    const url = avatarObjectUrls.value[id]
    if (!url) return
    URL.revokeObjectURL(url)
    const next = { ...avatarObjectUrls.value }
    delete next[id]
    avatarObjectUrls.value = next
  }

  async function logout() {
    ensureLocalUser()
    return true
  }

  return {
    token,
    user,
    userId,
    userDisplayName,
    isLoggedIn,
    logout,
    fetchUser,
    updateUser,
    changePassword,
    uploadAvatarFile,
    avatarUrl,
    loadAvatar,
    revokeAvatar,
    avatarObjectUrls,
    setToken,
  }
}
