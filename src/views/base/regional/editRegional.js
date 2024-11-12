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
  CForm,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { serverSourceDev } from '../../constantaEnv'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'

const EditRegional = ({ province: data, dataRegion: region, refreshTable }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [provinceList, setProvinceList] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(region?.id_province || '')
  const [selectedRegion, setSelectedRegion] = useState(region?.name_region || '')

  useEffect(() => {
    getProvince()
  }, [data])

  const getProvince = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${serverSourceDev}province-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProvinceList(response.data.data)
    } catch (error) {
      console.error('Error fetching province:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(
        `${serverSourceDev}regional/update/${region.id}`,
        {
          id_province: Number(selectedProvince),
          name_region: selectedRegion,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

      console.log(response)

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data Successfully Updated',
        }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Updating Data',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color="warning">
        Edit Data
      </CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update Region</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={updateHandler}>
            <CRow>
              {/* Province Dropdown */}
              <CCol md={12} className="mb-4 mt-3">
                <h6>Select Province</h6>
                <CFormSelect
                  aria-label="Select Province"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                >
                  <option value="" hidden>
                    {selectedProvince ? `Selected: ${selectedProvince}` : 'Select Province'}
                  </option>
                  {provinceList.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name_province}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Single Region Input */}
              <CCol md={12}>
                <CFormInput
                  type="text"
                  id="regionName"
                  floatingLabel="Region Name"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            <CModalFooter className="mt-4">
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Save Changes'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

EditRegional.propTypes = {
  province: propTypes.shape({
    id: propTypes.number.isRequired,
    name_province: propTypes.string.isRequired,
    region: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.number.isRequired,
        name_region: propTypes.string.isRequired,
        id_province: propTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  dataRegion: propTypes.object.isRequired,
  refreshTable: propTypes.func.isRequired,
}

export default EditRegional
