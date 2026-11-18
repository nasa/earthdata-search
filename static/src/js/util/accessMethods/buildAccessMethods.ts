import { camelCase } from 'lodash-es'

import { buildHarmony } from './buildAccessMethods/buildHarmony'
/* @ts-expect-error This file does not have types */
import { buildDownload } from './buildAccessMethods/buildDownload'

import { AccessMethodTypes, HarmonyAccessMethod } from '../../zustand/types'
import { CollectionMetadata, VariableMetadata } from '../../types/sharedTypes'
import {
  HarmonyCapabilitiesDocument,
  HarmonyVariable
} from '../getDerivedHarmonyState/derivedHarmonyStateTypes'

/** What is returned form this function */
export type AccessMethodItems = Record<string, AccessMethodTypes>

/** ServiceItems look different depending on whether they come from Harmony or umm. This captures both cases */
export type AnyAccessMethodServiceItem = {
  /** Access Method Type. IE: Harmony, Download */
  type: string;
  /** Associated Variables of the access method */
  variables?: {
    /** Number of associated variables */
    count: number
    /** Array of variables. Can be either from harmony or umm */
    items: HarmonyVariable[] | VariableMetadata[]
  };
}

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
    }
  } = collectionMetadata

  // If the harmony document does not exist OR if the services length is 0, return null
  const harmonyMethod: HarmonyAccessMethod | null = harmonyCapabilitiesDocument?.services.length
    ? buildHarmony(harmonyCapabilitiesDocument, {}) : null

  const accessMethods: AccessMethodItems = {
    ...buildDownload(granules, isOpenSearch)
  }

  if (harmonyMethod) {
    accessMethods.harmony = harmonyMethod
  }

  // Object.assign(accessMethods, buildDownload(granules, isOpenSearch))

  return accessMethods
}
