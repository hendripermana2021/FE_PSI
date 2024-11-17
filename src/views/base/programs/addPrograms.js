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
  CForm,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'
import { serverSourceDev } from '../../constantaEnv'

const AddPrograms = (props) => {
  const { refreshTable } = props // Fixed: using 'program' prop
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [name_program, setNameProgram] = useState('')
  const [dana, setDana] = useState('')

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Form validation
    if (!name_program) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'Nama program tidak boleh kosong' })
    }
    if (!dana) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'Dana tidak boleh kosong' })
    }

    try {
      const response = await axios.post(
        `${serverSourceDev}program/create`,
        {
          name_program: name_program,
          total_dana_alokasi: dana,
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
          title: 'Data Berhasil Ditambah',
        }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      console.error(error.message)
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
      <CButton onClick={() => setVisible(true)} color="primary">
        Tambah Program
      </CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Tambah Program</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={updateHandler}>
            <CRow>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel="Name Program"
                  placeholder="Name Program"
                  value={name_program}
                  onChange={(e) => setNameProgram(e.target.value)}
                />
              </CCol>
              <CCol md={12}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Rp</CInputGroupText>
                  <CFormInput
                    type="number"
                    floatingLabel="Total Dana"
                    placeholder="Total Dana"
                    value={dana}
                    onChange={(e) => setDana(e.target.value)}
                  />
                  <CInputGroupText>.00</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

AddPrograms.propTypes = {
  program: propTypes.object.isRequired, // Correct prop validation
  refreshTable: propTypes.func.isRequired,
}

export default AddPrograms
