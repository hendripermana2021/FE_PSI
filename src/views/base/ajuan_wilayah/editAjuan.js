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
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { serverSourceDev } from '../../constantaEnv'
import propTypes from 'prop-types'

const EditAjuan = (props) => {
  const { ajuan: data, refreshTable } = props
  const [loading, setLoading] = useState(false)
  const [programId, setProgramId] = useState(data.id_program)
  const [programName, setProgramName] = useState(data.program.name_program)
  const [nameProvince, setNameProvince] = useState(data.province.name_province)
  const [provinceId, setProvinceId] = useState(data.id_province)
  const [nameRegion, setNameRegion] = useState(data.region.name_region)
  const [regionId, setRegionId] = useState(data.id_region)
  const [username, setUsername] = useState(data.users.name)
  const [userId, setUserId] = useState(data.id_users)
  const [commented, setCommented] = useState(data.commented)
  const [visible, setVisible] = useState(false)
  const [provincesList, setProvincesList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [usersList, setUserList] = useState([])
  const [programList, setProgramList] = useState([])
  const [kriteriaList, setKriteriaList] = useState(data.psi_data || [])
  const [subKriteriaId, setSubKriteriaId] = useState(data.psi_data.id_subkriteria)
  const [kriteriaListData, setKriteriaListData] = useState([])
  const [kriteriaSelections, setKriteriaSelections] = useState([
    {
      id_kriteria: '',
      id_subKriteria: '',
    },
  ])

  useEffect(() => {
    getProvinces()
    getPrograms()
    getKriteria()
  }, [])

  useEffect(() => {
    if (provinceId) {
      getRegionsByProvince(provinceId)
    }
  }, [provinceId])

  useEffect(() => {
    if (regionId) {
      getUsersByRegion(regionId)
    }
  }, [regionId])

  const getProvinces = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}province`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProvincesList(response.data.data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const getPrograms = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}program`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setProgramList(response.data.data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const getKriteria = async () => {
    try {
      const response = await axios.get(`${serverSourceDev}kriteria-sub`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setKriteriaListData(response.data.data)
    } catch (error) {
      console.error('Error fetching kriteria:', error)
    }
  }

  console.log('kriteriaListData', kriteriaListData)

  const getRegionsByProvince = async (provinceId) => {
    try {
      const response = await axios.get(`${serverSourceDev}regional/byprovince/${provinceId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })
      setRegionList(response.data.data)
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const getUsersByRegion = async (regionId) => {
    try {
      const response = await axios.get(
        `${serverSourceDev}users/condition/query?regionId=${regionId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        },
      )
      setUserList(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
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

  const updateHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      id_program: Number(programId),
      commented: commented,
      id_province: Number(provinceId),
      id_region: Number(regionId),
      id_users: Number(userId),
      kriteria: kriteriaList.map((kriteria, index) => ({
        id_kriteria: kriteria.id,
        id_subKriteria: kriteriaSelections[index]?.id_subKriteria,
      })),
    }

    try {
      const response = await axios.put(`${serverSourceDev}ajuan/update/${data.id}`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      })

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Ajuan successfully added!',
          confirmButtonText: 'OK',
        }).then(() => {
          setVisible(false)
          setVisible(false)
          refreshTable()
        })
      } else if (response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: response.data.msg,
          confirmButtonText: 'OK',
        })
      }
    } catch (error) {
      console.error('Error updating ajuan:', error.response || error)
      Swal.fire({
        icon: 'error',
        title: 'Failed to update ajuan',
        text: error.response?.data?.msg || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CButton onClick={() => setVisible(true)}>Edit Ajuan</CButton>

      <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Edit Program</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={updateHandler}>
            <CRow>
              <CCol md={12} className="mb-3">
                <h6>Select Program</h6>
                <CFormSelect value={programId} onChange={(e) => setProgramId(e.target.value)}>
                  <option value={programId} hidden>
                    {programName}
                  </option>
                  {programList.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name_program}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={12} className="mb-3">
                <h6>Select Province</h6>
                <CFormSelect value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
                  <option hidden value={provinceId}>
                    {nameProvince}
                  </option>
                  {provincesList.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name_province}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select Region</h6>
                <CFormSelect
                  value={regionId}
                  disabled={!provinceId}
                  onChange={(e) => setRegionId(e.target.value)}
                >
                  <option value={regionId} hidden>
                    {nameRegion}
                  </option>
                  {regionList.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name_region}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={12} className="mb-3">
                <h6>Select User</h6>
                <CFormSelect value={userId} onChange={(e) => setUserId(e.target.value)}>
                  <option value={userId}>{username}</option>
                  {usersList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {kriteriaList.map((kriteria, index) => (
                <CCol md={6} key={kriteria.id} className="mb-3">
                  <h6>{kriteria.kriteria.name_kriteria}</h6>
                  <CFormSelect
                    name="id_subKriteria"
                    value={kriteriaSelections[index]?.id_subKriteria}
                    onChange={(e) => handleKriteriaChange(e, index, 'subKriteria')}
                  >
                    <option value={subKriteriaId} selected hidden>
                      {kriteria.subkriteria.name_sub}
                    </option>
                    {kriteriaListData[index]?.sub_kriteria.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name_sub}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              ))}
              <CCol md={12} className="mb-3">
                <h6>Notes</h6>
                <CFormTextarea
                  rows="5"
                  value={commented}
                  onChange={(e) => setCommented(e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol className="text-end">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

EditAjuan.propTypes = {
  ajuan: propTypes.object,
  refreshTable: propTypes.func,
}

export default EditAjuan
