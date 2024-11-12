import React, { useState, useMemo, useEffect } from 'react'
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
import EditRoles from './editRole'
import DetailRoles from './detailRole'
import AddRoles from './addRole'

const TableRole = () => {
  const [role, setRole] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable('#tableRole')) {
      $(document).ready(function () {
        const tableInterval = setInterval(() => {
          if ($('#tableRole').is(':visible')) {
            clearInterval(tableInterval)
            $('#tableRole').DataTable()
          }
        }, 1000)
      })
    }
    getRole()
  }, [])

  const getRole = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}role`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setRole(response.data.data)
      setLoading(false)
      console.log(sessionStorage.getItem('accessToken'))
    } catch (error) {
      console.error('Error fetching room data:', error)
      setLoading(false)
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
          await axios.delete(`${serverSourceDev}role/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getRole()
          Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting data:', error)
          Swal.fire('Error!', 'Your data cannot be deleted.', 'error')
        }
      }
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={9}>
                {' '}
                <strong>Role Table</strong> <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
              <CCol md={3} className="text-end">
                <AddRoles refreshTable={getRole} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tableRole">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3">Loading...</td>
                  </tr>
                ) : role.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Role available</td>
                  </tr>
                ) : (
                  role.map((roles, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{roles.role_name}</td>
                      <td className="text-center">
                        <CDropdown variant="btn-group" key={index}>
                          <CButton color="primary">Action</CButton>
                          <CDropdownToggle color="primary" split />
                          <CDropdownMenu>
                            <CDropdownItem>
                              <EditRoles refreshTable={getRole} role={roles} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <DetailRoles role={roles} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <CButton onClick={() => deleteHandler(roles)}>Delete Data</CButton>
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

export default TableRole
