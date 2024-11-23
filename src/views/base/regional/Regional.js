import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import TableRegional from './Table-regional'

const Regional = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Page Regional</strong>
          </CCardHeader>
          <CCardBody>
            <TableRegional />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Regional
