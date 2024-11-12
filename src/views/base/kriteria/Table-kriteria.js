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
      console.log(response.data.data)
      setKriteria(response.data.data)
      setLoading(false)
    } catch (error) {
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
          await axios.delete(`${serverSourceDev}sub-kriteria/delete/${data.id}`, {
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
      <CCol xs={12}>
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
                  <th>ID</th>
                  <th>Name Kriteria</th>
                  <th>Type</th>
                  <th>Sub-Kriteria</th>
                  <th>Value Sub</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : kriteria.length === 0 ? (
                  <tr>
                    <td colSpan="7">No data available</td>
                  </tr>
                ) : (
                  kriteria.map((kriterias, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="text-center" rowSpan={kriterias.sub_kriteria.length}>
                          {index + 1}
                        </td>
                        <td className="text-center" rowSpan={kriterias.sub_kriteria.length}>
                          {kriterias.name_kriteria}
                        </td>
                        <td className="text-center" rowSpan={kriterias.sub_kriteria.length}>
                          {kriterias.type ? (
                            <strong>
                              <span>Profit</span>
                            </strong>
                          ) : (
                            <span>Cost</span>
                          )}
                        </td>
                        <td>
                          {kriterias.sub_kriteria[0]?.name_sub ? (
                            <CRow>
                              <CCol>{kriterias.sub_kriteria[0]?.name_sub}</CCol>
                              <CCol>
                                <CButton
                                  color="danger"
                                  onClick={() => deleteSubKriteria(kriterias.sub_kriteria[0])}
                                >
                                  Delete
                                </CButton>{' '}
                                <EditSubKriteria
                                  kriteria={kriterias}
                                  dataSub={kriterias.sub_kriteria[0]}
                                  refreshTable={getKriteria}
                                />
                              </CCol>
                            </CRow>
                          ) : (
                            'kosong'
                          )}
                        </td>
                        <td>
                          {kriterias.sub_kriteria[0]?.value ? (
                            <CRow>
                              <CCol>{kriterias.sub_kriteria[0]?.value}</CCol>
                            </CRow>
                          ) : (
                            'kosong'
                          )}
                        </td>
                        <td>
                          {kriterias.sub_kriteria[0]?.description ? (
                            <CRow>
                              {' '}
                              <CCol>
                                <CTooltip
                                  content={kriterias.sub_kriteria[0]?.description}
                                  placement="top"
                                >
                                  <CButton color="secondary">C</CButton>
                                </CTooltip>
                              </CCol>
                            </CRow>
                          ) : (
                            'kosong'
                          )}
                        </td>
                        <td rowSpan={kriterias.sub_kriteria.length} className="text-center">
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
                              <CDropdownItem
                                type="button"
                                onClick={() => deleteKriteria(kriterias)}
                              >
                                Delete Kriteria
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </td>
                      </tr>

                      {/* Render the remaining regions for the current province */}
                      {kriterias.sub_kriteria.slice(1).map((region, regionIndex) => (
                        <tr key={regionIndex}>
                          <td>
                            {kriterias.sub_kriteria[0]?.name_sub ? (
                              <CRow>
                                <CCol>{region.name_sub}</CCol>
                                <CCol>
                                  <CButton
                                    color="danger"
                                    onClick={() =>
                                      deleteSubKriteria(kriterias.sub_kriteria[regionIndex + 1])
                                    }
                                  >
                                    Delete
                                  </CButton>{' '}
                                  <EditSubKriteria
                                    kriteria={kriterias}
                                    dataSub={region}
                                    refreshTable={getKriteria}
                                  />
                                </CCol>
                              </CRow>
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {kriterias.sub_kriteria[0]?.value ? (
                              <CRow>
                                <CCol>{region.value}</CCol>
                              </CRow>
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {kriterias.sub_kriteria[0]?.description ? (
                              <CRow>
                                {' '}
                                <CCol>
                                  <CTooltip content={region.description} placement="top">
                                    <CButton color="secondary">C</CButton>
                                  </CTooltip>
                                </CCol>
                              </CRow>
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
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

export default TableKriteria
