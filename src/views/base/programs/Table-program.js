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
  CDropdownDivider,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import Swal from 'sweetalert2'
import axios from 'axios'
import EditPrograms from './editPrograms'
import DetailPrograms from './detailPrograms'
import AddPrograms from './addPrograms'
import AddProgramKriteria from './addProgramKriteria'
import { formatRupiah } from '../../functionGlobal'

const TableProgram = () => {
  const [program, setProgram] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProgram()
  }, [])

  const getProgram = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}program-kriteria`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProgram(response.data.data)
      setLoading(false)
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
          await axios.delete(`${serverSourceDev}program/delete/${data.id}`, {
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

  const deleteKriteria = async (data) => {
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
          await axios.delete(`${serverSourceDev}program-kriteria/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          console.log('deleted ID :', data.id)
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
            <CRow>
              <CCol md={7}>
                <strong>Program Table</strong> <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
              <CCol md={5} className="text-end">
                <AddPrograms refreshTable={getProgram} />{' '}
                <AddProgramKriteria refreshTable={getProgram} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tblPrograms">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name Program</th>
                  <th className="text-center">Kriteria</th>
                  <th className="text-center">Sub-Kriteria</th>
                  <th className="text-center">Dana Allocated</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : program.length === 0 ? (
                  <tr>
                    <td colSpan="6">No rooms available</td>
                  </tr>
                ) : (
                  program.map((programs, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        {/* Row span for index and program name, covers all kriteria */}
                        <td
                          className="text-center"
                          rowSpan={programs.programs_kriteria.reduce(
                            (sum, kriteria) => sum + kriteria.kriteria.sub_kriteria.length,
                            0,
                          )}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="text-center"
                          rowSpan={programs.programs_kriteria.reduce(
                            (sum, kriteria) => sum + kriteria.kriteria.sub_kriteria.length,
                            0,
                          )}
                        >
                          {programs.name_program}
                        </td>

                        {/* First kriteria with its rowspan set to sub_kriteria.length */}
                        <td rowSpan={programs.programs_kriteria[0].kriteria.sub_kriteria.length}>
                          {programs.programs_kriteria[0]?.kriteria?.name_kriteria ? (
                            <CRow>
                              <CCol>{programs.programs_kriteria[0].kriteria.name_kriteria}</CCol>
                              <CCol>
                                <CButton
                                  color="danger"
                                  onClick={() => deleteKriteria(programs.programs_kriteria[0])}
                                >
                                  Delete
                                </CButton>{' '}
                              </CCol>
                            </CRow>
                          ) : (
                            'kosong'
                          )}
                        </td>

                        {/* First sub_kriteria of the first kriteria */}
                        <td>
                          {programs.programs_kriteria[0]?.kriteria?.sub_kriteria[0]?.name_sub ? (
                            <CRow>
                              <CCol>
                                {programs.programs_kriteria[0].kriteria.sub_kriteria[0].name_sub}
                              </CCol>
                              <CCol>
                                {programs.programs_kriteria[0].kriteria.sub_kriteria[0].value}
                              </CCol>
                            </CRow>
                          ) : (
                            'kosong'
                          )}
                        </td>

                        {/* Total dana alokasi */}
                        <td
                          className="text-center"
                          rowSpan={programs.programs_kriteria.reduce(
                            (sum, kriteria) => sum + kriteria.kriteria.sub_kriteria.length,
                            0,
                          )}
                        >
                          {formatRupiah(programs.total_dana_alokasi)}
                        </td>

                        {/* Action buttons */}
                        <td className="text-center">
                          <CDropdown variant="btn-group" key={index}>
                            <CButton color="primary">Action</CButton>
                            <CDropdownToggle color="primary" split />
                            <CDropdownMenu>
                              <CDropdownItem>
                                <EditPrograms refreshTable={getProgram} program={programs} />
                              </CDropdownItem>
                              <CDropdownItem>
                                {/* <DetailPrograms program={programs} /> */}
                              </CDropdownItem>
                              <CDropdownItem>
                                <CButton onClick={() => deleteHandler(programs)}>
                                  Delete Data
                                </CButton>
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </td>
                      </tr>

                      {/* Rendering the rest of sub_kriteria for the first kriteria */}
                      {programs.programs_kriteria[0].kriteria.sub_kriteria
                        .slice(1)
                        .map((sub, subIndex) => (
                          <tr key={`sub_kriteria_${subIndex}`}>
                            <td>
                              <CRow>
                                <CCol>{sub.name_sub}</CCol>
                                <CCol>{sub.value}</CCol>
                              </CRow>
                            </td>
                          </tr>
                        ))}

                      {/* Rendering the rest of the kriteria and their sub_kriteria */}
                      {programs.programs_kriteria.slice(1).map((kriteria, kriteriaIndex) => (
                        <React.Fragment key={`kriteria_${kriteriaIndex}`}>
                          <tr>
                            <td rowSpan={kriteria.kriteria.sub_kriteria.length}>
                              {kriteria.kriteria?.name_kriteria ? (
                                <CRow>
                                  <CCol>{kriteria.kriteria.name_kriteria}</CCol>
                                  <CCol>
                                    <CButton
                                      color="danger"
                                      onClick={() => deleteKriteria(kriteria)}
                                    >
                                      Delete
                                    </CButton>{' '}
                                  </CCol>
                                </CRow>
                              ) : (
                                ''
                              )}
                            </td>

                            {/* First sub_kriteria of each kriteria */}
                            <td>
                              {kriteria.kriteria?.sub_kriteria[0]?.name_sub ? (
                                <CRow>
                                  <CCol>{kriteria.kriteria.sub_kriteria[0].name_sub}</CCol>
                                  <CCol>{kriteria.kriteria.sub_kriteria[0].value}</CCol>
                                </CRow>
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>

                          {/* Render other sub_kriteria for the current kriteria */}
                          {kriteria.kriteria.sub_kriteria.slice(1).map((sub, subIndex) => (
                            <tr key={`sub_kriteria_${kriteriaIndex}_${subIndex}`}>
                              <td>
                                <CRow>
                                  <CCol>{sub.name_sub}</CCol>
                                  <CCol>{sub.value}</CCol>
                                </CRow>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
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

export default TableProgram
