import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import propTypes from 'prop-types'

const ProfileModal = (props) => {
  const user = props.user || {}
  const [modal, setModal] = useState(false)
  const [name, setName] = useState(user.name)
  const [sex, setSex] = useState(user.sex)
  const [email, setEmail] = useState(user.email)
  const [roleId, setRoleId] = useState(user.role_id)
  const [visible, setVisible] = useState(false)

  console.log('Name: ' + name)
  console.log('Sex: ' + sex)
  console.log('Email: ' + email)
  console.log('Role ID: ' + roleId)

  console.log('Profile Users123123 :', user)

  const toggleModal = () => {
    setModal(!modal)
  }

  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>Profile</CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Edit User Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel="Name"
                  placeholder="Name"
                  value={user.name}
                  readOnly
                />
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="email"
                  floatingLabel="Email"
                  placeholder="Email"
                  value={user.email}
                  readOnly
                />
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel="Sex"
                  placeholder="Sex"
                  value={user.sex == 1 ? 'Male' : 'Female'}
                  readOnly
                />
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel="Role"
                  placeholder="Role"
                  value={user.role_id === 1 ? 'Admin' : 'Pegawai'}
                  readOnly
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

ProfileModal.propTypes = {
  user: propTypes.object,
}

export default ProfileModal
