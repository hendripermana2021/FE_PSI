import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Users = React.lazy(() => import('./views/base/users/Users'))
const Programs = React.lazy(() => import('./views/base/programs/Programs'))
const Role = React.lazy(() => import('./views/base/role/Role'))
const Regional = React.lazy(() => import('./views/base/regional/Regional'))
const Kriteria = React.lazy(() => import('./views/base/kriteria/Kriteria'))
const Ajuan = React.lazy(() => import('./views/base/ajuan_wilayah/Ajuan'))
const Generate = React.lazy(() => import('./views/base/generate_psi/Generate'))

//Forms

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/master/users', name: 'Users', element: Users },
  { path: '/master/role', name: 'Role', element: Role },
  { path: '/master/regional', name: 'Regional', element: Regional },
  { path: '/master/programs', name: 'Programs', element: Programs },
  { path: '/master/kriteria', name: 'Kriteria', element: Kriteria },
  { path: '/base/generate_psi', name: 'Generate', element: Generate },
  { path: '/base/ajuan', name: 'Ajuan', element: Ajuan },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
