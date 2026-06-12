import React from 'react'

const PublicProjectPage = React.lazy(() => import('src/workflows/common/projectPage/Public'))
const Home = React.lazy(() => import('src/workflows/epic/Home'))
const Trame = React.lazy(() => import('src/workflows/epic/trame/Main'))

const workflowRoutes = [
  { path: '/public/project', name: 'PublicProjectPage', element: PublicProjectPage },
  { path: '/home', name: 'Home', element: Home },
  { path: '/trame', name: 'Trame', element: Trame },
]

export default workflowRoutes
