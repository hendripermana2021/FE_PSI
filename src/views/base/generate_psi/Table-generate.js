import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CBadge,
  CButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import 'datatables.net-dt/js/dataTables.dataTables'
import $ from 'jquery'
import 'jquery/dist/jquery.min.js'
import axios from 'axios'
import { constantaSource, serverSourceDev } from '../../constantaEnv'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const TableGenerate = () => {
  const [program, setProgram] = useState('') // Default to empty string
  const [programList, setProgramList] = useState([])
  const [ajuan, setAjuan] = useState([])
  const [rumus, setRumus] = useState([])
  const [roc, setRoc] = useState([])
  const [processRoc, setProcessRoc] = useState(false)
  const [loading, setLoading] = useState(true)

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

  console.log('rumus program', program)

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
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Program data')
      }
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
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Program data')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
  }

  const processPSI = async (data) => {
    Swal.fire({
      title: 'Process PSI',
      text: 'Apakah kamu ingin memproses PSI?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Process!',
    }).then(async (result) => {
      // if (!program) {
      //   Swal.fire('Error!', 'Failed to process PSI Select Programs First.', 'error')
      // }

      if (result.isConfirmed) {
        try {
          const response = await axios.get(`${serverSourceDev}action/calculatedPSI/${data}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          setRumus(response.data.data)
          setProcessRoc(true)
          getAjuan(program) // Refresh table
          console.log('process PSI response', response.data.data)
          Swal.fire('Success!', 'Generated PSI.', 'success')
        } catch (error) {
          console.error('Error processing PSI:', error)
          Swal.fire('Error!', 'Failed to process PSI.', 'error')
        }
      }
    })
  }

  const processROC = async (data) => {
    Swal.fire({
      title: 'Process ROC',
      text: 'Apakah kamu ingin memproses ROC?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Process!',
    }).then(async (result) => {
      // if (!program) {
      //   Swal.fire('Error!', 'Failed to process PSI Select Programs First.', 'error')
      // }

      if (result.isConfirmed) {
        try {
          const response = await axios.get(`${serverSourceDev}action/calculatedROC/${data}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          })
          setRoc(response.data.data)
          getAjuan(program) // Refresh table
          console.log('process ROC response', response.data.data)
          Swal.fire('Success!', 'Generated ROC.', 'success')
        } catch (error) {
          console.error(
            'Error processing ROC, Please process PSI First or Try Generated again:',
            error,
          )
          Swal.fire(
            'Error!',
            'Error processing ROC, Please process PSI First or Try Generated again.',
            'error',
          )
        }
      }
    })
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Judul dokumen
    doc.setFontSize(16) // Set ukuran font judul
    doc.text('Result Data Ajuan (Generated by PSI and ROC)', 14, 10)

    // Ambil data tabel
    const tableColumn = [
      'ID',
      'Name Petugas',
      'Province',
      'Region',
      'Jlh Dana',
      'PSI Result',
      'Rank',
      'Status',
    ]
    const tableRows = []

    ajuan.forEach((programs, index) => {
      const rowData = [
        index + 1,
        programs?.users?.name || '-',
        programs?.province?.name_province || '-',
        programs?.region?.name_region || '-',
        formatRupiah(programs.jlh_dana || 0),
        programs?.psi_result || 0,
        programs?.rank || 'N/A',
        programs?.req_status ? 'Belum Disetujui' : 'Disetujui',
      ]
      tableRows.push(rowData)
    })

    // Tambahkan tabel ke PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 9, // Set font size konten
      },
      headStyles: {
        fontSize: 10, // Set font size header
        fillColor: [22, 160, 133], // Warna hijau kebiruan untuk header (opsional)
        textColor: 255, // Warna teks putih
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Warna abu-abu terang untuk baris bergantian (opsional)
      },
    })

    // Simpan PDF
    doc.save('Data_Ajuan.pdf')
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
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow className="mt-4 mb-3">
              <CCol md={12}>
                <CRow>
                  <CCol md={5}>
                    <CRow>
                      <CCol className="text-end">
                        <CButton
                          color="primary"
                          className="item-end"
                          type="button"
                          onClick={() => {
                            processPSI(program)
                          }}
                        >
                          Proses PSI
                        </CButton>
                      </CCol>
                      <CCol>
                        <CButton
                          color="primary"
                          className="item-end"
                          type="button"
                          onClick={() => {
                            processROC(program)
                          }}
                          disabled={!processRoc}
                        >
                          Proses ROC
                        </CButton>
                      </CCol>
                      <CCol>
                        <CButton
                          color="success"
                          className="item-end"
                          type="button"
                          onClick={() => {
                            exportToPDF()
                          }}
                        >
                          Export to PDF
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={7} className="text-end">
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
              </CCol>
            </CRow>
            <table className="table table-hover" id="tableAjuan">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name Petugas</th>
                  <th>Province</th>
                  <th>Region</th>
                  <th>Jlh Dana</th>
                  <th>PSI Result</th>
                  <th>Rank</th>
                  <th>Commented</th>
                  <th>Status</th>
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
                          <td>{programs?.province.name_province || '-'}</td>
                          <td>{programs?.region.name_region || '-'}</td>
                          <td>{formatRupiah(programs.jlh_dana || 0)}</td>
                          <td>{programs?.psi_result || 0}</td>
                          <td>{programs?.rank || 'N/A'}</td>
                          <td>{programs?.commented || '-'}</td>
                          <td>
                            {' '}
                            {programs?.req_status ? (
                              <CBadge color="danger">Belum Disetujui</CBadge>
                            ) : (
                              <CBadge color="success">Disetujui</CBadge>
                            )}{' '}
                          </td>
                        </tr>
                      ) || '',
                  )
                )}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={7}>
                <strong>Rumus / Jalan Pengerjaan</strong>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CCard className="mb-4">
              <CCardHeader>
                <CRow>
                  <CCol md={7}>
                    <strong>Rumus PSI</strong>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CAccordion activeItemKey={6}>
                  <CAccordionItem itemKey={1}>
                    <CAccordionHeader>
                      {' '}
                      <h6 style={{ fontWeight: 'bold' }}>1. Normalisasi</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          {' '}
                          <table className="table table-hover" id="tableNormalisasi">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.nilai?.[0].map((ajuans, index) => (
                                  <th key={index}>
                                    Kriteria {index + 1}{' '}
                                    {rumus.statusKriteria[index] ? (
                                      <CBadge color="success">B</CBadge>
                                    ) : (
                                      <CBadge color="danger">C</CBadge>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.nilai?.map((ajuans, indexRumus) => (
                                <tr key={indexRumus}>
                                  <td> {indexRumus + 1}</td>
                                  <td>Alternatif {indexRumus + 1}</td>
                                  {ajuans.map((values, index) => (
                                    <td key={index}>
                                      {' '}
                                      {rumus.statusKriteria[index]
                                        ? `${values} / ${rumus.minMax[index]}`
                                        : `${rumus.minMax[index]} / ${values}`}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h3>Normalisasi Data</h3>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.normalisasi?.[0].map((ajuans, index) => (
                                  <th key={index}>Kriteria {index + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.normalisasi?.map((ajuans, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Alternatif {index + 1}</td>
                                  {ajuans.map((values, index) => (
                                    <td key={index}>
                                      {typeof values === 'number'
                                        ? new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }).format(values)
                                        : values}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={2}>
                    <CAccordionHeader>
                      {' '}
                      <h6 style={{ fontWeight: 'bold' }}>2. Penentuan Nilai Rata-rata</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          {' '}
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>SUM Normalisasi tiap Kriteria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumNormalisasi?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>{values}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h2>Nilai Rata Rata Normalisasi</h2>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>Rumus</th>
                                <th>Results</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumNormalisasiArray?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>
                                    {' '}
                                    1 / {rumus.SumNormalisasi.length} *{' '}
                                    {rumus.SumNormalisasi[index]}
                                  </td>
                                  <td>{values}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={3}>
                    <CAccordionHeader>
                      {' '}
                      <h6 style={{ fontWeight: 'bold' }}>3. Penentuan Nilai Variasi Preferensi</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          {' '}
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.normalisasi?.[0].map((ajuans, index) => (
                                  <th key={index}>Kriteria {index + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.normalisasi?.map((ajuans, indexAjuan) => (
                                <tr key={indexAjuan}>
                                  <td> {indexAjuan + 1}</td>
                                  <td>Alternatif {indexAjuan + 1}</td>
                                  {ajuans.map((values, index) => (
                                    <td key={index} style={{ fontSize: '12px' }}>
                                      (
                                      {typeof values === 'number'
                                        ? new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }).format(values)
                                        : values}{' '}
                                      -{' '}
                                      {typeof values === 'number'
                                        ? new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }).format(rumus.SumNormalisasiArray[index])
                                        : rumus.SumNormalisasiArray[index]}
                                      ) ^ 2
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h2>Result Nilai Variasi Preferensi</h2>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.normalisasi?.[0].map((ajuans, index) => (
                                  <th key={index}>Kriteria {index + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.MatriksPreference?.map((ajuans, indexAjuan) => (
                                <>
                                  <tr key={indexAjuan}>
                                    <td> {indexAjuan + 1}</td>
                                    <td>Alternatif {indexAjuan + 1}</td>
                                    {ajuans.map((values, index) => (
                                      <td key={index} style={{ fontSize: '12px' }}>
                                        {typeof values === 'number'
                                          ? new Intl.NumberFormat('en-US', {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }).format(values)
                                          : values}
                                      </td>
                                    ))}
                                  </tr>
                                </>
                              ))}
                              <tr>
                                <td colSpan={2}>SUM DEVIASI</td>
                                {rumus.SumDeviasi?.map((values, index) => (
                                  <td key={index} style={{ fontSize: '12px' }}>
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(values)
                                      : values}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={4}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>4. Penentuan Deviasi Nilai Preferensi</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>SUM Deviasi tiap Kriteria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumDeviasi?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>{values}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h2>Deviasi Nilai Preferensi</h2>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>Rumus</th>
                                <th>Results</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumDeviasi?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>
                                    {' '}
                                    1 -{' '}
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(values)
                                      : values}
                                  </td>
                                  <td>
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(rumus.SumBobotKr[index])
                                      : rumus.SumBobotKr[index]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={5}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>5. Penentuan Bobot Kriteria</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>Deviasi tiap Kriteria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumBobotKr?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(values)
                                      : values}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2}>
                                  <strong>SUM Deviasi</strong>
                                </td>
                                <td>
                                  {typeof rumus.TotalBobotKr === 'number'
                                    ? new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }).format(rumus.TotalBobotKr)
                                    : rumus.TotalBobotKr}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <h2>Bobot Kriteria</h2>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Kriteria</th>
                                <th>Rumus</th>
                                <th>Results</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.SumBobotKr?.map((values, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Kriteria {index + 1}</td>
                                  <td>
                                    {' '}
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(values)
                                      : values}{' '}
                                    /{' '}
                                    {typeof rumus.TotalBobotKr === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(rumus.TotalBobotKr)
                                      : rumus.TotalBobotKr}
                                  </td>
                                  <td>
                                    {typeof values === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(rumus.SumBobotKriteria[index])
                                      : rumus.SumBobotKriteria[index]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={6}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>6. Penentuan Nilai PSI</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {rumus.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856402',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <>
                          {' '}
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.normalisasi?.[0].map((ajuans, index) => (
                                  <th key={index}>Kriteria {index + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.normalisasi?.map((ajuans, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>Alternatif {index + 1}</td>
                                  {ajuans.map((values, index) => (
                                    <td key={index}>
                                      {typeof values === 'number'
                                        ? new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }).format(values)
                                        : values}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <h3>Penentuan Nilai PSI</h3>
                          <table
                            className="table table-hover table-responsive"
                            id="tableNormalisasi"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Alternatif</th>
                                {rumus.normalisasi?.[0].map((ajuans, indexAjuan) => (
                                  <th key={indexAjuan}>Kriteria {indexAjuan + 1}</th>
                                ))}
                                <th>Result CPI</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rumus.normalisasi?.map((ajuans, indexRumus) => (
                                <tr key={indexRumus}>
                                  <td> {indexRumus + 1}</td>
                                  <td>Alternatif {indexRumus + 1}</td>
                                  {ajuans.map((values, index) => (
                                    <>
                                      <td key={index} style={{ fontSize: '14px' }}>
                                        {typeof values === 'number'
                                          ? new Intl.NumberFormat('en-US', {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }).format(values)
                                          : values}{' '}
                                        x{' '}
                                        {typeof rumus.SumBobotKriteria[index] === 'number'
                                          ? new Intl.NumberFormat('en-US', {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }).format(rumus.SumBobotKriteria[index])
                                          : rumus.SumBobotKriteria[index]}
                                      </td>
                                    </>
                                  ))}
                                  <td key={indexRumus} style={{ fontSize: '14px' }}>
                                    {typeof rumus.resultRows[indexRumus] === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(rumus.resultRows[indexRumus])
                                      : rumus.resultRows[indexRumus]}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                </CAccordion>
              </CCardBody>
            </CCard>
            <CCard className="mb-4">
              <CCardHeader>
                <CRow>
                  <CCol md={7}>
                    <strong>Rumus ROC</strong>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CAccordion activeItemKey={4}>
                  <CAccordionItem itemKey={1}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>1. Data Overview</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {roc.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856404',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <div className="data-summary">
                          <div className="card mb-3" style={{ borderColor: '#007bff' }}>
                            <div className="card-body">
                              <h6 className="card-title">Program Information</h6>
                              <p className="card-text">
                                <strong>Total Dana yang ingin dibagikan: </strong>
                                <span className="badge bg-primary">
                                  Rp {roc.program?.total_dana_alokasi}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="rank-section">
                            {roc.totalRank?.map((rank, index) => (
                              <div
                                className="card mb-2"
                                key={index}
                                style={{ borderColor: rank === 1 ? '#28a745' : '#007bff' }}
                              >
                                <div className="card-body">
                                  <h6 className="card-title">
                                    Ranking:{' '}
                                    <span
                                      className={`badge ${
                                        rank === 1 ? 'bg-success' : 'bg-primary'
                                      }`}
                                    >
                                      {rank}
                                    </span>
                                  </h6>
                                  <p className="card-text">
                                    <strong>Jumlah Orang:</strong>{' '}
                                    <span className="badge bg-info">
                                      {roc.totalRankByPeople[index]} Orang
                                    </span>
                                  </p>
                                  <p className="card-text">
                                    <strong>Bobot:</strong>{' '}
                                    <span className="badge bg-warning">
                                      {rank === 1 ? '1' : `1 / ${rank}`}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={2}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>2. Menghitung Total Bobot</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {roc.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856404',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <div style={{ margin: '20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {roc.totalRank?.map((rank, index) => (
                              <div
                                key={index}
                                style={{
                                  border: `2px solid ${rank === 1 ? '#28a745' : '#007bff'}`,
                                  borderRadius: '10px',
                                  padding: '10px',
                                  marginBottom: '10px',
                                }}
                              >
                                <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                  Ranking:{' '}
                                  <span
                                    style={{
                                      backgroundColor: rank === 1 ? '#28a745' : '#007bff',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {rank}
                                  </span>
                                </h6>
                                <p style={{ margin: '5px 0' }}>
                                  <strong>Bobot:</strong>{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#ffc107',
                                      color: '#212529',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {rank === 1 ? 1 : `1 / ${rank}`}
                                  </span>
                                  &nbsp; x &nbsp;
                                  <strong>Jumlah Orang:</strong>{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#17a2b8',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {roc.totalRankByPeople[index]} Orang
                                  </span>
                                  &nbsp; = &nbsp;
                                  <span
                                    style={{
                                      backgroundColor: '#6c757d',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {roc.bobotRank[index] * roc.totalRankByPeople[index]}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>

                          <div
                            style={{
                              border: '2px solid #17a2b8',
                              borderRadius: '10px',
                              padding: '10px',
                            }}
                          >
                            <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                              Total Bobot Keseluruhan:
                            </h6>
                            <p style={{ margin: '0' }}>
                              <span
                                style={{
                                  backgroundColor: '#17a2b8',
                                  color: '#fff',
                                  padding: '3px 8px',
                                  borderRadius: '5px',
                                }}
                              >
                                {roc.totalRankWeight}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={3}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>3. Menghitung Proporsi</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {roc.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856404',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          role="alert"
                          className="text-center"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <div style={{ margin: '20px' }}>
                          {roc.totalRank?.map((values, index) => (
                            <div
                              key={index}
                              style={{
                                border: `2px solid ${values === 1 ? '#28a745' : '#007bff'}`,
                                borderRadius: '10px',
                                padding: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                Proporsi untuk Ranking {values}{' '}
                                <span
                                  style={{
                                    backgroundColor: '#17a2b8',
                                    color: '#fff',
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                  }}
                                >
                                  {roc.totalRankByPeople[index]} orang
                                </span>
                              </h6>

                              <p style={{ margin: '10px 0' }}>
                                Setiap orang di Ranking {values} akan mendapatkan:
                              </p>

                              <ul style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
                                <li>
                                  <strong>Bobot:</strong>{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#ffc107',
                                      color: '#212529',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {typeof roc.bobotRank[index] === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(roc.bobotRank[index])
                                      : roc.bobotRank[index]}
                                  </span>{' '}
                                  /{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#17a2b8',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {typeof roc.totalRankWeight === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(roc.totalRankWeight)
                                      : roc.totalRankWeight}
                                  </span>{' '}
                                  x {roc.program?.total_dana_alokasi} ={' '}
                                  <span
                                    style={{
                                      backgroundColor: '#6c757d',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {typeof roc.moneyForEveryRank[index] === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(roc.moneyForEveryRank[index])
                                      : roc.moneyForEveryRank[index]}
                                  </span>
                                </li>
                                <li>
                                  Masing-masing dari{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#17a2b8',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {roc.totalRankByPeople[index]} orang
                                  </span>{' '}
                                  di Ranking {values} akan mendapatkan{' '}
                                  <span
                                    style={{
                                      backgroundColor: '#6c757d',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    {typeof roc.moneyForEveryRank[index] === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(roc.moneyForEveryRank[index])
                                      : roc.moneyForEveryRank[index]}
                                  </span>
                                  .
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem itemKey={4}>
                    <CAccordionHeader>
                      <h6 style={{ fontWeight: 'bold' }}>4. Hasil Pembagian</h6>
                    </CAccordionHeader>
                    <CAccordionBody>
                      {roc.length === 0 ? (
                        <div
                          style={{
                            padding: '10px',
                            color: '#856404',
                            border: '1px solid #ffeeba',
                            borderRadius: '5px',
                          }}
                          className="text-center"
                          role="alert"
                        >
                          Data tidak tersedia.
                        </div>
                      ) : (
                        <div style={{ margin: '20px' }}>
                          {roc.totalRank?.map((values, index) => (
                            <div
                              key={index}
                              style={{
                                border: `2px solid ${values === 1 ? '#28a745' : '#007bff'}`,
                                borderRadius: '10px',
                                padding: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                Hasil Pembagian untuk Ranking {values}
                              </h6>

                              <ul style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
                                <li>
                                  Masing-masing orang di ranking {values} (
                                  {roc.totalRankByPeople[index]} Orang) akan mendapatkan:
                                  <span
                                    style={{
                                      backgroundColor: '#6c757d',
                                      color: '#fff',
                                      padding: '3px 8px',
                                      marginLeft: '5px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    Rp.{' '}
                                    {typeof roc.moneyForEveryRank[index] === 'number'
                                      ? new Intl.NumberFormat('en-US', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(roc.moneyForEveryRank[index])
                                      : roc.moneyForEveryRank[index]}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                </CAccordion>
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TableGenerate
