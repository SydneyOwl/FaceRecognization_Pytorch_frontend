import httpRequest from '../request'

interface User {
  username: string
  password: string
}

interface LoginParams extends User {}

export function apiLogin(params: LoginParams) {
  return httpRequest({
    url: '/login',
    method: 'post',
    data: params,
  })
}

export function apiTestAuth() {
  return httpRequest({
    url: '/isAuthorized',
    method: 'post',
  })
}