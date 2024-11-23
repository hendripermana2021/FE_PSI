import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCol,
  CRow,
  CFormInput,
} from '@coreui/react'
import propTypes from 'prop-types'

const DetailRoles = (props) => {
  const data = props.role // Change 'programs' to match props
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>Detail Data</CButton>
      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredScrollableExample2">Detail Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12} sm={12} className="mb-3">
              <CFormInput
                type="text"
                id="floatingtext"
                floatingLabel="Role Name"
                placeholder="Role Name"
                value={data.role_name}
                readOnly
              />
            </CCol>
          </CRow>
          <div className="col-md-6 col-sm-12"></div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

DetailRoles.propTypes = {
  role: propTypes.object.isRequired, // Corrected prop name to 'programs'
}

export default DetailRoles
