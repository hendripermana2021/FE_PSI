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

const EditUser = (props) => {
  const { user: data, refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  // Initialize states for form fields
  const [name, setName] = useState(data.name)
  const [email, setEmail] = useState(data.email)
  const [provinceId, setProvinceId] = useState(data.province?.id || '') // Use id instead of name
  const [regionId, setRegionId] = useState(data.region?.id || '') // Use id instead of name
  const [role, setRole] = useState(data.role?.role_name || '')
  const [roleList, setRoleList] = useState([])
  const [sex, setSex] = useState(data?.sex || '')
  const [password, setPassword] = useState(data?.real_password || '')

  const [provinces, setProvinces] = useState([]) // For storing all provinces
  const [regions, setRegions] = useState([]) // For storing regions based on selected province

  const navigate = useNavigate()

  const getRole = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}role`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setRoleList(response.data.data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  console.log(data)

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

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!name || !email || !provinceId || !regionId || !role || !sex || !password) {
      setLoading(false)
      return Swal.fire({ icon: 'error', title: 'All fields must be filled' })
    }

    try {
      const response = await axios.put(
        `${serverSourceDev}users/update/${data.id}`,
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
        Swal.fire({ icon: 'success', title: 'User updated successfully' }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      Swal.fire({ icon: 'error', title: 'Error updating user data', text: error.message })
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
      <CButton onClick={() => setVisible(true)}>Edit User</CButton>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={updateHandler}>
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

                  {/* Add other roles as needed */}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Password</h6>
                <div className="d-flex align-items-center">
                  <CFormInput
                    type={visiblePasswords ? 'text' : 'password'}
                    placeholder="Enter new password"
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
                {loading ? 'Saving...' : 'Save changes'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

EditUser.propTypes = {
  user: propTypes.object.isRequired, // Prop validation for user object
  refreshTable: propTypes.func.isRequired, // Function to refresh the table after updating
}

export default EditUser
