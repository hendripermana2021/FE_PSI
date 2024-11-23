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
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
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
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Program data')
      }
      console.log(error, 'Error fetching data')
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
                    <td colSpan="6" className="text-center">
                      No Program{' '}
                    </td>
                  </tr>
                ) : (
                  program.map((programs, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{programs.name_program}</td>
                      <td>
                        <CAccordion>
                          <CAccordionItem itemKey={index} key={index}>
                            <CAccordionHeader>Kriteria</CAccordionHeader>
                            <CAccordionBody>
                              <table className="table table-hover ">
                                <thead>
                                  <th className="text-center">No</th>
                                  <th className="text-center">Name Kriteria</th>
                                  <th className="text-center">Action</th>
                                </thead>
                                {programs.programs_kriteria?.map((value, indexProgramKriteria) => (
                                  <tr key={indexProgramKriteria}>
                                    <td className="mb-3">{indexProgramKriteria + 1}</td>
                                    <td>{value.kriteria.name_kriteria || ''}</td>
                                    <td>
                                      <CButton
                                        color="danger"
                                        onClick={() =>
                                          deleteKriteria(
                                            programs.programs_kriteria[indexProgramKriteria],
                                          )
                                        }
                                      >
                                        Delete
                                      </CButton>
                                    </td>
                                  </tr>
                                ))}
                              </table>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </td>
                      <td className="text-center">{formatRupiah(programs.total_dana_alokasi)}</td>
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

export default TableProgram
