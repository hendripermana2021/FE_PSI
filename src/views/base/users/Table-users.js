import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import Swal from 'sweetalert2'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa' // Eye icons for show/hide
import EditUser from './editUsers'
import DetailUser from './detailUsers'
import CreateUsers from './addUsers'

const TableUsers = () => {
  const [users, setUsers] = useState([])
  const [role, setRole] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable('#tableUsers')) {
      $(document).ready(function () {
        const tableInterval = setInterval(() => {
          if ($('#tableUsers').is(':visible')) {
            clearInterval(tableInterval)
            $('#tableUsers').DataTable()
          }
        }, 1000)
      })
    }
    getUsers()
    getRole()
  }, [])

  const getUsers = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}users`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setUsers(response.data.data)
      setLoading(false)
      console.log(sessionStorage.getItem('accessToken'))
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Users data')
      }
      console.log(error, 'Error fetching data')
      setLoading(false)
    }
  }

  const getRole = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}role`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setRole(response.data.data)
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Role data')
      }
      console.log(error, 'Error fetching data')
    }
  }

  const deleteHandler = async (data) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${serverSourceDev}users/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getUsers()
          Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting data:', error)
          Swal.fire('Error!', 'Your data cannot be deleted.', 'error')
        }
      }
    })
  }

  console.log('checkData', users)

  const [visiblePasswords, setVisiblePasswords] = useState({})

  // Function to toggle password visibility for a specific user
  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the current visibility state
    }))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={9}>
                {' '}
                <strong>Role Users</strong> <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
              <CCol md={3} className="text-end">
                <CreateUsers refreshTable={getUsers} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover" id="tableUsers">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Sex</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Province</th>
                  <th className="text-center">Region</th>
                  <th className="text-center">Password</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No Users available
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{user?.name || 'N/A'}</td>
                      <td>{user?.sex || 'N/A'}</td>
                      <td>{user?.email || 'N/A'}</td>
                      <td>{user?.province?.name_province || 'N/A'}</td>
                      <td>{user?.region?.name_region || 'N/A'}</td>
                      <td className="text-center">
                        {visiblePasswords[index] ? (
                          <span>{user?.real_password || 'N/A'}</span>
                        ) : (
                          <span>••••••</span>
                        )}
                        <CButton
                          color="link"
                          size="sm"
                          onClick={() => togglePasswordVisibility(index)}
                          className="ms-2"
                        >
                          {visiblePasswords[index] ? <FaEyeSlash /> : <FaEye />}
                        </CButton>
                      </td>
                      <td>{user?.role?.role_name || 'N/A'}</td>
                      <td className="text-center">
                        <CDropdown variant="btn-group" key={index}>
                          <CButton color="primary">Action</CButton>
                          <CDropdownToggle color="primary" split />
                          <CDropdownMenu>
                            <CDropdownItem>
                              <EditUser user={user} role={role} refreshTable={getUsers} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <DetailUser user={user} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <CButton onClick={() => deleteHandler(user)}>Delete Data</CButton>
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TableUsers
