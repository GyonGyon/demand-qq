
type ApiMapType = {
  readonly 'fetchQQ': [string, string],
}

const ApiMap: ApiMapType = {
  fetchQQ: ['https://api.uomg.com/api/qq.info', 'get'],
}

const apiValue = (name: keyof ApiMapType) => {
  if (name in ApiMap) {
    return ApiMap[name]
  } else {
    throw new Error('api 未设置')
  }
}

export default apiValue
