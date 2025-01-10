import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { constantaSource } from '../../../constant/constantaEnv'
import TableAjuanPegawai from './tableAjuanPegawai'

const AjuanPegawai = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Ajuan Page</strong>
            <small> {String(constantaSource.PageHeader)}</small>
          </CCardHeader>
          <CCardBody>
            <TableAjuanPegawai />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AjuanPegawai
