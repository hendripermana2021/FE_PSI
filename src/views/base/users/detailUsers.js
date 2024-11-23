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
  CFormSelect,
} from '@coreui/react'
import propTypes from 'prop-types'
import axios from 'axios'
import { serverSourceDev } from '../../constantaEnv'

const DetailUser = (props) => {
  const { user: data } = props
  const [visible, setVisible] = useState(false)

  // States for form fields
  const [province, setProvince] = useState('')
  const [region, setRegion] = useState('')
  const [role, setRole] = useState(data.role?.role_name || '')
  const [sex, setSex] = useState(data?.sex || '')
  const [provinces, setProvinces] = useState([]) // For storing provinces
  const [regions, setRegions] = useState([]) // For storing regions based on province

  // Fetch all provinces on component mount
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await axios.get(`${serverSourceDev}province-sub`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        })
        setProvinces(response.data.data)
        const selectedProvince = response.data.data.find((prov) => prov.id === data.province?.id)
        setProvince(selectedProvince?.name_province || '')
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
      }
    }
    getProvinces()
  }, [data.province?.id])

  // Fetch regions based on provinceId
  useEffect(() => {
    if (data.province?.id) {
      const getRegions = async () => {
        try {
          const response = await axios.get(
            `${serverSourceDev}regional/byprovince/${data.province?.id}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
              },
            },
          )
          setRegions(response.data.data)
          const selectedRegion = response.data.data.find((reg) => reg.id === data.region?.id)
          setRegion(selectedRegion?.name_region || '')
        } catch (error) {
          if (error.response.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'Data Tidak Ada',
              text: 'Maaf Data tidak ditemukan atau belum dibuat',
            })
          } else {
            handleError(error, 'Error fetching Regions data')
          }
          console.log(error, 'Error fetching data')
        }
      }
      getRegions()
    }
  }, [data.province?.id, data.region?.id])

  return (
    <>
      <CButton onClick={() => setVisible(true)}>View Details</CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow>
            <CCol md={12} className="mb-3 mt-3">
              <CFormInput type="text" floatingLabel="Name" value={data.name} disabled />
            </CCol>

            <CCol md={12} className="mb-3">
              <CFormInput type="email" floatingLabel="Email" value={data.email} disabled />
            </CCol>

            <CCol md={12} className="mb-3">
              <h6>Sex</h6>
              <CFormSelect value={sex} disabled>
                <option value="Laki-laki">Laki-laki (Male)</option>
                <option value="Perempuan">Perempuan (Female)</option>
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mb-3">
              <h6>Province</h6>
              <CFormSelect value={province} disabled>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.name_province}>
                    {prov.name_province}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mb-3">
              <h6>Region</h6>
              <CFormSelect value={region} disabled>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.name_region}>
                    {reg.name_region}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mb-3">
              <h6>Role</h6>
              <CFormSelect value={role} disabled>
                <option>{role}</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModalBody>
      </CModal>
    </>
  )
}

DetailUser.propTypes = {
  user: propTypes.object.isRequired, // Prop validation for user object
}

export default DetailUser
