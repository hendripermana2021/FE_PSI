import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCol,
  CRow,
  CFormSelect,
  CForm,
} from '@coreui/react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Swal from 'sweetalert2'
import { serverSourceDev } from '../../constantaEnv'

const AddProgramKriteria = ({ kriteria: initialData, refreshTable }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [programId, setProgramId] = useState(initialData?.id || '')
  const [programList, setProgramList] = useState([])
  const [kriteriaList, setKriteriaList] = useState([])
  const [kriteriaSelections, setKriteriaSelections] = useState([{ id_kriteria: '' }])

  // Fetch program and kriteria lists on mount
  useEffect(() => {
    getProgramList()
    getKriteriaList()
  }, [])

  const getProgramList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}program`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProgramList(response.data.data || [])
    } catch (error) {
      handleError(error, 'Error fetching program data')
    } finally {
      setLoading(false)
    }
  }

  const getKriteriaList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${serverSourceDev}kriteria-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setKriteriaList(response.data.data || [])
    } catch (error) {
      handleError(error, 'Error fetching kriteria data')
    } finally {
      setLoading(false)
    }
  }

  // Add more kriteria selection fields
  const handleAddKriteria = () => {
    setKriteriaSelections([...kriteriaSelections, { id_kriteria: '' }])
  }

  // Update selected kriteria
  const handleKriteriaChange = (index, value) => {
    const updatedSelections = [...kriteriaSelections]
    updatedSelections[index].id_kriteria = Number(value)
    setKriteriaSelections(updatedSelections)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${serverSourceDev}program-kriteria/create`,
        {
          id_program: Number(programId) || '',
          kriteria: kriteriaSelections.filter((k) => k.id_kriteria),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data successfully added!',
          confirmButtonText: 'OK',
        }).then(() => {
          setVisible(false)
          refreshTable()
          resetForm()
        })
      }
    } catch (error) {
      handleError(error, 'Failed to add data')
    } finally {
      setLoading(false)
    }
  }

  // Handle errors
  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error.response || error)
    Swal.fire({
      icon: 'error',
      title: defaultMessage,
      text: error.response?.data?.message || 'An unexpected error occurred',
    })
  }

  // Reset the form after submission
  const resetForm = () => {
    setProgramId('')
    setKriteriaSelections([{ id_kriteria: '' }])
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)} color="primary">
        Add Program Kriteria
      </CButton>
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Program Kriteria</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={12} sm={12} className="mb-3">
                <CFormSelect
                  aria-label="Select Program"
                  floatingLabel="Select Program"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  required
                >
                  <option value="" hidden>
                    {programId ? `Selected: ${programId}` : 'Select Program'}
                  </option>
                  {programList.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name_program}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Loop through kriteria selections */}
              {kriteriaSelections.map((selection, index) => (
                <CCol md={12} className="mb-4" key={index}>
                  <h6>Select Kriteria {index + 1}</h6>
                  <CFormSelect
                    aria-label="Select Kriteria"
                    value={selection.id_kriteria}
                    onChange={(e) => handleKriteriaChange(index, e.target.value)}
                    required
                  >
                    <option value="" hidden>
                      {selection.id_kriteria
                        ? `Selected: ${selection.id_kriteria}`
                        : 'Select Kriteria'}
                    </option>
                    {kriteriaList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name_kriteria}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              ))}

              <CCol md={12} sm={12} className="mb-3">
                <CButton color="secondary" onClick={handleAddKriteria} disabled={loading}>
                  Add More Kriteria
                </CButton>
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
              Close
            </CButton>
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Program Kriteria'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

AddProgramKriteria.propTypes = {
  kriteria: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_kriteria: PropTypes.string.isRequired,
  }).isRequired,
  refreshTable: PropTypes.func.isRequired,
}

export default AddProgramKriteria
