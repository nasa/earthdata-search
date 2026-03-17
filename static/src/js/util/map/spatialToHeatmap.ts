import getEdlToken from '../../zustand/selectors/user'
import getEarthdataEnvironment from '../../zustand/selectors/earthdataEnvironment'

import CollectionRequest from '../request/collectionRequest'

// import { buildCollectionSearchParams, prepareCollectionParams } from '../collections'

import getGranules from '../../zustand/selectors/granules'

// import createCollectionSlice from '../../zustand/slices/createCollectionSlice'
import updateStore from '../url/updateStore'
import useEdscStore from '../../zustand/useEdscStore'

let requestObject = new CollectionRequest(getEdlToken(), getEarthdataEnvironment())

async function getTestCollection() {
    const params = {
        conceptId: 'C1214470488-ASF'
    }

    let result = (await requestObject.search(params)).data
    await updateStore({
        focusedCollection: 'C1214470488-ASF'
    })
    
    let granules = useEdscStore((state) => state.granules.getGranules())
    let granuleMetadata = granules.items

    console.log(granuleMetadata)
}
