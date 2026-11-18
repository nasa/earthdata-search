export const STATUS_MESSAGES = {
  DOWNLOAD: {
    COMPLETE: 'Download your data directly from the links below, or use the provided download script.'
  },
  HARMONY: {
    CANCELED: 'The order has been canceled.',
    COMPLETE: 'Your orders are done processing and are available for download.',
    CREATING: 'Your orders are pending processing. This may take some time.',
    FAILED: 'The order has failed processing.',
    IN_PROGRESS: 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
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
  | 'HARMONY'

export type StatusMessages = {
  [A in AccessMethodType]: {
    [S in OrderStatus]?: string;
  }
}
