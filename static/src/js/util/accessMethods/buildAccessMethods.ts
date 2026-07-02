import { camelCase } from 'lodash-es'

/* @ts-expect-error This file does not have types */
import { buildEcho } from './buildAccessMethods/buildEcho'
/* @ts-expect-error This file does not have types */
import { buildEsi } from './buildAccessMethods/buildEsi'
/* @ts-expect-error This file does not have types */
import { buildOpendap } from './buildAccessMethods/buildOpendap'
import { buildHarmony } from './buildAccessMethods/buildHarmony'
/* @ts-expect-error This file does not have types */
import { buildSwodlr } from './buildAccessMethods/buildSwodlr'
/* @ts-expect-error This file does not have types */
import { buildDownload } from './buildAccessMethods/buildDownload'

import { AccessMethodTypes, HarmonyAccessMethod } from '../../zustand/types'
import {
  CollectionMetadata,
  ServiceItem,
  VariableMetadata
} from '../../types/sharedTypes'
import {
  HarmonyCapabilitiesDocument,
  HarmonyVariable
} from '../getDerivedHarmonyState/derivedHarmonyStateTypes'

/** What is returned form this function */
export type AccessMethodItems = Record<string, AccessMethodTypes>

/** ServiceItems look different depending on whether they come from Harmony or umm. This captures both cases */
export type AnyAccessMethodServiceItem = {
  /** Access Method Type. IE: Harmony, ESI, OPeNDAP */
  type: string;
  /** Associated Variables of the access method */
  variables?: {
    /** Number of associated variables */
    count: number
    /** Array of variables. Can be either from harmony or umm */
    items: HarmonyVariable[] | VariableMetadata[]
  };
}

const ECHO_ORDERS = 'echoOrders'
const ESI = 'esi'
const OPENDAP = 'opendap'
const SWODLR = 'swodlr'

/**
 * Formats a service type into a lower case and camelCase version
 * @param serviceType - serviceType string
 * @returns formatted service type
 */
export const formatServiceType = (serviceType: string): string => {
  const lowerServiceType = serviceType.toLowerCase()

  return camelCase(lowerServiceType)
}

/**
 * Reduces a list of all the accessMethods into a single object with correctly incremented/listed values
 * @param items - list of accessMethod items
 * @returns AccessMethodItems as a single object of all the accessMethod items
 */
export const reduceAccessMethods = (items: AccessMethodTypes[] = []): AccessMethodItems => {
  let esiIndex = 0
  let echoIndex = 0

  const accessMethods = items.reduce((methods: AccessMethodItems, item: AccessMethodTypes) => {
    const { type: serviceType } = item

    const methodKey = serviceType ? formatServiceType(serviceType) : ''

    const updatedAccessMethods: AccessMethodItems = { ...methods }

    switch (methodKey) {
      case ESI:
        updatedAccessMethods[`${methodKey}${esiIndex}`] = item
        esiIndex += 1
        break
      case ECHO_ORDERS:
        updatedAccessMethods[`${methodKey}${echoIndex}`] = item
        echoIndex += 1
        break
      // No need to create a "accessMethodKey" since you can only have one openDap or SWODLR
      case OPENDAP:
      case SWODLR:
        updatedAccessMethods[methodKey] = item
        break
      default:
        break
    }

    return updatedAccessMethods
  }, {})

  return accessMethods
}

/**
 * Builds the different access methods available for the provided collection
 * @param collectionMetadata - Collection Metadata
 * @param isOpenSearch - Is the collection an open search collection
 * @param harmonyCapabilitiesDocument - The harmony capabilities document
 * @returns Access methods
 */
export const buildAccessMethods = (
  collectionMetadata: CollectionMetadata,
  isOpenSearch: boolean,
  harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument | null
): AccessMethodItems => {
  const {
    granules = {
      count: 0,
      items: []
    },
    services = {
      count: 0,
      items: []
    },
    variables: collectionAssociatedVariables = {
      count: 0,
      items: []
    }
  } = collectionMetadata

  const { items: serviceItems } = services

  const nonDownloadMethodItems = serviceItems.flatMap((serviceItem: AnyAccessMethodServiceItem) => {
    let associatedVariables = collectionAssociatedVariables.items
    const {
      type: serviceType,
      variables: serviceAssociatedVariables = {
        count: 0,
        items: []
      }
    } = serviceItem

    // Overwrite variables if there are variables associated to the service record
    if (serviceAssociatedVariables.items.length > 0) {
      associatedVariables = serviceAssociatedVariables.items
    }

    const formattedServiceType = formatServiceType(serviceType)

    // Only process service types that EDSC supports. As harmony no longer comes from UMM-S, we exclude it here.
    if (![ESI, ECHO_ORDERS, OPENDAP, SWODLR].includes(formattedServiceType)) {
      return {}
    }

    const params = {
      associatedVariables
    }

    // Use a switch statement instead of dynamic object lookup
    switch (formattedServiceType) {
      case ECHO_ORDERS:
        return buildEcho(serviceItem as ServiceItem)
      case ESI:
        return buildEsi(serviceItem as ServiceItem)
      case OPENDAP:
        return buildOpendap(serviceItem as ServiceItem, params)
      case SWODLR:
        return buildSwodlr(serviceItem as ServiceItem)
      default:
        // Only process service types that EDSC supports.
        // Excludes harmony, etc.
        return {}
    }
  })

  const nonDownloadMethods = reduceAccessMethods(nonDownloadMethodItems)

  // If the harmony document does not exist OR if the services length is 0, return null
  const harmonyMethod: HarmonyAccessMethod | null = harmonyCapabilitiesDocument?.services.length
    ? buildHarmony(harmonyCapabilitiesDocument, {}) : null

  if (harmonyMethod) {
    nonDownloadMethods.harmony = harmonyMethod
  }

  const accessMethods: AccessMethodItems = {
    ...nonDownloadMethods,
    ...buildDownload(granules, isOpenSearch)
  }

  return accessMethods
}
