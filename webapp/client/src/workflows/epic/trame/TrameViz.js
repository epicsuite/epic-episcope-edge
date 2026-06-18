import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TrameViz = (props) => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [url, setUrl] = useState()
  const [project, setProject] = useState()
  useEffect(() => {
    if (location.state) {
      setUrl(location.state.url)
      setProject(location.state.project)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {project && (
        <>
          <a
            href={`/user/project?code=${project.code}`}
            rel="noopener noreferrer"
            className="edge-link"
          >
            {project.name}
          </a>
          <br></br>
        </>
      )}
      <iframe src={url} project={project} className="edge-iframe" title={'trame'} />
    </>
  )
}

export default TrameViz
