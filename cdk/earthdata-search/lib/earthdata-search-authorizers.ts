import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface AuthorizersProps {
  /** The API Gateway Rest API resource */
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  /** Default Lambda config options */
  defaultLambdaConfig: application.NodeJsFunctionProps;
}

export class Authorizers extends Construct {
  public readonly edlAuthorizer: apigateway.CfnAuthorizer

  public readonly edlOptionalAuthorizer: apigateway.CfnAuthorizer

  constructor(scope: cdk.Stack, id: string, props: AuthorizersProps) {
    super(scope, id)

    const {
      apiGatewayRestApi,
      defaultLambdaConfig
    } = props

    const functionNamePrefix = scope.stackName

    /**
     * EDL Authorizer
     */
    const edlAuthorizerNestedStack = new cdk.NestedStack(scope, 'EdlAuthorizerNestedStack')
    const { lambdaFunction: edlAuthorizerLambda } = new application.NodeJsFunction(edlAuthorizerNestedStack, 'EdlAuthorizerLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/edlAuthorizer/handler.js',
      functionName: 'edlAuthorizer',
      functionNamePrefix
    })
    // eslint-disable-next-line no-new
    new lambda.CfnPermission(scope, 'EdlAuthorizerLambdaPermissionApiGateway', {
      functionName: edlAuthorizerLambda.functionName,
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      sourceArn: [
        'arn:',
        scope.partition,
        ':execute-api:',
        scope.region,
        ':',
        scope.account,
        ':',
        apiGatewayRestApi.ref,
        '/*/*'
      ].join('')
    })

    const edlAuthorizer = new apigateway.CfnAuthorizer(edlAuthorizerNestedStack, 'EdlAuthorizer', {
      authorizerResultTtlInSeconds: 0,
      authorizerUri: cdk.Fn.join('', [
        'arn:',
        cdk.Aws.PARTITION,
        ':apigateway:',
        cdk.Aws.REGION,
        ':lambda:path/2015-03-31/functions/',
        edlAuthorizerLambda.functionArn,
        '/invocations'
      ]),
      identitySource: 'method.request.header.Authorization',
      name: 'edlAuthorizer',
      restApiId: apiGatewayRestApi.ref,
      type: 'REQUEST'
    })
    this.edlAuthorizer = edlAuthorizer

    /**
     * EDL Optional Authorizer
     */
    const edlOptionalAuthorizerNestedStack = new cdk.NestedStack(scope, 'EdlOptionalAuthorizerNestedStack')
    const { lambdaFunction: edlOptionalAuthorizerLambda } = new application.NodeJsFunction(edlOptionalAuthorizerNestedStack, 'EdlOptionalAuthorizerLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/edlOptionalAuthorizer/handler.js',
      functionName: 'edlOptionalAuthorizer',
      functionNamePrefix
    })
    // eslint-disable-next-line no-new
    new lambda.CfnPermission(edlOptionalAuthorizerNestedStack, 'EdlOptionalAuthorizerLambdaPermissionApiGateway', {
      functionName: edlOptionalAuthorizerLambda.functionName,
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      sourceArn: [
        'arn:',
        scope.partition,
        ':execute-api:',
        scope.region,
        ':',
        scope.account,
        ':',
        apiGatewayRestApi.ref,
        '/*/*'
      ].join('')
    })

    const edlOptionalAuthorizer = new apigateway.CfnAuthorizer(edlOptionalAuthorizerNestedStack, 'EdlOptionalAuthorizer', {
      authorizerResultTtlInSeconds: 0,
      authorizerUri: cdk.Fn.join('', [
        'arn:',
        cdk.Aws.PARTITION,
        ':apigateway:',
        cdk.Aws.REGION,
        ':lambda:path/2015-03-31/functions/',
        edlOptionalAuthorizerLambda.functionArn,
        '/invocations'
      ]),
      identitySource: 'method.request.header.Authorization',
      name: 'edlOptionalAuthorizer',
      restApiId: apiGatewayRestApi.ref,
      type: 'REQUEST'
    })
    this.edlOptionalAuthorizer = edlOptionalAuthorizer
  }
}
