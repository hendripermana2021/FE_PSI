import React, { useState } from 'react'
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
  CListGroupItem,
  CListGroup,
  CSpinner,
  CCard,
  CCardBody,
  CBadge,
} from '@coreui/react'
import propTypes from 'prop-types'

const DetailRegional = (props) => {
  const { regional: data } = props
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  // Simulate loading for better UX
  const toggleVisible = () => {
    setVisible(!visible)
    setLoading(true) // Reset loading on modal open
    setTimeout(() => {
      setLoading(false)
    }, 500) // Simulate loading time
  }

  return (
    <>
      <CButton onClick={() => toggleVisible()}>Detail Region</CButton>

      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="ModalDetailRegional"
      >
        <CModalHeader>
          <CModalTitle id="ModalDetailRegional">Province and Region Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loading ? (
            <div className="text-center">
              <CSpinner color="primary" /> Loading...
            </div>
          ) : (
            <CCard>
              <CCardBody>
                <CRow>
                  {/* Province Information */}
                  <CCol md={12} sm={12} className="mb-4">
                    <h5 className="text-muted">Province</h5>
                    <CFormInput
                      type="text"
                      id="provinceName"
                      label="Province Name"
                      value={data.name_province}
                      readOnly
                    />
                  </CCol>

                  {/* Regional List */}
                  <CCol md={12} sm={12}>
                    <h5 className="text-muted">Regions</h5>
                    <CListGroup>
                      {data.region.map((regionalItem, index) => (
                        <CListGroupItem
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {regionalItem.name_region}
                          <CBadge color="primary" shape="rounded-pill">{`#${index + 1}`}</CBadge>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          )}
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

DetailRegional.propTypes = {
  regional: propTypes.shape({
    name_province: propTypes.string.isRequired,
    region: propTypes.arrayOf(
      propTypes.shape({
        name_region: propTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
}

export default DetailRegional
