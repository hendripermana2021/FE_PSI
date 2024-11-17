import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import axios from 'axios'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import AddAjuanForm from './addAjuan'
import EditAjuan from './editAjuan'
import Swal from 'sweetalert2'
import DetailAjuan from './detailAjuan'

const TableGenerate = () => {
  const [program, setProgram] = useState('') // Default to empty string
  const [programList, setProgramList] = useState([])
  const [ajuan, setAjuan] = useState([])
  const [loading, setLoading] = useState(true)

  console.log('ajuan', ajuan)

  // Fetch Program data on mount
  useEffect(() => {
    getProgram()
  }, [])

  // Re-fetch Ajuan data when the selected program changes
  useEffect(() => {
    if (program) {
      getAjuan(program)
    }
  }, [program])

  // Initialize or destroy DataTable when ajuan data is updated
  useEffect(() => {}, [ajuan, loading])

  const getProgram = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}program-kriteria`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProgramList(response.data.data)
    } catch (error) {
      console.error('Error fetching program data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAjuan = async (programId) => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}ajuan/program/${programId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setAjuan(response.data.data)
      console.log(ajuan)
    } catch (error) {
      console.error('Error fetching ajuan data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
  }

  const deleteAjuan = async (data) => {
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
          await axios.delete(`${serverSourceDev}ajuan/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getAjuan(program) // Refresh the table after deletion
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
              <CCol md={7}>
                <strong>Table Ajuan</strong> <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
              <CCol md={5} className="text-end">
                <AddAjuanForm refreshTable={getProgram} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow className="mt-4 mb-3">
              <CCol md={6}></CCol>
              <CCol md={6} className="text-end">
                <h6>Select Program</h6>
                <CFormSelect value={program} onChange={(e) => setProgram(e.target.value)}>
                  <option value="99">Select Program</option>
                  {programList.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name_program}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <table className="table table-hover" id="tableAjuan">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Region</th>
                  <th>Programs</th>
                  <th>Jlh Dana</th>
                  <th>PSI Result</th>
                  <th>Commented</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : ajuan.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Ajuan available
                    </td>
                  </tr>
                ) : (
                  ajuan.map(
                    (programs, index) =>
                      (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{programs?.users.name || '-'}</td>
                          <td>{programs?.program.name_program || '-'}</td>
                          <td>{formatRupiah(programs.jlh_dana)}</td>
                          <td>{programs?.psi_result || 0}</td>
                          <td>{programs?.commented || '-'}</td>
                          <td>
                            {' '}
                            {programs?.req_status ? (
                              <CBadge color="danger">Belum Disetujui</CBadge>
                            ) : (
                              <CBadge color="success">Disetujui</CBadge>
                            )}{' '}
                          </td>
                          <td className="text-center">
                            <CDropdown variant="btn-group" key={index}>
                              <CButton color="primary">Action</CButton>
                              <CDropdownToggle color="primary" split />
                              <CDropdownMenu>
                                <CDropdownItem>
                                  <EditAjuan ajuan={programs} refreshTable={getAjuan} />
                                </CDropdownItem>
                                <CDropdownItem>
                                  <DetailAjuan ajuan={programs} />
                                </CDropdownItem>
                                <CDropdownItem>
                                  <CButton onClick={() => deleteAjuan(programs)}>
                                    Delete Data
                                  </CButton>
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </td>
                        </tr>
                      ) || '',
                  )
                )}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TableGenerate
