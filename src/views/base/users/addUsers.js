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
import propTypes from 'prop-types'
import Swal from 'sweetalert2'
import axios from 'axios'
import { serverSourceDev } from '../../constantaEnv'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa' // Eye icons for show/hide

const CreateUsers = ({ refreshTable }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  // Initialize states for form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [role, setRole] = useState('')
  const [roleList, setRoleList] = useState([])
  const [sex, setSex] = useState('')
  const [password, setPassword] = useState('')

  const [provinces, setProvinces] = useState([]) // For storing all provinces
  const [regions, setRegions] = useState([]) // For storing regions based on selected province

  console.log('name', name)
  console.log('email', email)
  console.log('regions', regionId)
  console.log('Province', provinceId)
  console.log('Role', role)
  console.log('Sex', sex)
  console.log('Password', password)

  const navigate = useNavigate()

  // Fetch roles from the server
  const getRole = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}role`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setRoleList(response.data.data)
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

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
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }
    getRole()
    getProvinces()
  }, [])

  // Fetch regions based on selected provinceId
  useEffect(() => {
    if (provinceId) {
      const getRegions = async () => {
        try {
          const response = await axios.get(`${serverSourceDev}regional/byprovince/${provinceId}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          setRegions(response.data.data) // Update regions based on province
        } catch (error) {
          console.error('Error fetching regions:', error)
        }
      }

      getRegions()
    }
  }, [provinceId])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    // if (!name || !email || !provinceId || !regionId || !role || !sex || !password) {
    //   setLoading(false)
    //   return Swal.fire({ icon: 'error', title: 'All fields must be filled' })
    // }

    try {
      const response = await axios.post(
        `${serverSourceDev}users/register`, // Adjusted to use POST for creating user
        {
          name: name,
          sex: sex,
          email: email,
          password: password,
          role_id: role,
          region_id: regionId,
          province_id: provinceId,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

      if (response.status === 200) {
        Swal.fire({ icon: 'success', title: 'User created successfully' }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      Swal.fire({ icon: 'error', title: 'Error creating user', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const [visiblePasswords, setVisiblePasswords] = useState(false)

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setVisiblePasswords((prevState) => !prevState)
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color="primary">
        Create User
      </CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create New User</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={submitHandler}>
            <CRow>
              <CCol md={12} className="mb-3 mt-3">
                <CFormInput
                  type="text"
                  floatingLabel="Name"
                  placeholder="Enter user name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormInput
                  type="email"
                  floatingLabel="Email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select Sex</h6>
                <CFormSelect value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="" selected hidden>
                    Choose Sex
                  </option>
                  <option value="Laki-laki">Laki-laki (Male)</option>
                  <option value="Perempuan">Perempuan (Female)</option>
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select Province</h6>
                <CFormSelect value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
                  <option value="">Select Province</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name_province}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select Region</h6>
                <CFormSelect
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  disabled={!provinceId}
                >
                  <option value="">Select Region</option>
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name_region}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select Role</h6>
                <CFormSelect value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="" hidden>
                    {role ? `Selected: ${role}` : 'Select Role'}
                  </option>
                  {roleList.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Password</h6>
                <div className="d-flex align-items-center">
                  <CFormInput
                    type={visiblePasswords ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <CButton color="link" onClick={togglePasswordVisibility}>
                    {visiblePasswords ? <FaEyeSlash /> : <FaEye />}
                  </CButton>
                </div>
              </CCol>
            </CRow>

            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Create User'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

CreateUsers.propTypes = {
  refreshTable: propTypes.func.isRequired, // Function to refresh the table after creation
}

export default CreateUsers
