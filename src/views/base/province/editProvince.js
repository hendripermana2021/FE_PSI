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
} from '@coreui/react'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import { formatRupiah } from '../../functionGlobal'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'

const EditRegional = (props) => {
  const data = props.program // Change 'programs' to match props
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [name_program, setNameProgram] = useState(data.name_program)
  const [dana, setDana] = useState(data.total_dana_alokasi)

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    // form validation
    if (!name_program) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'Nama tidak boleh kososng' })
    }
    if (!dana) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'Email tidak boleh kososng' })
    }

    try {
      await axios
        .put(
          `${serverSourceDev}program/update/${data.id}`,
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
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Data Berhasil Diupdate',
            }).then(() => {
              handleShow()
              navigate('/master/programs')
            })
          }
        })
    } catch (error) {
      console.log(error.message)
      Swal.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }
  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>Edit Data</CButton>
      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredScrollableExample2">Update Programs</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12} sm={12} className="mb-3">
              <CFormInput
                type="text"
                id="floatingtext"
                floatingLabel="Name Program"
                placeholder="Name Program"
                value={name_program}
                onChange={(e) => setNameProgram(e.target.value)}
              />
            </CCol>
            <CCol md={12} sm={12}>
              <CFormInput
                type="number"
                id="floatingtext"
                floatingLabel="Total Dana"
                placeholder="Total Dana"
                value={dana}
                onChange={(e) => setDana(e.target.value)}
              />
            </CCol>
          </CRow>
          <div className="col-md-6 col-sm-12"></div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

EditRegional.propTypes = {
  program: propTypes.object.isRequired, // Corrected prop name to 'programs'
}

export default EditRegional
