import { useMemo } from 'react'
import Request, { Result, useRequestDefault } from 'Request/base'
import defaultImage from 'Image/defaultImage.jpg'
import apiValue from 'Request/apiMap'

export { Request }

export interface ResultQQ extends Result {
  name?: string
  qq?: string
  qlogo?: string
}

type UserData = {
  name: string
  qq: string
  img: string
}

export const switchUserData: (res?: ResultQQ) => UserData = (res) => {
  const d: UserData = {
    name: 'name 未找到',
    qq: 'qq 未找到',
    img: defaultImage,
  }

  if (res == null) {
    return d
  }

  Object.assign(d, {
    name: res.name,
    qq: res.qq,
    img: res.qlogo,
  })
  return d
}

export const useRequestFetchQQ = () => {
  const r = useMemo<Request>(() => {
    const api = apiValue("fetchQQ")
    const r = new Request(api)
    r.switchData = switchUserData
    return r
  }, [])
  useRequestDefault(r, switchUserData)
  return r
}

export default useRequestFetchQQ
