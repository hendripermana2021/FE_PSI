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
} from '@coreui/react'
import { serverSourceDev } from '../../constantaEnv'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'

const AddRegional = (props) => {
  const { refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [regional, setRegional] = useState('')
  const [province, setProvince] = useState([]) // Stores the list of provinces
  const [selectedProvince, setSelectedProvince] = useState('') // Stores the selected province

  useEffect(() => {
    getProvince()
  }, [])

  const getProvince = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}province`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProvince(response.data.data)
      setLoading(false)
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
      setLoading(false)
    }
  }

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${serverSourceDev}regional/create`,
        {
          id_province: selectedProvince, // Sending the selected province ID
          name_region: regional,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // Correctly formatting the Authorization header
          },
        },
      )

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data Berhasil Diupdate',
        }).then(() => {
          setVisible(false) // Close the modal
          refreshTable() // Trigger table refresh
          setRegional('')
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error updating data',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} variant="outline" color="primary">
        Add Region
      </CButton>
      <CModal
        alignment="center"
        scrollable
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Add Region</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={updateHandler}>
            <CRow>
              {/* Province Dropdown */}
              <CCol md={12} sm={12} className="mb-3 mt-3">
                <CFormSelect
                  id="floatingSelect"
                  aria-label="Select Province"
                  floatingLabel="Select Province"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)} // Update selected province
                  required
                >
                  <option value="" hidden>
                    Select Province
                  </option>
                  {province.map((prov, index) => (
                    <option key={index} value={prov.id}>
                      {prov.name_province}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Region Name Input */}
              <CCol md={12} sm={12} className="mb-3 mt-3">
                <CFormInput
                  type="text"
                  id="floatingtext"
                  floatingLabel="Name Regional"
                  placeholder="Name Regional"
                  value={regional}
                  onChange={(e) => setRegional(e.target.value)}
                  required
                />
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit">
                {loading ? 'Saving...' : 'Save changes'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

AddRegional.propTypes = {
  refreshTable: propTypes.func.isRequired,
}

export default AddRegional
