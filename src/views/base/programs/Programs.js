import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardGroup,
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
import TableProgram from './Table-program'
import { constantaSource } from '../../constantaEnv'

const Program = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Page Programs</strong>
            <small> {String(constantaSource.PageHeader)} </small>
          </CCardHeader>
          <CCardBody>
            <TableProgram />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Program
