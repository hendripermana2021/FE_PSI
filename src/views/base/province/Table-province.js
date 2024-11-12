import React, { useState, useMemo, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import EditRegional from './editProvince'
import DetailPrograms from './detailProvince'

const TableRegional = () => {
  useEffect(() => {
    if (!$.fn.DataTable.isDataTable('#tableSantris')) {
      $(document).ready(function () {
        const tableInterval = setInterval(() => {
          if ($('#tableSantris').is(':visible')) {
            clearInterval(tableInterval)
            $('#tableSantris').DataTable()
          }
        }, 1000)
      })
    }
  }, [])

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
          await axios.delete(`${serverSourceDev}regional/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getProgram()
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
            <strong>Regional Table</strong> <small>(Showing, Create, Edit Regional)</small>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tableSantris">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name Province</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : program.length === 0 ? (
                  <tr>
                    <td colSpan="7">No rooms available</td>
                  </tr>
                ) : (
                  program.map((programs, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{programs.name_program}</td>
                      <td className="text-center">{formatRupiah(programs.total_dana_alokasi)}</td>
                      <td className="text-center">
                        <CDropdown variant="btn-group" key={index}>
                          <CButton color="primary">Action</CButton>
                          <CDropdownToggle color="primary" split />
                          <CDropdownMenu>
                            <CDropdownItem>
                              <EditRegional regional={programs} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <DetailPrograms regional={programs} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <CButton onClick={() => deleteHandler(programs)}>Delete Data</CButton>
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

export default TableRegional
