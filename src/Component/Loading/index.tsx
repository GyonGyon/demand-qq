import classnames from 'classnames'
import './index.scss'

interface LoadingProps {
  loading?: boolean
  children?: React.ReactNode
  className?: string
}

const Loading = (props: LoadingProps) => {
  const { loading, children, className } = props

  const cls = classnames(className, 'loading-outer', 'global-component-loading')

  if (loading) {
    return (
      <div className={cls}>
        <div className="loading-component-container">
          {children}
          <div className="loading-mask"></div>
        </div>
        <div className="loading-tip">
          <div className="loading-center">
            <div className="loading-fusion-reactor">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <div className={cls}>{children}</div>
  }
}

export default Loading
