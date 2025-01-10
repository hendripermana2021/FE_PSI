import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CFormTextarea,
  CFormInput, // Import for the input field
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import propTypes from 'prop-types'
import { serverSourceDev } from '../../../constant/constantaEnv'
import { swalNotif } from '../../../constant/functionGlobal'

const AddAjuanForm = (props) => {
  const { refreshTable, program } = props // Only refreshTable since we're creating a new role
  const [loading, setLoading] = useState(false)
  const [programId, setProgramId] = useState('')
  const [commented, setCommented] = useState('')
  const [userId, setUserId] = useState('')
  const [programList, setProgramList] = useState([])
  const [kriteriaList, setKriteriaList] = useState([])
  const [kriteriaSelections, setKriteriaSelections] = useState([
    {
      id_kriteria: '',
      id_subKriteria: '',
    },
  ])
  const [visible, setVisible] = useState(false)
  const [provinceId, setProvinceId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [provinces, setProvinces] = useState([]) // For storing all provinces
  const [regions, setRegions] = useState([]) // For storing regions based on selected province
  const [usersList, setUserList] = useState([]) // For storing Users based on selected province and Region

  console.log('kriteria', kriteriaSelections)
  // Fetch kriteria and program data on component mount
  useEffect(() => {
    getProgram()
  }, [])

  useEffect(() => {
    if (programId) {
      const getKriteriaList = async () => {
        setLoading(true)
        try {
          const response = await axios.get(
            `${serverSourceDev}program-kriteria/program/${programId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          )
          setKriteriaList(response.data.data)
          console.log('Program by Kriteria', response.data.data)
        } catch (error) {
          if (error.response.status === 404) {
            swalNotif('error', error.response.data.msg, error.message)
          }

          swalNotif('error', error.response.data.msg, error.message)
        } finally {
          setLoading(false)
        }
      }

      getKriteriaList()
    }
  }, [programId])

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

  const handleKriteriaChange = (e, index, type) => {
    const { name, value } = e.target
    const updatedSelections = [...kriteriaSelections]
    updatedSelections[index] = {
      ...updatedSelections[index],
      [name]: value,
    }
    setKriteriaSelections(updatedSelections)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!programId || !commented || !provinceId || !regionId || !userId) {
      setLoading(false)
      return Swal.fire({
        icon: 'error',
        title: 'All fields must be filled',
      })
    }

    const payload = {
      id_program: Number(programId),
      commented: commented,
      id_province: Number(provinceId),
      id_region: Number(regionId),
      id_users: Number(userId),
      // kriteria: kriteriaSelections,
      kriteria: kriteriaList[0]?.programs_kriteria.map((kriteria, index) => ({
        id_kriteria: kriteria.id,
        id_subKriteria: kriteriaSelections[index]?.id_subKriteria,
      })),
    }

    console.log('payload', payload)

    try {
      const response = await axios.post(
        `${serverSourceDev}ajuan/register`,
        payload,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      )

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Ajuan successfully added!',
          confirmButtonText: 'OK',
        }).then(() => {
          setProgramId('')
          setCommented('')
          setUserId('')
          setVisible(false)
          refreshTable()
          setKriteriaSelections([{ id_kriteria: '', id_subKriteria: '' }])
        })
      }
      if (response.status === 400) {
        Swal.fire({
          icon: 'success',
          title: response.msg,
          confirmButtonText: 'OK',
        }).then(() => {
          setProgramId('')
          setCommented('')
          setUserId('')
          // setVisible(false)
          setKriteriaSelections([{ id_kriteria: '', id_subKriteria: '' }])
        })
      }
    } catch (error) {
      console.error('Error adding ajuan:', error.response || error)
      Swal.fire({
        icon: 'error',
        title: 'Failed to add ajuan',
        text: error.response?.data?.msg || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color="primary" variant="outline">
        Tambah Ajuan
      </CButton>

      <CModal
        alignment="center"
        scrollable
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Add Ajuan</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={12} className="mb-3">
                <h6>Select Program</h6>
                <CFormSelect value={programId} onChange={(e) => setProgramId(e.target.value)}>
                  <option value="">Select Program</option>
                  {programList.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name_program}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Loop through kriteria list and render inputs and selects */}
              {kriteriaList === 0
                ? ''
                : kriteriaList[0]?.programs_kriteria.map((values, index) => (
                    <React.Fragment key={values.id}>
                      <CCol md={6} className="mb-3">
                        <CFormInput
                          type="text"
                          floatingLabel={'kriteria ' + (index + 1)}
                          value={
                            kriteriaSelections[index]?.id_kriteria || values.kriteria.name_kriteria
                          }
                          placeholder="Kriteria"
                          onChange={(e) => handleKriteriaChange(e, index, 'id_kriteria')}
                          readOnly={true}
                        />
                      </CCol>

                      <CCol md={6} className="mb-3">
                        <CFormSelect
                          name="id_subKriteria"
                          floatingLabel="Select Sub Kriteria"
                          value={kriteriaSelections[index]?.id_subKriteria || ''}
                          onChange={(e) => handleKriteriaChange(e, index, 'id_subKriteria')}
                        >
                          <option value="" selected hidden>
                            Select Sub Kriteria
                          </option>
                          {values.kriteria.sub_kriteria.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name_sub}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </React.Fragment>
                  ))}
            </CRow>
            <CRow>
              <CCol md={12} className="mb-3">
                <h6>Additional Comments</h6>
                <CFormTextarea value={commented} onChange={(e) => setCommented(e.target.value)} />
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Confirm'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

AddAjuanForm.propTypes = {
  refreshTable: propTypes.func.isRequired,
  program: propTypes.number.isRequired,
}

export default AddAjuanForm
