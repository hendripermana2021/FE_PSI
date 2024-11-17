import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CCol,
  CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

import ReactImg from 'src/assets/images/react.jpg'
import { constantaSource } from '../../constantaEnv'
import TableRole from './Table-role'

const Roles = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Page Roles</strong> <small> {String(constantaSource.PageHeader)}</small>
          </CCardHeader>
          <CCardBody>
            <p>
              This table displays roles with added features like pagination, search, sorting, and
              row numbering.
            </p>
            <TableRole />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Roles
