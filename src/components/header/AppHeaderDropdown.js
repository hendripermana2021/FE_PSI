import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from '../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { serverSourceDev } from '../../views/constantaEnv'
import ProfileModal from '../../views/base/profile/profile'

const AppHeaderDropdown = () => {
  const [profile, setProfile] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}me`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProfile(response.data.data)
      setToken(sessionStorage.getItem('accessToken'))
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${serverSourceDev}logout`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })

          sessionStorage.removeItem('accessToken')

          Swal.fire('Logout!', 'Your has been logout', 'success').then(() => {
            navigate('/login')
          })
        } catch (error) {
          console.error('Error logout :', error)
          Swal.fire('Error!', 'Your failed logout.', 'error')
        }
      }
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          <ProfileModal user={profile} />
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem type="button" onClick={logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
