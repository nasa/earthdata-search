import React, { Component } from 'react'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'

import './MyDropzone.scss'

class MyDropzone extends Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do stuff with the files here
    console.log(acceptedFiles)
    console.log(rejectedFiles)
  }

  render() {
    return (
      <Dropzone
        onDrop={this.onDrop}
        multiple={false}
        accept=".zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml"
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
          >
            <input {...getInputProps()} />
            {
              isDragActive
                ? <p>Drop Files Here...</p>
                : <p>Try dropping some files here</p>
            }
          </div>
        )}
      </Dropzone>
    )
  }
}

export default MyDropzone
