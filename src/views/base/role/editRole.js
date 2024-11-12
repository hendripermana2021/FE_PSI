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
} from '@coreui/react'
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'
import { serverSourceDev } from '../../constantaEnv'
import { useNavigate } from 'react-router-dom' // Assuming you are using react-router-dom
import { formatRupiah } from '../../functionGlobal'

const EditRoles = (props) => {
  const { refreshTable, role } = props // Only refreshTable since we're creating a new role
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [role_name, setRoleName] = useState(role.role_name)

  console.log(role.id)

  const createHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Form validation
    if (!role_name) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'Name role tidak boleh kosong' })
    }

    try {
      const response = await axios.put(
        `${serverSourceDev}role/update/${role.id}`,
        {
          // Change to the correct POST endpoint
          role_name: role_name,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

      if (response.status === 200) {
        // Usually, 201 is returned for a successful creation
        Swal.fire({
          icon: 'success',
          title: 'Data Success Updated', // Changed title for clarity
        }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      console.error(error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error creating data',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)}>Edit Role</CButton> {/* Updated button text */}
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create New Role</CModalTitle> {/* Updated title */}
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={createHandler}>
            <CRow>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel="Role Name"
                  placeholder="Role Name"
                  value={role_name}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Role'} {/* Updated button text */}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

EditRoles.propTypes = {
  refreshTable: propTypes.func.isRequired, // Only refreshTable is needed for creating a new role
  role: propTypes.object.isRequired,
}

export default EditRoles
