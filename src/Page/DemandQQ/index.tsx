import { useMemo } from 'react'
import useRequestFetchQQ, { Request } from 'Request/fetchQQ'
import Loading from 'Component/Loading'
import Img from 'Component/Img'
import { debounce } from 'lodash'
import './index.scss'

const UserCard = function (props: { request: Request }) {
  const { data, loading, status } = props.request

  const renderInfo = () => {
    if (status?.value === 'failure') {
      return (
        <>
          <div className="user-name">获取失败：</div>
          <div className="user-qq">{status.mes}</div>
        </>
      )
    } else {
      return (
        <>
          <div className="user-name">{data.name}</div>
          <div className="user-qq">{data.qq}</div>
        </>
      )
    }
  }

  return (
    <Loading className="user-card" loading={loading}>
      <div className="user-card-inner">
        <Img className="user-img" src={data.img}></Img>
        <div className="user-info">{renderInfo()}</div>
      </div>
    </Loading>
  )
}

const isAllNumber = (string: string) => {
  for (let e of string) {
    if (!/\d/.test(e)) {
      return false
    }
  }
  return true
}

const isValidQQ = (qq: string) => {
  if (qq.length < 5) {
    return false
  } else if (!isAllNumber(qq)) {
    return false
  }
  return true
}

const App = (props: {}) => {
  const request = useRequestFetchQQ()

  const inputQQ = useMemo(() => {
    return debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const v = event.target.value
      if (isValidQQ(v)) {
        request.send({ qq: v })
      } else {
        request.setStatus({
          value: 'failure',
          mes: '请输入合法的 qq 值',
        })
      }
    }, 500)
  }, [request])

  return (
    <div className="global-page-demand-qq page-container">
      <h1>QQ号查询</h1>
      <h2>
        QQ
        <input className="input-qq" onChange={inputQQ}></input>
      </h2>
      <UserCard {...{ request }} />
    </div>
  )
}

export default App
