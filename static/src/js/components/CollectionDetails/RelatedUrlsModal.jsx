import React from 'react'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import ArrowTags from '../ArrowTags/ArrowTags'

import { pluralize } from '../../util/pluralize'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionMetadata } from '../../zustand/selectors/collection'

import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

import './RelatedUrlsModal.scss'

const RelatedUrlsModal = () => {
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.RELATED_URLS))
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const { relatedUrls = [] } = collectionMetadata

  if (!isOpen) return null

  const body = (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        relatedUrls && relatedUrls.map((category, i) => {
          if (category.urls.length) {
            const key = `modal_related_url_${i}`

            return (
              <div key={key} className="related-urls-modal__group">
                <h4 className="related-urls-modal__group-title">{pluralize(category.label, category.urls)}</h4>
                {
                  category.urls.map((url, j) => {
                    const urlKey = `modal_related_url_${i}-${j}`

                    return (
                      <ul key={urlKey} className="related-urls-modal__url">
                        <ArrowTags tags={[url.type, url.subtype]} />

                        <a
                          className="related-urls-modal__link"
                          href={url.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {url.url}
                        </a>
                      </ul>
                    )
                  })
                }
              </div>
            )
          }

          return null
        })
      }
    </>
  )

  return (
    <EDSCModalContainer
      className="related-urls"
      title="Related URLs"
      isOpen={isOpen}
      id="related-urls"
      size="lg"
      onClose={() => setOpenModal(null)}
      body={body}
    />
  )
}

export default RelatedUrlsModal
