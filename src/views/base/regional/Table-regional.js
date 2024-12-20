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
import axios from 'axios'
import EditRegional from './editRegional'
import DetailRegional from './detailRegional'
import Swal from 'sweetalert2'
import EditProvince from './editProvince'
import AddRegional from './addRegional'
import AddProvince from './addProvince'

const TableRegional = () => {
  const [provinceSub, setProvinceSub] = useState([])
  const [province, setProvince] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProvinceSub()
  }, [])

  const getProvinceSub = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}province-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProvinceSub(response.data.data)
      setLoading(false)
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Region data')
      }
      console.log(error, 'Error fetching data')
      setLoading(false)
    }
  }

  console.log('province-sub', provinceSub)

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
          await axios.delete(`${serverSourceDev}province/delete/${data.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          getProvinceSub() // Refresh the table after deletion
          Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting data:', error)
          Swal.fire('Error!', 'Your data cannot be deleted.', 'error')
        }
      }
    })
  }

  const deleteRegional = async (data) => {
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
          getProvinceSub() // Refresh the table after deletion
          Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting data:', error)
          Swal.fire('Error!', 'Your data cannot be deleted.', 'error')
        }
      }
    })
  }

  console.log('result disini', provinceSub)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={9}>
                <strong>Regional Table</strong> <small>{constantaSource.tableHeader}</small>
              </CCol>
              <CCol md={3} className="text-end">
                <AddProvince refreshTable={getProvinceSub} />
                {'  '}
                <AddRegional refreshTable={getProvinceSub} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tableRegional">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Province</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : provinceSub.length === 0 ? (
                  <tr>
                    <td colSpan="4">No data available</td>
                  </tr>
                ) : (
                  provinceSub.map((provinces, provinceIndex) => (
                    <tr key={provinceIndex}>
                      <td className="text-center">{provinceIndex + 1}</td>
                      <td>{provinces.name_province}</td>
                      <td>
                        <CAccordion>
                          <CAccordionItem itemKey={provinceIndex} key={provinceIndex}>
                            <CAccordionHeader>Region {provinces.name_province}</CAccordionHeader>
                            <CAccordionBody>
                              <table className="table table-hover ">
                                <thead>
                                  <th className="text-center">No</th>
                                  <th className="text-center">Name Region</th>
                                  <th className="text-center">Action</th>
                                </thead>
                                <tbody>
                                  {provinces.region
                                    ? provinces.region.map((region, index) => (
                                        <tr key={index}>
                                          <td className="text-center">{index + 1}</td>
                                          <td className="text-center">{region.name_region}</td>
                                          <td className="text-center" key={index}>
                                            {' '}
                                            <CButton
                                              color="danger"
                                              onClick={() => deleteRegional(region)}
                                            >
                                              Delete
                                            </CButton>{' '}
                                            <EditRegional
                                              province={provinces}
                                              dataRegion={region}
                                              refreshTable={getProvinceSub}
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    : 'kosong'}
                                </tbody>
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
                              <EditProvince province={provinces} refreshTable={getProvinceSub} />
                            </CDropdownItem>
                            <CDropdownItem>
                              <DetailRegional regional={provinces} />
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem type="button" onClick={() => deleteHandler(provinces)}>
                              Delete Data
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
