import API from './authApi'

export const uploadDocument = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await API.post('/api/document/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getHistory = async () => {
  const { data } = await API.get('/api/document/history')
  return data
}

export const getDocument = async (id) => {
  const { data } = await API.get(`/api/document/${id}`)
  return data
}

export const deleteDocument = async (id) => {
  const { data } = await API.delete(`/api/document/${id}`)
  return data
}
