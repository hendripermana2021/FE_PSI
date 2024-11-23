import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { DocsExample } from 'src/components'

import ReactImg from 'src/assets/images/react.jpg'
import { constantaSource } from '../../constantaEnv'
import TableGenerate from './Table-generate'

const Generate = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Generate Page</strong>
            <small> {String(constantaSource.PageHeader)}</small>
          </CCardHeader>
          <CCardBody>
            <TableGenerate />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Generate
