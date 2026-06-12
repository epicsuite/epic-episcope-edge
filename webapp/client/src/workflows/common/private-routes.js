import React from 'react'
import config from 'src/config'
const UserProjectPage = React.lazy(() => import('src/workflows/common/projectPage/User'))
const AdminProjectPage = React.lazy(() => import('src/workflows/common/projectPage/Admin'))
const SRAWorkflow = React.lazy(() => import('src/workflows/sra/Main'))
const FdgenomeWorkflow = React.lazy(() => import('src/workflows/epic/fdgenome/Main'))

const workflowPrivateRoutes = [
  { path: '/user/project', name: 'ProjectPage', element: UserProjectPage },
  { path: '/admin/project', name: 'AdminProjectPage', element: AdminProjectPage },
  config.APP.SRADATA_IS_ENABLED && { path: '/user/sradata', name: 'Data', element: SRAWorkflow },
  // Add more workflow private routes here
  { path: '/workflow/4dgenome', exact: true, name: '4dgenome', element: FdgenomeWorkflow },
]

export default workflowPrivateRoutes
