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
import { constantaSource, serverSourceDev } from '../../../constant/constantaEnv'
import EditAjuanPegawai from './editAjuanPegawai'
import Swal from 'sweetalert2'
import DetailAjuanPegawai from './detailAjuanPegawai'
import { formatRupiah, getDateTimeString, swalNotif } from '../../../constant/functionGlobal'
import AddAjuanPegawai from './addAjuanPegawai'

const TableAjuanPegawai = () => {
  const [program, setProgram] = useState('') // Default to empty string
  const [programList, setProgramList] = useState([])
  const [ajuan, setAjuan] = useState([])
  const [loading, setLoading] = useState(true)

  console.log('ajuan asdasfasdasdas', ajuan)

  // Fetch Program data on mount
  useEffect(() => {
    getProgram()
    getAjuan()
  }, [])

  // Initialize or destroy DataTable when ajuan data is updated
  useEffect(() => {}, [ajuan, loading])

  const getProgram = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}program-kriteria`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      setProgramList(response.data.data)
    } catch (error) {
      if (error.response.status === 404) {
        swalNotif('error', error.response.data.msg, error.message)
      }

      swalNotif('error', error.response.data.msg, error.message)
    } finally {
      setLoading(false)
    }
  }

  const getAjuan = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}ajuan-pegawai`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      setAjuan(response.data.data)
      console.log('getAjuanPegawai', response.data.data)
    } catch (error) {
      if (error.response.status === 404) {
        swalNotif('error', error.response.data.msg, error.message)
      }

      swalNotif('error', error.response.data.msg, error.message)
    } finally {
      setLoading(false)
    }
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
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
        <CCard className="mb-5">
          <CCardHeader>
            <CRow>
              <CCol md={7}>
                <strong>Table Ajuan</strong> <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
              <CCol md={5} className="text-end">
                <AddAjuanPegawai refreshTable={getAjuan} programId={program} />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover" id="tableAjuan">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Program</th>
                  <th>Commented</th>
                  <th>Jlh Dana Diterima</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? ''
                  : ajuan.length === 0
                    ? ''
                    : ajuan.map(
                        (data, index) =>
                          (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{data?.program?.name_program || '-'}</td>
                              <td>{data?.commented || '-'}</td>
                              <td>{formatRupiah(data?.jlh_dana) || '-'}</td>
                              <td>
                                {' '}
                                {data?.req_status ? (
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
                                      <EditAjuanPegawai ajuan={data} refreshTable={getAjuan} />
                                    </CDropdownItem>
                                    <CDropdownItem>
                                      <DetailAjuanPegawai ajuan={data} />
                                    </CDropdownItem>
                                    <CDropdownItem>
                                      <CButton onClick={() => deleteAjuan(data)}>
                                        Delete Ajuan
                                      </CButton>
                                    </CDropdownItem>
                                  </CDropdownMenu>
                                </CDropdown>
                              </td>
                            </tr>
                          ) || '',
                      )}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TableAjuanPegawai
