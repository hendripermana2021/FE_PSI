import React, { Suspense, useEffect } from 'react'
import { useNavigate, Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import Swal from 'sweetalert2'

const AppContent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if token exists in session storage
    const token = sessionStorage.getItem('accessToken')

    if (!token) {
      // Trigger SweetAlert
      Swal.fire({
        title: 'Authentication Required',
        text: 'You need to login to access this page.',
        icon: 'warning',
        confirmButtonText: 'Login',
      }).then(() => {
        // Navigate to login page after the alert is confirmed
        navigate('/login')
      })
    }
  }, [navigate])

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
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
