import React, { useState, useEffect } from 'react'
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
  CDropdownDivider,
  CTooltip,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAccordion,
  CBadge,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import axios from 'axios'
import Swal from 'sweetalert2'
import AddKriteria from './addKriteria'
import EditSubKriteria from './editSubKriteria'
import DetailKriteria from './detailKriteria'
import EditKriteria from './editKriteria'
import AddSubKriteria from './addSubKriteria'

const TableKriteria = () => {
  const [kriteria, setKriteria] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getKriteria()
  }, [])

  const getKriteria = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}kriteria-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      console.log('data diterima', response.data.data)
      setKriteria(response.data.data)
      setLoading(false)
    } catch (error) {
      if (error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching kriteria data')
      }
      console.error('Error fetching region data:', error)
      setLoading(false)
    }
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
          await axios.delete(`${serverSourceDev}kriteria-sub/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getKriteria() // Refresh the table after deletion
          Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting data:', error)
          Swal.fire('Error!', 'Your data cannot be deleted.', 'error')
        }
      }
    })
  }

  const deleteSubKriteria = async (data) => {
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
          await axios.delete(`${serverSourceDev}sub-kriteria/delete/${data}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getKriteria() // Refresh the table after deletion
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
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={9}>
                <strong>Tabel Kriteria Table</strong> <small>{constantaSource.tableHeader}</small>
              </CCol>
              <CCol md={3} className="text-end">
                <AddKriteria refreshTable={getKriteria} />{' '}
                <AddSubKriteria refreshTable={getKriteria} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="TableKriteria">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name Kriteria</th>
                  <th className="text-center">Type</th>
                  <th className="text-center">Sub-Kriteria</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : kriteria.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  kriteria.map((kriterias, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{kriterias.name_kriteria}</td>
                      <td className="text-center">
                        {kriterias.type ? (
                          <CBadge color="success">Profit</CBadge>
                        ) : (
                          <CBadge color="danger">Cost</CBadge>
                        )}
                      </td>
                      <td>
                        <CAccordion>
                          <CAccordionItem itemKey={index} key={index}>
                            <CAccordionHeader>Sub-Kriteria</CAccordionHeader>
                            <CAccordionBody>
                              <table className="table table-hover ">
                                <thead>
                                  <th className="text-center">No</th>
                                  <th className="text-center">Name Sub</th>
                                  <th className="text-center">Value</th>
                                  <th className="text-center">Description</th>
                                  <th className="text-center">Action</th>
                                </thead>
                                {kriterias.sub_kriteria.map((subKriteria, index) => (
                                  <tr key={index}>
                                    <td className="mb-3">{index + 1}</td>
                                    <td>{subKriteria.name_sub}</td>
                                    <td>{subKriteria.value}</td>
                                    <td className="text-center">
                                      <CTooltip content={subKriteria.description} placement="top">
                                        <CButton color="secondary">C</CButton>
                                      </CTooltip>
                                    </td>
                                    <td className="text-center">
                                      <CButton
                                        color="danger"
                                        onClick={() => deleteSubKriteria(subKriteria.id)}
                                      >
                                        Delete
                                      </CButton>{' '}
                                      <EditSubKriteria
                                        kriteria={kriterias}
                                        dataSub={kriterias.sub_kriteria[index]}
                                        refreshTable={getKriteria}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </table>
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </td>
                      <td className="text-center">
                        <CDropdown variant="btn-group">
                          <CButton color="primary">Action</CButton>
                          <CDropdownToggle color="primary" split />
                          <CDropdownMenu>
                            <CDropdownItem>
                              <EditKriteria kriteria={kriterias} refreshTable={getKriteria} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <DetailKriteria kriteria={kriterias} />
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem type="button" onClick={() => deleteKriteria(kriterias)}>
                              Delete Kriteria
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

export default TableKriteria
