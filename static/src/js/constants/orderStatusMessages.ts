export const STATUS_MESSAGES = {
  DOWNLOAD: {
    COMPLETE: 'Download your data directly from the links below, or use the provided download script.'
  },
  ECHO_ORDERS: {
    COMPLETE: 'The data provider has completed processing your order. You should have received an email with information regarding how to access your data from the data provider.',
    IN_PROGRESS: 'Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.',
    FAILED: 'The data provider is reporting the order has failed processing.'
  },
  ESI: {
    CANCELED: 'The order has been canceled.',
    COMPLETE: 'Your orders are done processing and are available for download.',
    CREATING: 'Your orders are pending processing. This may take some time.',
    FAILED: 'The order has failed processing.',
    IN_PROGRESS: 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
  },
  HARMONY: {
    CANCELED: 'The order has been canceled.',
    COMPLETE: 'Your orders are done processing and are available for download.',
    CREATING: 'Your orders are pending processing. This may take some time.',
    FAILED: 'The order has failed processing.',
    IN_PROGRESS: 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
  },
  OPENDAP: {
    COMPLETE: 'Download your data directly from the links below, or use the provided download script.'
  },
  SWODLR: {
    COMPLETE: 'Your orders have been generated and are available for download.',
    CREATING: 'Your orders are pending generation. This may take some time.',
    FAILED: 'The order has failed.',
    IN_PROGRESS: 'Your orders are currently being generated. Once generation is finished, links will be displayed below and sent to the email you\'ve provided.'
  }
}
export type OrderStatus =
  | 'COMPLETE'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'CREATING'
  | 'CANCELED'

export type AccessMethodType =
  | 'DOWNLOAD'
  | 'ECHO_ORDERS'
  | 'ESI'
  | 'HARMONY'
  | 'OPENDAP'
  | 'SWODLR'

export type StatusMessages = {
  [A in AccessMethodType]: {
    [S in OrderStatus]?: string;
  }
}
