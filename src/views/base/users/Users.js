import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import TableUsers from './Table-users'

const Users = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Table</strong> <small>(Showing, Create, Edit Users)</small>
          </CCardHeader>
          <CCardBody>
            <TableUsers />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
