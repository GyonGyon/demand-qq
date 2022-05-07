import { useEffect, useRef, useState } from 'react'
import defaultImage from 'Image/defaultImage.jpg'


 const Img = (props: any) => {
  const { src: srcProps, className } = props
  const [src, setSrc] = useState(defaultImage)
  const tag = useRef(0)

  useEffect(() => {
    const temp = new Image()
    const tag0 = Math.random()
    tag.current = tag0
    temp.src = srcProps
    const onload = () => {
      if (tag0 === tag.current) {
        setSrc(srcProps)
      }
    }
    temp.addEventListener('load', onload)
    return () => {
      temp.removeEventListener('load', onload)
    }
  }, [srcProps])
  return <img className={className} src={src} alt='src'></img>
}

export default Img
