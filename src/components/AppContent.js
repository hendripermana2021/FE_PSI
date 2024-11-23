import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate, Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { serverSourceDev } from '../views/constantaEnv'

// Lazy load components
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const DashboardPegawai = React.lazy(() => import('../views/dashboard/DashboardPegawai'))
const Users = React.lazy(() => import('../views/base/users/Users'))
const Programs = React.lazy(() => import('../views/base/programs/Programs'))
const Role = React.lazy(() => import('../views/base/role/Role'))
const Regional = React.lazy(() => import('../views/base/regional/Regional'))
const Kriteria = React.lazy(() => import('../views/base/kriteria/Kriteria'))
const Ajuan = React.lazy(() => import('../views/base/ajuan_wilayah/Ajuan'))
const Generate = React.lazy(() => import('../views/base/generate_psi/Generate'))

const AppContent = () => {
  const [profile, setProfile] = useState({})
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if token exists in session storage
    const storedToken = sessionStorage.getItem('accessToken')
    setToken(storedToken)

    if (!storedToken) {
      // Trigger SweetAlert if token doesn't exist
      Swal.fire({
        title: 'Authentication Required',
        text: 'You need to login to access this page.',
        icon: 'warning',
        confirmButtonText: 'Login',
      }).then(() => {
        // Navigate to login page after the alert is confirmed
        navigate('/login')
      })
    } else {
      // Call profile data if token exists
      getProfile(storedToken)
    }
  }, [navigate])

  const getProfile = async (token) => {
    try {
      const response = await axios.get(`${serverSourceDev}me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProfile(response.data.data)
      console.log('data profile : ', response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  // Conditional routes based on user role
  const routesResult =
    profile.role_id === 1
      ? [
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
      : [
          { path: '/', exact: true, name: 'Home' },
          { path: '/base/ajuan', name: 'Ajuan', element: Ajuan },
          { path: '/dashboard', name: 'Dashboard', element: DashboardPegawai },
        ]

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routesResult.map((route, idx) => {
            const Component = route.element
            return (
              Component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<Component />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
