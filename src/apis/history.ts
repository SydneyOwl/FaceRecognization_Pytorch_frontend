import httpRequest from '../request'

export function apiGetMyVideo() {
  return httpRequest({
    url: '/getMyVideo',
    method: 'post',
  })
}

export function apiGetHistoryFace() {
  return httpRequest({
    url: '/getAllFace',
    method: 'post',
  })
}