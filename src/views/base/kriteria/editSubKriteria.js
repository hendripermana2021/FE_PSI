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
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Swal from 'sweetalert2'
import { serverSourceDev } from '../../constantaEnv'

const EditSubKriteria = ({ kriteria: initialData, dataSub: data, refreshTable }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [idKriteria, setIdKriteria] = useState(initialData?.id || '') // Now using id instead of name_kriteria
  const [kriteria, setKriteria] = useState([])
  const [sub, setSub] = useState(data?.name_sub || '')
  const [description, setDescription] = useState(data?.description || '')
  const [value, setValue] = useState(data?.value || '')

  console.log('editData', data)

  // Fetch kriteria on component mount or when initialData changes
  useEffect(() => {
    getKriteria()
  }, [initialData])

  const getKriteria = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}kriteria-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setKriteria(response.data.data || [])
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Kriteria data')
      }
      console.log(error, 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(
        `${serverSourceDev}sub-kriteria/update/${data.id}`,
        {
          id_kriteria: Number(idKriteria) || '', // Using the selected kriteria ID
          name_sub: sub || '',
          description: description || '',
          value: Number(value) || '',
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
          title: 'Data successfully updated!',
          confirmButtonText: 'OK',
        }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      console.error('Error updating sub-kriteria:', error.response || error) // Log the full error
      Swal.fire({
        icon: 'error',
        title: 'Failed to update data',
        text: error.response?.data?.message || 'An unexpected error occurred',
      })
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color="warning">
        Update
      </CButton>
      <CModal
        alignment="center"
        backdrop="static"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Update Sub Kriteria</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleUpdate}>
          <CModalBody>
            <CRow>
              <CCol md={12} className="mb-4 mt-3">
                <h6>Select Kriteria</h6>
                <CFormSelect
                  aria-label="Select Kriteria"
                  value={idKriteria}
                  onChange={(e) => {
                    setIdKriteria(e.target.value)
                    console.log('Selected Kriteria ID:', e.target.value)
                  }}
                  required
                >
                  <option value="" hidden>
                    {idKriteria ? `Selected: ${idKriteria}` : 'Select Kriteria'}
                  </option>
                  {kriteria.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name_kriteria} {/* Display name_kriteria, but store id */}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} sm={12} className="mb-3">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Name Sub"
                    placeholder="Total Dana"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                    required
                  />
                </CFormFloating>
              </CCol>

              <CCol md={12} sm={12} className="mb-3">
                <CFormInput
                  type="number"
                  floatingLabel="Value"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </CCol>

              <CCol md={12} sm={12} className="mb-3">
                <CFormTextarea
                  label="Descriptions"
                  rows={3}
                  text="Must be 8-20 words long."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </CCol>
            </CRow>

            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Kriteria'}
              </CButton>
            </CModalFooter>
          </CModalBody>
        </CForm>
      </CModal>
    </>
  )
}

EditSubKriteria.propTypes = {
  kriteria: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_kriteria: PropTypes.string.isRequired,
  }).isRequired,
  dataSub: PropTypes.shape({
    name_sub: PropTypes.string.isRequired,
    description: PropTypes.string,
    value: PropTypes.number,
    id: PropTypes.number,
  }).isRequired,
  refreshTable: PropTypes.func.isRequired,
}

export default EditSubKriteria
