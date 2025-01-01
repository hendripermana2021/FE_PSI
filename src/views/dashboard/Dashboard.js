import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
  CWidgetStatsD,
  CWidgetStatsB,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibAbstract,
  cibFacebook,
  cilApplications,
  cilChartPie,
  cilList,
  cilShieldAlt,
  cilUser,
} from '@coreui/icons'
import { CChartLine } from '@coreui/react-chartjs'
import TableAjuan from '../base/ajuan_wilayah/Table-ajuan'
import axios from 'axios'
import { serverSourceDev } from '../constantaEnv'
import Swal from 'sweetalert2' // Ensure Swal is imported
import { formatRupiah } from '../functionGlobal'

const Dashboard = () => {
  const [dataDashboard, setDataDashboard] = useState(null) // Start with null to safely check currentUser
  const [loading, setLoading] = useState(true) // Initialize loading state

  useEffect(() => {
    getDataDashboard() // Fetch dashboard data when the component mounts
  }, [])

  const getDataDashboard = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}dashboard`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setDataDashboard(response.data.data) // Assuming 'data' is the property you need
      console.log(response.data.data)
    } catch (error) {
      if (error.response?.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tidak Ada',
          text: 'Maaf Data tidak ditemukan atau belum dibuat',
        })
      } else {
        handleError(error, 'Error fetching Program data')
      }
    } finally {
      setLoading(false) // Stop loading when the request finishes
    }
  }

  // Check if data is available before trying to access its properties
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {dataDashboard?.currentUser?.role_id === 1 ? (
        <>
          <CRow>
            <CCol md={3} xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="info" // Adjusted for better visual differentiation
                icon={<CIcon icon={cilList} height={24} />} // Using a list icon for "Jumlah Kriteria"
                padding={false}
                title="Jumlah Kriteria"
                value={dataDashboard.kriteria}
              />
            </CCol>
            <CCol md={3} xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="success" // Changed to green for positive user growth
                icon={<CIcon icon={cilUser} height={24} />} // User icon for "Jumlah Users"
                padding={false}
                title="Jumlah Users"
                value={dataDashboard.user}
              />
            </CCol>
            <CCol md={3} xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="primary"
                icon={<CIcon icon={cilApplications} height={24} />} // Using an application icon for "Jumlah Programs"
                padding={false}
                title="Jumlah Programs"
                value={dataDashboard.total_programs}
              />
            </CCol>
            <CCol md={3} xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="danger" // Red to highlight roles, potentially for admin/superuser significance
                icon={<CIcon icon={cilShieldAlt} height={24} />} // Shield icon for "Jumlah Role"
                padding={false}
                title="Jumlah Role"
                value={dataDashboard.totalRole}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6} md={6}>
              <CWidgetStatsD
                className="mb-3"
                icon={<CIcon className="my-4 text-white" icon={cibAbstract} height={52} />}
                chart={
                  <CChartLine
                    className="position-absolute w-100 h-100"
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          backgroundColor: 'rgba(255,255,255,.1)',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointHoverBackgroundColor: '#fff',
                          borderWidth: 2,
                          data: [65, 59, 84, 84, 51, 55, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      elements: {
                        line: {
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                          hoverBorderWidth: 3,
                        },
                      },
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                    }}
                  />
                }
                style={{ '--cui-card-cap-bg': '#3b5998' }}
                values={[
                  { title: 'Jumlah Ajuan', value: `${dataDashboard.ajuan}` },
                  { title: 'Ajuan Approve', value: `${dataDashboard.ajuanApprove}` },
                ]}
              />
            </CCol>
            <CCol xs={6} md={6}>
              <CWidgetStatsB
                className="mb-3"
                progress={{ color: 'success', value: `${dataDashboard.percentage}` }}
                text="Dana tiap program yang telah direalisasikan kepada tiap program dan tiap ajuan"
                title="Realisasi Dana Program"
                value={dataDashboard.percentage + `% (${formatRupiah(dataDashboard.total_dana)})`}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCard>
              <CCardHeader>Daftar Ajuan</CCardHeader>
              <CCardBody>
                <TableAjuan />
              </CCardBody>
            </CCard>
          </CRow>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default Dashboard
