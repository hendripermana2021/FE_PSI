import React, { useState, useMemo, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'

const TableGenerate = () => {
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
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Generate Table</strong> <small>Generated All Ajuan</small>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover " id="tableSantris">
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
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TableGenerate
