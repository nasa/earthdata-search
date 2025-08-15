import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface SharedApiGatewayResourcesProps {
  /** The API Gateway Deployment resource */
  apiGatewayDeployment: cdk.aws_apigateway.CfnDeployment;
  /** The API Gateway Rest API resource */
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
}

export class SharedApiGatewayResources extends Construct {
  public readonly adminApiGatewayResource: apigateway.CfnResource

  public readonly adminProjectsApiGatewayResource: apigateway.CfnResource

  public readonly collectionsApiGatewayResource: apigateway.CfnResource

  public readonly colormapsApiGatewayResource: apigateway.CfnResource

  public readonly conceptsApiGatewayResource: apigateway.CfnResource

  public readonly contactInfoApiGatewayResource: apigateway.CfnResource

  public readonly granulesApiGatewayResource: apigateway.CfnResource

  public readonly opensearchApiGatewayResource: apigateway.CfnResource

  public readonly projectsApiGatewayResource: apigateway.CfnResource

  public readonly projectsIdApiGatewayResource: apigateway.CfnResource

  public readonly retrievalCollectionsApiGatewayResource: apigateway.CfnResource

  public readonly retrievalsApiGatewayResource: apigateway.CfnResource

  public readonly retrievalsIdApiGatewayResource: apigateway.CfnResource

  public readonly scaleApiGatewayResource: apigateway.CfnResource

  public readonly scaleConceptTypeApiGatewayResource: apigateway.CfnResource

  public readonly shapefilesApiGatewayResource: apigateway.CfnResource

  constructor(scope: cdk.Stack, id: string, props: SharedApiGatewayResourcesProps) {
    super(scope, id)

    const {
      apiGatewayDeployment,
      apiGatewayRestApi
    } = props

    /**
     * Admin API Gateway Resource
     */
    const adminApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceAdmin', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'admin',
      restApiId: apiGatewayRestApi.ref
    })
    this.adminApiGatewayResource = adminApiGatewayResource

    /**
     * Admin Projects API Gateway Resource
     */
    const adminProjectsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceAdminProjects', {
      parentId: adminApiGatewayResource.ref,
      pathPart: 'projects',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'AdminProjectsOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: adminProjectsApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET'],
      name: 'AdminProjects'
    })

    this.adminProjectsApiGatewayResource = adminProjectsApiGatewayResource

    /**
     * Collections API Gateway Resource
     */
    const collectionsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceCollections', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'collections',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'CollectionsOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: collectionsApiGatewayResource,
      apiGatewayRestApi,
      methods: ['POST'],
      name: 'Collections'
    })

    this.collectionsApiGatewayResource = collectionsApiGatewayResource

    /**
     * Colormaps API Gateway Resource
     */
    const colormapsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceColormaps', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'colormaps',
      restApiId: apiGatewayRestApi.ref
    })
    this.colormapsApiGatewayResource = colormapsApiGatewayResource

    /**
     * Concepts API Gateway Resource
     */
    const conceptsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceConcepts', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'concepts',
      restApiId: apiGatewayRestApi.ref
    })
    this.conceptsApiGatewayResource = conceptsApiGatewayResource

    /**
     * Contact Info Gateway Resource
     */
    const contactInfoApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceAdminContactInfo', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'contact_info',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'ContactInfoOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: contactInfoApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET', 'POST'],
      name: 'ContactInfo'
    })

    this.contactInfoApiGatewayResource = contactInfoApiGatewayResource

    /**
     * Granules API Gateway Resource
     */
    const granulesApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceGranules', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'granules',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'GranulesOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: granulesApiGatewayResource,
      apiGatewayRestApi,
      methods: ['POST'],
      name: 'Granules'
    })

    this.granulesApiGatewayResource = granulesApiGatewayResource

    /**
     * OpenSearch API Gateway Resource
     */
    const opensearchApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceOpensearch', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'opensearch',
      restApiId: apiGatewayRestApi.ref
    })
    this.opensearchApiGatewayResource = opensearchApiGatewayResource

    /**
     * Projects API Gateway Resource
     */
    const projectsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProjects', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'projects',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'ProjectsOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: projectsApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET', 'POST'],
      name: 'Projects'
    })

    this.projectsApiGatewayResource = projectsApiGatewayResource

    /**
     * Projects ID API Gateway Resource
     */
    const projectsIdApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceProjectsIdVar', {
      parentId: projectsApiGatewayResource?.ref,
      pathPart: '{id}',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'ProjectsIdVarOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: projectsIdApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET', 'DELETE'],
      name: 'ProjectsIdVar'
    })

    this.projectsIdApiGatewayResource = projectsIdApiGatewayResource

    /**
     * Retrieval Collection API Gateway Resource
     */
    const retrievalCollectionsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceRetrievalCollections', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'retrieval_collections',
      restApiId: apiGatewayRestApi.ref
    })
    this.retrievalCollectionsApiGatewayResource = retrievalCollectionsApiGatewayResource

    /**
     * Retrievals API Gateway Resource
     */
    const retrievalsApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceRetrievals', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'retrievals',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'RetrievalsOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: retrievalsApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET', 'POST'],
      name: 'Retrievals'
    })

    this.retrievalsApiGatewayResource = retrievalsApiGatewayResource

    /**
     * Retrievals ID API Gateway Resource
     */
    const retrievalsIdApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceRetrievalsIdVar', {
      parentId: retrievalsApiGatewayResource?.ref,
      pathPart: '{id}',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'RetrievalsIdVarOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: retrievalsIdApiGatewayResource,
      apiGatewayRestApi,
      methods: ['GET', 'DELETE'],
      name: 'RetrievalsIdVar'
    })

    this.retrievalsIdApiGatewayResource = retrievalsIdApiGatewayResource

    /**
     * Scale API Gateway Resource
     */
    const scaleApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceScale', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'scale',
      restApiId: apiGatewayRestApi.ref
    })
    this.scaleApiGatewayResource = scaleApiGatewayResource

    /**
     * Scale ConceptType API Gateway Resource
     */
    const scaleConceptTypeApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceScaleConceptType', {
      parentId: scaleApiGatewayResource.ref,
      pathPart: '{concept_type}',
      restApiId: apiGatewayRestApi.ref
    })
    this.scaleConceptTypeApiGatewayResource = scaleConceptTypeApiGatewayResource

    /**
     * Shapefile API Gateway Resource
     */
    const shapefilesApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceShapefiles', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'shapefiles',
      restApiId: apiGatewayRestApi.ref
    })
    // eslint-disable-next-line no-new
    new application.ApiOptionsMethod(scope, 'ShapefilesOptionsMethod', {
      apiGatewayDeployment,
      apiGatewayResource: shapefilesApiGatewayResource,
      apiGatewayRestApi,
      methods: ['POST'],
      name: 'Shapefiles'
    })

    this.shapefilesApiGatewayResource = shapefilesApiGatewayResource
  }
}
