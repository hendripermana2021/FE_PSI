import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCol,
  CRow,
  CFormInput,
  CAccordion,
  CForm,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CFormSelect,
  CFormFloating,
  CFormTextarea,
} from '@coreui/react'
import propTypes from 'prop-types'
import axios from 'axios'
import Swal from 'sweetalert2'
import { serverSourceDev } from '../../constantaEnv'

const CreateKriteria = (props) => {
  const { refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [nameKriteria, setNameKriteria] = useState('')
  const [weightScore, setWeightScore] = useState(0)
  const [type, setType] = useState(false)
  const [subKriteria, setSubKriteria] = useState([{ name_sub: '', value: 0, description: '' }])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name_kriteria: nameKriteria,
      weight_score: weightScore,
      type: type,
      subkriteria: subKriteria.map((sub) => ({
        name_sub: sub.name_sub,
        value: sub.value,
        description: sub.description,
      })),
    }

    console.log('Response', payload)
    try {
      const response = await axios.post(`${serverSourceDev}kriteria-sub/create`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data successfully created!',
          confirmButtonText: 'OK',
        }).then(() => {
          setVisible(false)
          refreshTable()
          setNameKriteria('')
          setType('false')
          setSubKriteria([{ name_sub: '', value: 0, description: '' }])
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to create data',
        text: error.response?.data?.message || 'An unexpected error occurred',
      })
      console.error('Error:', error.response) // Log error details for debugging
    } finally {
      setLoading(false)
    }
  }

  const handleSubKriteriaChange = (index, field, value) => {
    const updatedSubKriteria = [...subKriteria]
    updatedSubKriteria[index][field] = value
    setSubKriteria(updatedSubKriteria)
  }

  const addSubKriteria = () => {
    setSubKriteria([...subKriteria, { name_sub: '', value: 0, description: '' }])
  }

  return (
    <>
      <CButton onClick={() => setVisible(!visible)} color="primary">
        Add Kriteria
      </CButton>
      <CModal
        alignment="center"
        backdrop="static"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Create New Kriteria and Sub Kriteria</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleCreate}>
            <CRow>
              <CCol md={12} className="mb-3 mt-2">
                <CFormFloating className="mb-3">
                  <CFormInput
                    type="text"
                    floatingLabel="Kriteria"
                    label="Kriteria"
                    value={nameKriteria}
                    onChange={(e) => setNameKriteria(e.target.value)}
                    placeholder="Enter Name Kriteria"
                    required
                  />
                </CFormFloating>
              </CCol>
              <CCol md={12} className="mb-3">
                <CFormSelect
                  id="floatingSelect"
                  floatingLabel="Type Kriteria"
                  aria-label="Floating label select example"
                  value={type}
                  onChange={(e) => setType(e.target.value === 'true')} // e.target.value is a string
                >
                  <option value="true">Profit</option>
                  <option value="false">Cost</option>
                </CFormSelect>
              </CCol>
              <CCol md={12} sm={12} className="mb-3">
                <h6>Sub Kriteria</h6>
                <CAccordion activeItemKey={2}>
                  {subKriteria.map((sub_kriterias, index) => (
                    <CAccordionItem itemKey={index + 1} key={index + 1}>
                      <CAccordionHeader>Sub Kriteria - {index + 1}</CAccordionHeader>
                      <CAccordionBody>
                        <CFormFloating className="mb-3">
                          <CFormInput
                            type="text"
                            floatingLabel="Sub Kriteria"
                            label="Sub Kriteria"
                            value={sub_kriterias.name_sub}
                            onChange={(e) =>
                              handleSubKriteriaChange(index, 'name_sub', e.target.value)
                            }
                            placeholder={`Sub Kriteria ${index + 1} Name`}
                            required
                          />
                        </CFormFloating>

                        <CFormFloating className="mb-3">
                          <CFormInput
                            type="number"
                            floatingLabel="Value Sub-Kriteria"
                            label="Value Sub-Kriteria"
                            value={sub_kriterias.value}
                            onChange={(e) =>
                              handleSubKriteriaChange(index, 'value', e.target.value)
                            }
                            placeholder={`Sub Kriteria ${index + 1} Value`}
                            required
                          />
                        </CFormFloating>

                        <CFormTextarea
                          id="floatingTextarea"
                          floatingLabel="Description"
                          placeholder="Write Description here"
                          rows={5}
                          value={sub_kriterias.description}
                          onChange={(e) =>
                            handleSubKriteriaChange(index, 'description', e.target.value)
                          }
                        />
                      </CAccordionBody>
                    </CAccordionItem>
                  ))}
                </CAccordion>
                <CButton onClick={addSubKriteria} color="success" className="mt-3">
                  Add Sub Kriteria
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
            Close
          </CButton>
          <CButton color="primary" type="submit" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Kriteria'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

CreateKriteria.propTypes = {
  refreshTable: propTypes.func.isRequired,
}

export default CreateKriteria
