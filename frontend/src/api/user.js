import { request, requestFormData, requestBlob, BASE_URL } from './request.js'
import { users as usersPaths } from './paths.js'

/** 一、用户管理（对应后台「用户管理」模块，路径带 user_id） */
export function getCurrentUser(userId) {
  return request(usersPaths.byId(userId))
}

export function updateCurrentUser(userId, body) {
  const apiBody = {}
  if (body.user_name !== undefined) apiBody.user_name = body.user_name
  else if (body.username !== undefined) apiBody.user_name = body.username
  if (body.email !== undefined) apiBody.email = body.email
  if (body.phone !== undefined) apiBody.phone = body.phone
  if (body.user_full_name !== undefined) apiBody.user_full_name = body.user_full_name
  else if (body.description !== undefined) apiBody.user_full_name = body.description
  if (body.avatar !== undefined) apiBody.avatar = body.avatar
  if (body.is_active !== undefined) apiBody.is_active = body.is_active
  if (body.email_verification_code !== undefined) apiBody.email_verification_code = body.email_verification_code
  if (body.phone_verification_code !== undefined) apiBody.phone_verification_code = body.phone_verification_code
  return request(usersPaths.byId(userId), {
    method: 'PUT',
    body: JSON.stringify(apiBody),
  })
}

export function deleteUser(userId) {
  return request(usersPaths.byId(userId), { method: 'DELETE' })
}

export function getAvatarUrl(userId) {
  if (!userId) return ''
  const base = BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const path = usersPaths.avatar(userId)
  return path.startsWith('http') ? path : `${base}${path}`
}

export function getAvatarBlob(userId) {
  if (!userId) return Promise.reject(new Error('userId required'))
  const path = usersPaths.avatar(userId)
  const url = `${path}?user_id=${encodeURIComponent(userId)}`
  return requestBlob(url)
}

export function changePassword(body, userId, token) {
  const path = usersPaths.changePassword
  const url = userId ? `${path}?user_id=${encodeURIComponent(userId)}` : path
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return request(url, {
    method: 'POST',
    body: JSON.stringify({
      old_password: body.old_password ?? body.current_password,
      new_password: body.new_password,
    }),
    headers,
  })
}

export function uploadAvatar(file, userId, token) {
  const form = new FormData()
  form.append('file', file)
  const path = usersPaths.uploadAvatar
  const url = userId ? `${path}?user_id=${encodeURIComponent(userId)}` : path
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return requestFormData(url, {
    method: 'POST',
    body: form,
    headers,
  })
}
