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
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import axios from 'axios'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import AddAjuanForm from './addAjuan'

const TableAjuan = () => {
  const [program, setProgram] = useState('') // Default to empty string
  const [programList, setProgramList] = useState([])
  const [ajuan, setAjuan] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize DataTable on mount
  useEffect(() => {
    getProgram()
  }, [])

  // Re-fetch Ajuan data when the selected program changes
  useEffect(() => {
    if (program) {
      getAjuan(program)
    }
  }, [program])

  // Reinitialize DataTable whenever the Ajuan data is updated
  useEffect(() => {
    if (!loading) {
      $('#tableAjuan').DataTable().destroy() // Destroy previous instance
      $('#tableAjuan').DataTable() // Reinitialize DataTable
    }
  }, [ajuan])

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
    } catch (error) {
      console.error('Error fetching ajuan data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
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
                  <option value="">Select Program</option>
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
                  <th>Name Pengaju</th>
                  <th>Programs</th>
                  <th>Jlh Dana</th>
                  <th>PSI</th>
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
                  ajuan.map((programs, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{programs?.name_pengaju || 'N/A'}</td>
                      <td>{programs?.name_program || 'N/A'}</td>
                      <td>{formatRupiah(programs.total_dana_alokasi)}</td>
                      <td>{programs?.psi || 'N/A'}</td>
                      <td>{programs?.commented || 'N/A'}</td>
                      <td>{programs?.status || 'N/A'}</td>
                      <td className="text-center">
                        <CDropdown variant="btn-group" key={index}>
                          <CButton color="primary">Action</CButton>
                          <CDropdownToggle color="primary" split />
                          <CDropdownMenu>
                            <CDropdownItem>View Details</CDropdownItem>
                            <CDropdownItem>Edit</CDropdownItem>
                            <CDropdownItem>Delete</CDropdownItem>
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

export default TableAjuan
