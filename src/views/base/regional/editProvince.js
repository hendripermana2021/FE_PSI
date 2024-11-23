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
  CFormFloating,
  CSpinner,
} from '@coreui/react'
import { serverSourceDev } from '../../constantaEnv'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'

const EditProvince = ({ province: data, refreshTable }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [provinceList, setProvinceList] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(data.name_province)
  const [selectedRegional, setSelectedRegional] = useState(
    data.region.map((region) => ({ id: region.id, name_region: region.name_region })),
  )

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
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Province data')
      }
      console.log(error, 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    const allRegion = selectedRegional.map((region) => ({
      id: region.id,
      name_region: region.name_region,
    }))

    try {
      const response = await axios.put(
        `${serverSourceDev}province-sub/update/${data.id}`,
        {
          name_province: selectedProvince,
          region: allRegion,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

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
      <CButton onClick={() => setVisible(true)}>Edit Data</CButton>

      <CModal
        alignment="center"
        backdrop="static"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Update Province and Region</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={updateHandler}>
            <CRow>
              {/* Province Dropdown */}
              <CCol md={12} className="mb-4 mt-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Name Province"
                    label="Name Province"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    placeholder="Enter Name Province"
                    required
                  />
                </CFormFloating>
              </CCol>

              {/* Dynamic Region Inputs */}
              <CCol md={12}>
                <h6>Regions</h6>
                {selectedRegional.map((region, index) => (
                  <CCol key={region.id} className="mb-3">
                    <CFormInput
                      type="text"
                      id={`region-${index}`}
                      floatingLabel={`Region ${index + 1} Name`}
                      value={region.name_region}
                      onChange={(e) =>
                        setSelectedRegional((prev) => {
                          const updated = [...prev]
                          updated[index].name_region = e.target.value
                          return updated
                        })
                      }
                      required
                    />
                  </CCol>
                ))}
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

EditProvince.propTypes = {
  province: propTypes.shape({
    id: propTypes.number.isRequired,
    name_province: propTypes.string.isRequired,
    region: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.number.isRequired,
        name_region: propTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  refreshTable: propTypes.func.isRequired,
}

export default EditProvince
