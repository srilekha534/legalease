import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { uploadDocument } from '../api/documentApi'
import toast from 'react-hot-toast'

export default function UploadBox() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0]
      if (err.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 10MB.')
      } else {
        toast.error('Only PDF files are accepted.')
      }
      return
    }

    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setProgress('Uploading your document...')

    try {
      setTimeout(() => setProgress('Extracting text from PDF...'), 1500)
      setTimeout(() => setProgress('AI is analyzing your document... This may take 15-30 seconds.'), 3000)

      const result = await uploadDocument(file)
      toast.success('Document analyzed successfully!')
      navigate(`/result/${result.id}`)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Upload failed. Please try again.'
      toast.error(msg)
      setUploading(false)
      setProgress('')
    }
  }, [navigate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: uploading,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}
          ${uploading ? 'cursor-not-allowed opacity-80' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <div>
              <p className="text-blue-600 font-semibold text-lg">{progress}</p>
              <p className="text-gray-400 text-sm mt-1">Please do not close this page</p>
            </div>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">📄</span>
            <p className="text-blue-600 font-bold text-xl">Drop your PDF here!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📂</span>
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-xl mb-1">
                Drag & drop your PDF here
              </p>
              <p className="text-gray-400">or click to browse files</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <span className="bg-gray-100 px-3 py-1 rounded-full">PDF only</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Max 10MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Supported document types */}
      <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {['Rental Agreement', 'Employment Contract', 'NDA', 'Terms & Conditions', 'Loan Agreement', 'Service Contract'].map((type) => (
          <div key={type} className="bg-white border border-gray-100 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-500 leading-tight">{type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
