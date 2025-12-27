import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import { handleAlert } from './alerts'
import { collectionRelevancyMetrics } from './relevancy'

const actions = {
  changePath,
  changeUrl,
  collectionRelevancyMetrics,
  handleAlert,
  updateStore
}

export default actions
