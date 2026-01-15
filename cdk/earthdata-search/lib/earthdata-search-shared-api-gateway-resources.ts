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
  public readonly opensearchApiGatewayResource: apigateway.CfnResource

  public readonly scaleApiGatewayResource: apigateway.CfnResource

  public readonly shapefilesApiGatewayResource: apigateway.CfnResource

  constructor(scope: cdk.Stack, id: string, props: SharedApiGatewayResourcesProps) {
    super(scope, id)

    const {
      apiGatewayDeployment,
      apiGatewayRestApi
    } = props

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
     * Scale API Gateway Resource
     */
    const scaleApiGatewayResource = new apigateway.CfnResource(scope, 'ApiGatewayResourceScale', {
      parentId: apiGatewayRestApi.attrRootResourceId,
      pathPart: 'scale',
      restApiId: apiGatewayRestApi.ref
    })
    this.scaleApiGatewayResource = scaleApiGatewayResource

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
