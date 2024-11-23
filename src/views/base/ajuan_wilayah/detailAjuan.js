import React, { useState, useEffect } from 'react'
import {
  CForm,
  CRow,
  CCol,
  CButton,
  CFormTextarea,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormFloating,
} from '@coreui/react'
import propTypes from 'prop-types'

const DetailAjuan = (props) => {
  const { ajuan: data, refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [programId, setProgramId] = useState(data.id_program)
  const [programName, setProgramName] = useState(data.program.name_program)
  const [nameProvince, setNameProvince] = useState(data.province.name_province)
  const [provinceId, setProvinceId] = useState(data.id_province)
  const [nameRegion, setNameRegion] = useState(data.region ? data.region.name_region : '')
  const [regionId, setRegionId] = useState(data.id_region)
  const [username, setUsername] = useState(data.users.name)
  const [userId, setUserId] = useState(data.id_users)
  const [commented, setCommented] = useState(data.commented)
  const [visible, setVisible] = useState(false)
  const [kriteriaList, setKriteriaList] = useState(data.psi_data || [])
  const [subKriteriaId, setSubKriteriaId] = useState(data.psi_data.id_subkriteria)

  return (
    <>  
      <CButton onClick={() => setVisible(true)}>Detail Ajuan</CButton>

      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Edit Program</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={12} className="mb-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Programs"
                    label="Programs"
                    value={programName}
                    readOnly={true}
                  />
                </CFormFloating>
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Value Sub-Kriteria"
                    label="Value Sub-Kriteria"
                    value={nameProvince}
                    readOnly={true}
                  />
                </CFormFloating>
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Region"
                    label="Region"
                    value={nameRegion}
                    readOnly={true}
                  />
                </CFormFloating>
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Penanggung Jawab"
                    label="users"
                    value={username}
                    readOnly={true}
                  />
                </CFormFloating>
              </CCol>

              {kriteriaList.map((kriteria, index) => (
                <CCol md={6} key={kriteria.id} className="mb-3">
                  <h6>
                    {index + 1 + '.   '} {kriteria.kriteria.name_kriteria}
                  </h6>
                  <CFormFloating className="mb-3">
                    <CFormInput
                      type="text"
                      floatingLabel="Sub Kriteria"
                      label="sub kriteria"
                      value={kriteria.subkriteria.name_sub}
                      readOnly={true}
                    />
                  </CFormFloating>
                </CCol>
              ))}
              <CCol md={12} className="mb-3">
                <h6>Notes</h6>
                <CFormTextarea rows="5" value={commented} readOnly={true} />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

DetailAjuan.propTypes = {
  ajuan: propTypes.object,
  refreshTable: propTypes.func,
}

export default DetailAjuan
