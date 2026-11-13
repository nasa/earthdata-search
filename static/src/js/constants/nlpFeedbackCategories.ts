/** Values of the NlpFeedbackCategory GraphQL enum */
export type NlpFeedbackCategoryEnum =
  | 'KEYWORD'
  | 'SPATIAL'
  | 'TEMPORAL'
  | 'INCOMPLETE'
  | 'RELEVANCY'
  | 'OTHER'
  | 'COMMENT'

/** Boolean reason columns on an NLP feedback entry */
export type NlpFeedbackReasonField =
  | 'keyword'
  | 'spatial'
  | 'temporal'
  | 'incomplete'
  | 'relevancy'
  | 'other'

/** Count keys on the NlpFeedbackReport type that correspond to a reason */
export type NlpFeedbackCategoryCountKey =
  | 'keywordCount'
  | 'spatialCount'
  | 'temporalCount'
  | 'incompleteCount'
  | 'relevancyCount'
  | 'otherCount'

export interface NlpFeedbackCategoryDefinition {
  /** The NlpFeedbackCategory enum value used to query entries for this reason */
  category: NlpFeedbackCategoryEnum
  /** The field on the NlpFeedback type indicating this reason was selected */
  field: NlpFeedbackReasonField
  /** The count key on the NlpFeedbackReport type */
  key: NlpFeedbackCategoryCountKey
  /** Short display name */
  name: string
  /** Option text shown to users in the SearchFormFeedback component */
  option: string
}

export const NLP_FEEDBACK_CATEGORIES: NlpFeedbackCategoryDefinition[] = [
  {
    category: 'KEYWORD',
    field: 'keyword',
    key: 'keywordCount',
    name: 'Keyword',
    option: 'Wrong keyword'
  },
  {
    category: 'SPATIAL',
    field: 'spatial',
    key: 'spatialCount',
    name: 'Spatial',
    option: 'Wrong location'
  },
  {
    category: 'TEMPORAL',
    field: 'temporal',
    key: 'temporalCount',
    name: 'Temporal',
    option: 'Wrong date range'
  },
  {
    category: 'INCOMPLETE',
    field: 'incomplete',
    key: 'incompleteCount',
    name: 'Incomplete',
    option: 'Missed part of my search'
  },
  {
    category: 'RELEVANCY',
    field: 'relevancy',
    key: 'relevancyCount',
    name: 'Relevancy',
    option: 'Results aren\'t relevant'
  },
  {
    category: 'OTHER',
    field: 'other',
    key: 'otherCount',
    name: 'Other',
    option: 'Other'
  }
]
