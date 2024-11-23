import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilList,
  cilPuzzle,
  cilLayers,
  cilSettings,
  cilDescription,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
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
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
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
        icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ajuan Anggaran',
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

export default _nav
