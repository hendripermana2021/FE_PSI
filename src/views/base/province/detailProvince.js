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

const DetailPrograms = (props) => {
  const data = props.program // Change 'programs' to match props
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
          <CModalTitle id="VerticallyCenteredScrollableExample2">Update Programs</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12} sm={12} className="mb-3">
              <CFormInput
                type="text"
                id="floatingtext"
                floatingLabel="Name Program"
                placeholder="Name Program"
                value={data.name_program}
                readOnly
              />
            </CCol>
            <CCol md={12} sm={12}>
              <CFormInput
                type="number"
                id="floatingtext"
                floatingLabel="Total Dana"
                placeholder="Total Dana"
                value={data.total_dana_alokasi}
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

DetailPrograms.propTypes = {
  program: propTypes.object.isRequired, // Corrected prop name to 'programs'
}

export default DetailPrograms
