import { gql } from '@apollo/client'

const GET_NOTEBOOK_GRANULES = gql`
  query GetNotebookGranules(
    $granulesParams: GranulesInput
    $variablesParams: VariablesInput
  ) {
    granules(params: $granulesParams) {
      items {
        conceptId
        title
        collection {
          conceptId
          shortName
          title
          variables(params: $variablesParams) {
            items {
              name
            }
          }
        }
      }
    }
  }
`

export default GET_NOTEBOOK_GRANULES
