import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DocsExample } from 'src/components'

import ReactImg from 'src/assets/images/react.jpg'
import TableAjuan from './Table-ajuan'
import { constantaSource } from '../../constantaEnv'

const Ajuan = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Ajuan Page</strong>
            <small> {String(constantaSource.PageHeader)}</small>
          </CCardHeader>
          <CCardBody>
            <TableAjuan />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Ajuan
