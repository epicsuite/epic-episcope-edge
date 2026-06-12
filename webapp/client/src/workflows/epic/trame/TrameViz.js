import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TrameViz = (props) => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [url, setUrl] = useState()
  useEffect(() => {
    if (location.state) {
      setUrl(location.state.url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <iframe src={url} className="edge-iframe" title={'trame'} />
    </>
  )
}

export default TrameViz
