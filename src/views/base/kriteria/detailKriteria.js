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
  CFormFloating,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CFormTextarea,
} from '@coreui/react'
import propTypes from 'prop-types'

const DetailKriteria = ({ kriteria }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>Detail Data Kriteria</CButton>
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Detail Kriteria and Sub Kriteria</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12} sm={12} className="mb-3">
              <CFormInput
                type="text"
                floatingLabel="Nama Kriteria"
                placeholder="Nama Kriteria"
                value={kriteria.name_kriteria}
                readOnly
              />
            </CCol>

            <CCol md={12} sm={12} className="mb-3">
              <h6>Sub Kriteria</h6>
              <CAccordion activeItemKey={0}>
                {kriteria.sub_kriteria?.map((sub_kriterias, index) => (
                  <CAccordionItem itemKey={index + 1} key={index + 1}>
                    <CAccordionHeader>Sub Kriteria - {index + 1}</CAccordionHeader>
                    <CAccordionBody>
                      <CFormFloating className="mb-3">
                        <CFormInput
                          type="text"
                          floatingLabel="Nama Sub Kriteria"
                          value={sub_kriterias.name_sub}
                          readOnly
                        />
                      </CFormFloating>

                      <CFormFloating className="mb-3">
                        <CFormInput
                          type="number"
                          floatingLabel="Nilai Sub-Kriteria"
                          value={sub_kriterias.value}
                          readOnly
                        />
                      </CFormFloating>

                      <CFormTextarea
                        floatingLabel="Deskripsi Sub-Kriteria"
                        value={sub_kriterias.description || ''}
                        rows={3}
                        readOnly
                      />
                    </CAccordionBody>
                  </CAccordionItem>
                ))}
              </CAccordion>
            </CCol>
          </CRow>
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

DetailKriteria.propTypes = {
  kriteria: propTypes.shape({
    name_kriteria: propTypes.string.isRequired,
    sub_kriteria: propTypes.arrayOf(
      propTypes.shape({
        name_sub: propTypes.string.isRequired,
        value: propTypes.number.isRequired,
        description: propTypes.string,
      }),
    ).isRequired,
  }).isRequired,
}

export default DetailKriteria
