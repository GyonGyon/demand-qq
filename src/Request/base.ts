import { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { isObject, debounce } from 'lodash'

export type Status = {
  value: 'failure' | 'success' | 'loading' | 'initial'
  mes?: string
}

export interface Result extends AxiosResponse {
  data: {
    code?: number
    msg?: string
  }
}

// 对请求的封装
export class Request {
  url
  method
  loading? = false
  status?: Status
  data?: any
  sendDebounce?: any
  tag: number = 0
  onlyLastRequest: boolean = true

  constructor(api: [string, string]) {
    this.url = api[0]
    this.method = api[1]
  }

  private validTag(tag: number) {
    if (this.onlyLastRequest) {
      return tag === this.tag
    } else {
      return true
    }
  }

  setLoading(value: boolean | (() => boolean)) {
    if (typeof value === 'function') {
      this.loading = value()
    } else {
      this.loading = value
    }
  }

  setData(value: any | (() => any)) {
    if (typeof value === 'function') {
      this.data = value()
    } else {
      this.data = value
    }
  }

  setStatus(value: Status | (() => Status)) {
    if (typeof value === 'function') {
      this.status = value()
    } else {
      this.status = value
    }
  }

  private sendRequest(data: any) {
    // 暂时不考虑其他请求方法，只考虑 post get
    const { method, url } = this
    if (method === 'get') {
      return axios.get(url, {
        params: data,
      })
    } else {
      return axios.post(url, data)
    }
  }

  switchData(res: any) {
    return res
  }

  private onSuccess = (tag: number) => {
    return (res: Result) => {
      if (this.validTag(tag) === false) {
        return
      }
      if (!isObject(res)) {
        throw new Error(`axios 返回值错误：${JSON.stringify(res)}`)
      }
      if (res.status !== 200) {
        throw new Error(`请求网络错误：status: (${res.status}) msg: (${res.statusText})`)
      }

      const data = res.data
      if (!isObject(data)) {
        throw new Error('请求响应数据格式错误')
      }
      if (data.code !== 1) {
        throw new Error(`请求响应错误：code: (${data.code}) msg: (${data.msg})`)
      }

      const d = this.switchData(data)
      this.setData(d)
      this.setLoading(false)
      this.setStatus({ value: 'success' })
      return d
    }
  }

  private onFailure = (tag: number) => {
    return (err: Error) => {
      if (this.validTag(tag) === false) {
        return
      }
      throw err
    }
  }

  private setError(err: Error) {
    this.setData(this.switchData)
    this.setLoading(false)
    this.setStatus({
      value: 'failure',
      mes: err.message,
    })
  }

  private onCatch = (tag: number) => {
    return (err: Error) => {
      if (this.validTag(tag) === false) {
        return
      }
      this.setError(err)
    }
  }

  send = (data: any) => {
    this.setLoading(true)
    // this.setData(this.switchData)
    this.setStatus({
      value: 'loading',
    })
    const tag = Math.random()
    this.tag = tag
    return this.sendRequest(data).then(this.onSuccess(tag), this.onFailure(tag)).catch(this.onCatch(tag))
  }

  genSendDebounce(wait?: number) {
    if (this.sendDebounce || wait == null) {
      return this.sendDebounce
    } else {
      this.sendDebounce = debounce(this.send, wait)
    }
  }
}

export const useLoading = (request: Request, value = false) => {
  const [loading, setLoading] = useState(value)
  request.setLoading = setLoading
  request.loading = loading
  return loading
}

export const useStatus = (request: Request, value: Status = { value: 'initial' }) => {
  const [status, setStatus] = useState(value)
  request.status = status
  request.setStatus = setStatus
}

export const useData = (request: Request, value: any = null) => {
  const [data, setData] = useState(value)
  request.data = data
  request.setData = setData
}

export const useRequestDefault = (request: Request, switchData?: any) => {
  useData(request, switchData)
  useLoading(request)
  useStatus(request)
}

export default Request
