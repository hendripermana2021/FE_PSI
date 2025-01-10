import React, { useState, useMemo, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge } from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import { constantaSource } from '../../../constant/constantaEnv'
import PropTypes from 'prop-types'
import { formatRupiah } from '../../../constant/functionGlobal'

const TableProgramAjuanPegawai = (props) => {
  const { data } = props
  const [loading, setLoading] = useState(true)
  console.log('ini dari table prgram pegawai...', data)

  useEffect(() => {
    if ($.fn.DataTable.isDataTable('#tableProgramPegawai')) {
      $('#tableProgramPegawai').DataTable().destroy()
    }

    $(document).ready(function () {
      const tableInterval = setInterval(() => {
        if ($('#tableProgramPegawai').is(':visible')) {
          clearInterval(tableInterval)
          $('#tableProgramPegawai').DataTable({
            language: {
              emptyTable: 'No Role available',
            },
          })
        }
      }, 1000)
    })
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={9}>
                {' '}
                <strong>Request Ajuan Program</strong>{' '}
                <small>{String(constantaSource.tableHeader)}</small>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tableRole">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Name Program</th>
                  <th className="text-center">Jumlah Dana</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0
                  ? ''
                  : data.program.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{data.program.name_program}</td>
                        <td>{formatRupiah(data.jlh_dana)}</td>
                        <td>
                          {' '}
                          {data?.req_status ? (
                            <CBadge color="danger">Belum Disetujui</CBadge>
                          ) : (
                            <CBadge color="success">Disetujui</CBadge>
                          )}{' '}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

TableProgramAjuanPegawai.propTypes = {
  data: PropTypes.object,
}

export default TableProgramAjuanPegawai
