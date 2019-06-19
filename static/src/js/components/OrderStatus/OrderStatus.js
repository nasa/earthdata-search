import React from 'react'

// import PropTypes from 'prop-types

import OrderStatusList from './OrderStatusList'
import Well from '../Well/Well'

import './OrderStatus.scss'

export const OrderStatus = () => {
  const order = {
    orderId: '12345678',
    retrievals: {
      downloads: [
        {
          dataset_id: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
          collection_id: 'C179003620-ORNL_DAAC'
        }
      ],
      orders: [
        {
          dataset_id: 'MODIS/Terra Surface Reflectance 8-Day L3 Global 500m SIN Grid V006',
          collection_id: 'C193529899-LPDAAC_ECS',
          order_status: 'in progress',
          service_options: {
            total_complete: 0,
            total_number: 576,
            total_orders: 1,
            total_processed: 0,
            download_urls: [],
            orders: [
              {
                download_urls: [],
                order_id: '45128',
                order_status: 'pending',
                total_number: 576,
                total_processed: 0,
                contact: {
                  name: 'LP DAAC User Services',
                  email: 'lpdaac@usgs.gov'
                }
              }
            ]
          }
        }
      ],
      serviceOrders: []
    },
    links: [
      {
        dataset_id: 'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050',
        links: [
          {
            title: 'https://doi.org/10.3334/ORNLDAAC/830',
            href: 'https://doi.org/10.3334/ORNLDAAC/830'
          },
          {
            title: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830',
            href: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830'
          }
        ]
      },
      {
        dataset_id: 'MODIS/Terra Surface Reflectance 8-Day L3 Global 500m SIN Grid V006',
        links: [
          {
            title: 'https://doi.org/10.5067/MODIS/MOD09A1.006',
            href: 'https://doi.org/10.5067/MODIS/MOD09A1.006'
          },
          {
            title: 'https://lpdaac.usgs.gov/',
            href: 'https://lpdaac.usgs.gov/'
          },
          {
            title: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD09A1.006/contents.html',
            href: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD09A1.006/contents.html'
          }
        ]
      }
    ]
  }

  const { orderId, retrievals } = order
  const { downloads = [], orders = [], serviceOrders = [] } = retrievals

  const introduction = (
    <p>
      {'This page will automatically update as your orders are processed. The Order Status page can be accessed later by visiting '}
      <a href={`https://search.earthdata.nasa.gov/data/retrieve/${orderId}`}>{`https://search.earthdata.nasa.gov/data/retrieve/${orderId}`}</a>
      {' or the '}
      <a href="/data/status/">Download Status and History</a>
      {' page.'}
    </p>
  )

  return (
    <Well>
      <Well.Main>
        <Well.Heading>Order Status</Well.Heading>
        <Well.Introduction>{introduction}</Well.Introduction>
        <Well.Section>
          {
            downloads.length > 0 && (
              <OrderStatusList
                heading="Direct Download"
                introduction={'Click the "View/Download Data Links" button to view or download a file containing links to your data.'}
                collections={downloads}
                type="download"
              />
            )
          }
          {
            orders.length > 0 && (
              <OrderStatusList
                heading="Stage For Delivery"
                introduction={"When the data for the following orders becomes available, an email containing download links will be sent to the address you've provided."}
                collections={orders}
                type="order"
              />
            )
          }
          {
            serviceOrders.length > 0 && (
              <OrderStatusList
                heading="Customize Product"
                introduction={"When the data for the following orders become available, links will be displayed below and sent to the email address you've provided."}
                collections={serviceOrders}
                type="service-order"
              />
            )
          }
        </Well.Section>
        <Well.Heading>Additional Resources and Documentation</Well.Heading>
        <Well.Section>
          Some other content here
        </Well.Section>
      </Well.Main>
      <Well.Footer>
        <Well.Heading>Next Steps</Well.Heading>
        Some footer content
      </Well.Footer>
    </Well>
  )
}

// OrderStatus.defaultProps = {
//   children: null
// }

// OrderStatus.propTypes = {
//   children: PropTypes.node
// }

export default OrderStatus
