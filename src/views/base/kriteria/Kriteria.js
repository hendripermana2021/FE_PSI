import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { constantaSource } from '../../constantaEnv'
import TableKriteria from './Table-kriteria'

const Kriteria = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Kriteria Page</strong>
            <small> {String(constantaSource.PageHeader)}</small>
          </CCardHeader>
          <CCardBody>
            <TableKriteria />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Kriteria
