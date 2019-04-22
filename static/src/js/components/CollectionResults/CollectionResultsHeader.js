import React from 'react'

const CollectionResultsHeader = () => (
  <>
    <div className="row">
      <div className="col">
        <form className="form-inline mb-1" action="/">
          <div className="form-row align-items-center">
            <div className="col-auto">
              <div className="form-group">
                <label
                  className="mr-1"
                  htmlFor="input__sort-relevance"
                >
                  Sort by:
                </label>
                <select
                  id="input__sort-relevance"
                  className="form-control"
                >
                  <option value="relevance">Relevance</option>
                  <option value="usage">Usage</option>
                  <option value="end_data">End Date</option>
                </select>
              </div>
            </div>
            <div className="col-auto">
              <div className="form-group">
                <div className="form-check">
                  <input
                    id="input__only-granules"
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked
                  />
                  <label
                    className="form-check-label"
                    htmlFor="input__only-granules"
                  >
                     Only include collections with granules
                  </label>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="form-group">
                <div className="form-check">
                  <input
                    id="input__non-eosdis"
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked
                  />
                  <label
                    className="form-check-label"
                    htmlFor="input__non-eosdis"
                  >
                    Include non-EOSDIS collections
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <span>
          <strong>Tip:</strong>
           Add
          <i className="fa fa-plus" />
           collections to your project to compare and download their data.
        </span>
      </div>
    </div>
  </>
)

export default CollectionResultsHeader
