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

const EditKriteria = (props) => {
  const { kriteria: initialData, refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [nameKriteria, setNameKriteria] = useState(initialData?.name_kriteria || '')
  const [weightScore, setWeightScore] = useState(initialData?.weight_score || 0)
  const [type, setType] = useState(initialData?.type || false)
  const [subKriteria, setSubKriteria] = useState(
    initialData?.sub_kriteria.map((sub) => ({
      id: sub.id,
      name_sub: sub.name_sub,
      value: sub.value,
      description: sub.description || '',
    })),
  )

  useEffect(() => {
    if (initialData?.sub_kriteria) {
      setSubKriteria(
        initialData.sub_kriteria.map((sub) => ({
          id: sub.id,
          name_sub: sub.name_sub,
          description: sub.description || '',
          value: sub.value || 0,
        })),
      )
    }
  }, [initialData])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(
        `${serverSourceDev}kriteria-sub/update/${initialData.id}`,
        {
          name_kriteria: nameKriteria,
          weight_score: weightScore,
          type: type,
          subkriteria: subKriteria.map((sub) => ({
            name_sub: sub.name_sub,
            value: sub.value,
            description: sub.description, // Include description in the request
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )

      console.log('Response', response)

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data successfully updated!',
          confirmButtonText: 'OK',
        }).then(() => {
          setVisible(false)
          refreshTable()
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update data',
        text: error.response?.data?.message || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubKriteriaChange = (index, field, value) => {
    const updatedSubKriteria = [...subKriteria]
    updatedSubKriteria[index][field] = value
    setSubKriteria(updatedSubKriteria)
  }

  return (
    <>
      <CButton onClick={() => setVisible(!visible)}>Update Kriteria</CButton>
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update Sub Kriteria</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleUpdate}>
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
                  onChange={(e) => setType(e.target.value === 'true')}
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
                            floatingLabel="Kriteria"
                            label="Kriteria"
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
                            label="Sub-Kriteria"
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
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
            Close
          </CButton>
          <CButton color="primary" type="submit" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Kriteria'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

EditKriteria.propTypes = {
  kriteria: propTypes.shape({
    id: propTypes.number.isRequired,
    name_kriteria: propTypes.string.isRequired,
    weight_score: propTypes.number,
    type: propTypes.bool,
    sub_kriteria: propTypes.arrayOf(
      propTypes.shape({
        id: propTypes.number.isRequired,
        name_sub: propTypes.string.isRequired,
        description: propTypes.string,
        value: propTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  refreshTable: propTypes.func.isRequired,
}

export default EditKriteria
