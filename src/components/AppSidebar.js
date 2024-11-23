import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import {
  cilSpeedometer,
  cilUser,
  cilList,
  cilPuzzle,
  cilLayers,
  cilDescription,
} from '@coreui/icons'
import axios from 'axios'
import { serverSourceDev } from '../views/constantaEnv'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [profile, setProfile] = useState({})
  const [token, setToken] = useState('')

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

  console.log('sidebar', profile.role_id)

  const navigation =
    profile.role_id === 1
      ? [
          {
            component: CNavItem,
            name: 'Dashboard',
            to: '/dashboard',
            icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
            badge: {
              color: 'info',
              text: 'NEW',
            },
          },
          {
            component: CNavTitle,
            name: 'Data Master',
          },
          {
            component: CNavItem,
            name: 'Role Users',
            to: '/master/role',
            icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
          },
          {
            component: CNavItem,
            name: 'Kriteria & SubKriteria',
            to: '/master/kriteria',
            icon: <CIcon icon={cilList} customClassName="nav-icon" />,
          },
          {
            component: CNavItem,
            name: 'Programs',
            to: '/master/programs',
            icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
          },
          {
            component: CNavItem,
            name: 'Wilayah',
            to: '/master/regional',
            icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
          },
          {
            component: CNavTitle,
            name: 'Form',
          },
          {
            component: CNavGroup,
            name: 'Data Authorization',
            to: '/base',
            icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
            items: [
              {
                component: CNavItem,
                name: 'Data User',
                to: '/master/users',
                icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Ajuan Programs',
            to: '/base',
            icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
            items: [
              {
                component: CNavItem,
                name: 'Ajuan Wilayah',
                to: '/base/ajuan',
                icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
              },
              {
                component: CNavItem,
                name: 'Generate PSI',
                to: '/base/generate_psi',
                icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Realisasi Ajuan Anggaran',
            to: '/base',
            icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
            items: [
              {
                component: CNavItem,
                name: 'DPA & DPP',
                to: '/master/ajuan',
                icon: <CIcon icon={cilList} customClassName="nav-icon" />,
              },
            ],
          },
        ]
      : [
          {
            component: CNavItem,
            name: 'Dashboard',
            to: '/dashboard',
            icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
            badge: {
              color: 'info',
              text: 'NEW',
            },
          },
          {
            component: CNavGroup,
            name: 'Realisasi Anggaran',
            to: '/base',
            icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
            items: [
              {
                component: CNavItem,
                name: 'DPA & DPP',
                to: '/master/ajuan',
                icon: <CIcon icon={cilList} customClassName="nav-icon" />,
              },
            ],
          },
        ]

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom text-center ">
        <CSidebarBrand to="/" className="text-center">
          <h4>ANGGARAN</h4>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
