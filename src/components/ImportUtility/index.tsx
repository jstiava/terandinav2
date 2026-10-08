'use client'
import Papa from 'papaparse'
import { toast, TextInput } from '@payloadcms/ui'
import { Input } from '../ui/input'
import { useRef, useState } from 'react'
// import { getPayload } from 'payload'
// import config from '@payload-config'

export default function ImportUtility({
  doAction,
  onSuccess = async () => { },
}: {
  doAction: (data: any) => Promise<any>
  onSuccess?: () => Promise<any>
}) {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      ;(fileInputRef.current as any).click()
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (!file) {
      setError('Error')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setError(null)
        setData(results.data)
        toast.info(`Found ${results.data.length} records...`)
        // const payload = await getPayload({ config });
        // const CoursesModel = payload.db.collections['courses'];
        // await CoursesModel.insertMany(results.data);
        await doAction(results.data);
        await onSuccess();
      },
      error: (err) => {
        toast.error('Import Failed. Contact support if issue persists.')
        setError(`Parsing failed: ${err.message}`)
      },
    })
  }

  return (
    <>
      <div className="field-type file-field">
        <p
          style={{
            marginBottom: '1rem',
          }}
        >
          Import from Spreadsheet
        </p>
        <div className="file-field__upload">
          <div
            className="dropzone dropzoneStyle--default"
            style={{
              padding: '1rem',
            }}
          >
            <div className="file-field__dropzoneContent">
              <div className="file-field__dropzoneButtons">
                <button
                  type="button"
                  className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
                  onClick={handleButtonClick}
                >
                  <span className="btn__content">
                    <span className="btn__label">Select a CSV file</span>
                  </span>
                </button>
                {/*<input aria-hidden="true" className="file-field__hidden-input" type="file" />*/}
                <Input
                  ref={fileInputRef}
                  type="file"
                  // id="csvUpload"
                  accept=".csv, text/csv"
                  onChange={handleFile}
                  hidden={true}
                  aria-hidden="true"
                  className="file-field__hidden-input"
                />
              </div>
              <p className="file-field__dragAndDropText">Or Drag and drop a file</p>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="popup-button-list popup-button-list__text-align--left popup-button-list__button-size--default">
        <button className="popup-button-list__button" id="action-delete" type="button">
          Download Import Template
        </button>
      </div>*/}
    </>
  )

  // return (
  //   <div style={{
  //     padding: '0.5rem'
  //   }}>
  //     <div style={{ padding: '1rem', color: 'inherit',
  //       backgroundColor: 'transparent',
  //       borderRadius: 8 }}>
  //       <label htmlFor="csvUpload" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
  //         Upload CSV
  //       </label>

  //       <Input
  //         type="file"
  //         id="csvUpload"
  //         accept=".csv, text/csv"
  //         onChange={handleFile}
  //         className='btn'
  //       />

  //       {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

  //       {data.length > 0 && (
  //         <div style={{ marginTop: 16 }}>
  //           <p>✅ Parsed {data.length} rows</p>
  //           <pre style={{ maxHeight: 200, overflow: 'auto', fontSize: 12 }}>
  //             {JSON.stringify(data.slice(0, 5), null, 2)}
  //           </pre>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )
}
