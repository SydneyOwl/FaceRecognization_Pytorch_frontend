import httpRequest from '../request'

interface Settings {
  videoRatio: string
  captureFace: boolean
}

export function apiSettings(params:Settings) {
  return httpRequest({
    url: '/settings',
    method: 'post',
    data: params,
  })
}
