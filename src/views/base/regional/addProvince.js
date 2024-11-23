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

const AddProvince = (props) => {
  const { refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [province, setProvince] = useState('')

  const createHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${serverSourceDev}province/create`,
        {
          name_province: province,
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
          title: 'Data Province Berhasil Ditambahkan',
        }).then(() => {
          setVisible(false) // Close the modal
          refreshTable() // Trigger table refresh
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
      <CButton onClick={() => setVisible(true)} variant="outline" is color="primary">
        Add Province
      </CButton>
      <CModal
        alignment="center"
        backdrop="static"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Add Data Province</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={createHandler}>
            <CRow>
              {/* Province Dropdown */}
              <CCol md={12} sm={12} className="mb-3 mt-3">
                <CFormInput
                  type="text"
                  id="floatingtext"
                  floatingLabel="Name Province"
                  placeholder="Name Province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
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

AddProvince.propTypes = {
  refreshTable: propTypes.func.isRequired,
}

export default AddProvince
