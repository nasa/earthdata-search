import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'

import { application } from '@edsc/cdk-utils'

import { Queues } from './earthdata-search-queues'
import { Functions } from './earthdata-search-functions'
import { Authorizers } from './earthdata-search-authorizers'
import { StepFunctions } from './earthdata-search-step-functions'

export interface EarthdataSearchStackProps extends cdk.StackProps {
}

// `logGroupSuffix` is used during the initial migration from serverless to CDK to avoid name conflicts
// const logGroupSuffix = '_cdk'
const logGroupSuffix = ''

const {
  CACHE_KEY_EXPIRE_SECONDS = '84000',
  CLOUDFRONT_BUCKET_NAME = 'local-bucket',
  CLOUDFRONT_OAI_ID = 'local-oai',
  COLORMAP_JOB_ENABLED,
  GIBS_JOB_ENABLED,
  LOG_DESTINATION_ARN = 'local-arn',
  NODE_ENV = 'development',
  OBFUSCATION_SPIN = '',
  OBFUSCATION_SPIN_SHAPEFILES = '',
  ORDER_DELAY_SECONDS = '1',
  ORDER_STATUS_REFRESH_TIME = '60000',
  S3_OBJECTS_EXPIRATION_IN_DAYS = '30',
  STAGE_NAME = 'dev',
  SUBNET_ID_A = 'local-subnet-a',
  SUBNET_ID_B = 'local-subnet-b',
  USE_IMAGE_CACHE = 'false',
  VPC_ID = 'local-vpc'
} = process.env
const runtime = lambda.Runtime.NODEJS_22_X

/**
 * The AWS CloudFormation template for this Serverless application
 */
export class EarthdataSearchStack extends cdk.Stack {
  /**
   * URL of the service endpoint
   */
  public readonly serviceEndpoint

  public constructor(scope: cdk.App, id: string, props: EarthdataSearchStackProps = {}) {
    super(scope, id, props)

    const applicationRole = cdk.Fn.importValue(`${STAGE_NAME}-EDSCServerlessAppRole`)
    const lambdaSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'EarthdataSearchLambdaSecurityGroup', cdk.Fn.importValue(`${STAGE_NAME}-EarthdataSearchLambdaSecurityGroup`))

    const lambdaRole = iam.Role.fromRoleArn(this, 'EarthdataSearchLambdaRole', applicationRole)

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      privateSubnetIds: [
        SUBNET_ID_A,
        SUBNET_ID_B
      ],
      vpcId: VPC_ID
    })

    const apiNestedStack = new cdk.NestedStack(this, 'ApiNestedStack')

    const apiGateway = new application.ApiGateway(this, 'ApiGateway', {
      apiScope: apiNestedStack,
      apiName: this.stackName,
      binaryMediaTypes: ['image/png'],
      stageName: STAGE_NAME
    })
    const {
      apiGatewayDeployment,
      apiGatewayRestApi
    } = apiGateway

    const queues = new Queues(this, 'Queues', {
      queueNameSuffix: logGroupSuffix
    })
    const {
      catalogRestOrderQueue,
      cmrOrderingOrderQueue,
      colorMapsProcessingQueue,
      harmonyOrderQueue,
      swodlrOrderQueue,
      tagProcessingQueue,
      userDataQueue
    } = queues

    const environment = {
      CACHE_HOST: cdk.Fn.importValue(`${STAGE_NAME}-ElastiCacheEndpoint`),
      CACHE_KEY_EXPIRE_SECONDS,
      CACHE_PORT: cdk.Fn.importValue(`${STAGE_NAME}-ElastiCachePort`),
      CATALOG_REST_QUEUE_URL: catalogRestOrderQueue.queueUrl,
      CMR_ORDERING_ORDER_QUEUE_URL: cmrOrderingOrderQueue.queueUrl,
      COLOR_MAP_QUEUE_URL: colorMapsProcessingQueue.queueUrl,
      CONFIG_SECRET_ID: cdk.Fn.importValue(`${STAGE_NAME}-DbPasswordSecret`),
      DATABASE_ENDPOINT: cdk.Fn.importValue(`${STAGE_NAME}-DatabaseEndpoint`),
      DATABASE_PORT: cdk.Fn.importValue(`${STAGE_NAME}-DatabasePort`),
      DB_NAME: `edsc_${STAGE_NAME}`,
      GENERATE_NOTEBOOKS_BUCKET_NAME: `${this.stackName}-generate-notebooks`,
      HARMONY_QUEUE_URL: harmonyOrderQueue.queueUrl,
      NODE_ENV,
      NODE_OPTIONS: '--enable-source-maps',
      OBFUSCATION_SPIN,
      OBFUSCATION_SPIN_SHAPEFILES,
      ORDER_DELAY_SECONDS,
      SWODLR_QUEUE_URL: swodlrOrderQueue.queueUrl,
      TAG_QUEUE_URL: tagProcessingQueue.queueUrl,
      USE_IMAGE_CACHE,
      USER_DATA_QUEUE_URL: userDataQueue.queueUrl
    }

    const defaultLambdaConfig = {
      bundling: {
        externalModules: [
          '@aws-sdk/*',
          'better-sqlite3',
          'mysql',
          'mysql2',
          'oracledb',
          'pg-native',
          'pg-query-stream',
          'sharp',
          'sqlite3',
          'tedious'
        ],
        loader: {
          '.svg': 'text',
          '.ipynb': 'json',
          '.graphql': 'text',
          '.gql': 'text'
        },
        minify: NODE_ENV === 'production'
      },
      entry: '',
      environment,
      functionName: '',
      logDestinationArn: LOG_DESTINATION_ARN,
      logGroupSuffix,
      memorySize: 128,
      role: lambdaRole,
      runtime,
      securityGroups: [lambdaSecurityGroup],
      stageName: STAGE_NAME,
      vpc
    }

    const authorizers = new Authorizers(this, 'Authorizers', {
      apiGatewayRestApi,
      defaultLambdaConfig
    })

    // eslint-disable-next-line no-new
    new Functions(this, 'Functions', {
      apiGatewayDeployment,
      apiGatewayRestApi,
      apiScope: apiNestedStack,
      authorizers,
      cloudfrontBucketName: CLOUDFRONT_BUCKET_NAME,
      cloudfrontOaiId: CLOUDFRONT_OAI_ID,
      colormapJobEnabled: COLORMAP_JOB_ENABLED === 'true',
      defaultLambdaConfig,
      gibsJobEnabled: GIBS_JOB_ENABLED === 'true',
      queues,
      s3ObjectsExpirationInDays: parseInt(S3_OBJECTS_EXPIRATION_IN_DAYS, 10),
      stageName: STAGE_NAME,
      vpcId: VPC_ID
    })

    // eslint-disable-next-line no-new
    new StepFunctions(this, 'StepFunctions', {
      defaultLambdaConfig,
      logGroupSuffix,
      orderStatusRefreshTime: parseInt(ORDER_STATUS_REFRESH_TIME, 10),
      queues,
      role: lambdaRole,
      stageName: STAGE_NAME
    })

    // Outputs
    this.serviceEndpoint = [
      'https://',
      apiGatewayRestApi.ref,
      '.execute-api.',
      this.region,
      '.',
      this.urlSuffix,
      `/${STAGE_NAME}`
    ].join('')

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'CfnOutputServiceEndpoint', {
      key: 'ServiceEndpoint',
      description: 'URL of the service endpoint',
      exportName: `sls-${this.stackName}-ServiceEndpoint`,
      value: this.serviceEndpoint!.toString()
    })
  }
}
