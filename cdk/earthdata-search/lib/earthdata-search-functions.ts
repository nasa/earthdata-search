import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cdk from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'
import { SharedApiGatewayResources } from './earthdata-search-shared-api-gateway-resources'

export interface FunctionsProps {
  /** The API Nested Stack scope */
  apiScope: cdk.Stack;
  /** The API Gateway Deployment resource */
  apiGatewayDeployment: cdk.aws_apigateway.CfnDeployment;
  /** The API Gateway Rest API resource */
  apiGatewayRestApi: cdk.aws_apigateway.CfnRestApi;
  /** Authorizers for the API Gateway */
  authorizers: {
    /** The standard EDL Authorizer */
    edlAuthorizer: apigateway.CfnAuthorizer;
    /** The EDL Optional Authorizer */
    edlOptionalAuthorizer: apigateway.CfnAuthorizer;
  };
  /** The cloudfrontBucketName */
  cloudfrontBucketName: string;
  /** Colormap generation job enabled */
  colormapJobEnabled: boolean;
  /** Default Lambda config options */
  defaultLambdaConfig: application.NodeJsFunctionProps;
  /** GIBS tagging job enabled */
  gibsJobEnabled: boolean;
  /** SQS Queues that trigger lambda functions */
  queues: {
    /** The SQS queue for processing catalog rest orders */
    catalogRestOrderQueue: sqs.IQueue;
    /** The SQS queue for processing CMR orders */
    cmrOrderingOrderQueue: sqs.IQueue;
    /** The SQS queue for processing color maps */
    colorMapsProcessingQueue: sqs.IQueue;
    /** The SQS queue for processing harmony orders */
    harmonyOrderQueue: sqs.IQueue;
    /** The SQS queue for processing swodlr orders */
    swodlrOrderQueue: sqs.IQueue;
    /** The SQS queue for processing tags */
    tagProcessingQueue: sqs.IQueue;
    /** The SQS queue for processing user data */
    userDataQueue: sqs.IQueue;
  };
  /** The stage name (dev/sit/etc) */
  stageName: string;
}

export class Functions extends Construct {
  constructor(scope: cdk.Stack, id: string, props: FunctionsProps) {
    super(scope, id)

    const {
      apiGatewayDeployment,
      apiGatewayRestApi,
      apiScope,
      authorizers,
      cloudfrontBucketName,
      colormapJobEnabled,
      defaultLambdaConfig,
      gibsJobEnabled,
      queues,
      stageName
    } = props

    const functionNamePrefix = scope.stackName
    /**
     * Shared API Gateway Resources
     */
    const sharedResources = new SharedApiGatewayResources(apiScope, 'SharedApiGatewayResources', {
      apiGatewayDeployment,
      apiGatewayRestApi
    })
    const {
      opensearchApiGatewayResource,
      retrievalsApiGatewayResource,
      retrievalsIdApiGatewayResource,
      scaleApiGatewayResource,
      shapefilesApiGatewayResource
    } = sharedResources

    /**
     * Alert Logger
     */
    const alertLoggerNestedStack = new cdk.NestedStack(scope, 'AlertLoggerNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(alertLoggerNestedStack, 'AlertLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'alert_logger'
      },
      entry: '../../serverless/src/alertLogger/handler.js',
      functionName: 'alertLogger',
      functionNamePrefix
    })

    /**
     * Autocomplete
     */
    const autocompleteNestedStack = new cdk.NestedStack(scope, 'AutocompleteNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(autocompleteNestedStack, 'AutocompleteLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        path: 'autocomplete'
      },
      entry: '../../serverless/src/autocomplete/handler.js',
      functionName: 'autocomplete',
      functionNamePrefix
    })

    /**
     * Cloudfront To Cloudwatch
     */
    const cloudfrontToCloudwatchNestedStack = new cdk.NestedStack(scope, 'CloudfrontToCloudwatchNestedStack')
    // eslint-disable-next-line no-new
    new application.CloudfrontToCloudwatchFunction(cloudfrontToCloudwatchNestedStack, 'CloudfrontToCloudwatchLambda', {
      cloudfrontBucketName,
      functionNamePrefix,
      logDestinationArn: defaultLambdaConfig.logDestinationArn,
      logGroupSuffix: defaultLambdaConfig.logGroupSuffix,
      runtime: defaultLambdaConfig.runtime,
      s3Sources: [
        `search_${stageName}_s3`,
        `search_${stageName}_api`
      ],
      stageName,
      securityGroups: defaultLambdaConfig.securityGroups,
      vpc: defaultLambdaConfig.vpc
    })

    /**
     * Decode ID
     */
    const decodeIdNestedStack = new cdk.NestedStack(scope, 'DecodeIdNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(decodeIdNestedStack, 'DecodeIdLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'decode_id'
      },
      entry: '../../serverless/src/decodeId/handler.js',
      functionName: 'decodeId',
      functionNamePrefix
    })

    /**
     * Get Retrievals
     */
    const getRetrievalsNestedStack = new cdk.NestedStack(scope, 'GetRetrievalsNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(getRetrievalsNestedStack, 'GetRetrievalsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'retrievals'
      },
      entry: '../../serverless/src/getRetrievals/handler.js',
      functionName: 'getRetrievals',
      functionNamePrefix
    })

    /**
     * Delete Retrieval
     */
    const deleteRetrievalNestedStack = new cdk.NestedStack(scope, 'DeleteRetrievalNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(deleteRetrievalNestedStack, 'DeleteRetrievalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsIdApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        parentPath: 'retrievals',
        path: '{id}'
      },
      entry: '../../serverless/src/deleteRetrieval/handler.js',
      functionName: 'deleteRetrieval',
      functionNamePrefix
    })

    /**
     * EDD Logger
     */
    const eddLoggerNestedStack = new cdk.NestedStack(scope, 'EddLoggerNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(eddLoggerNestedStack, 'EddLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'edd_logger'
      },
      entry: '../../serverless/src/eddLogger/handler.js',
      functionName: 'eddLogger',
      functionNamePrefix
    })

    /**
     * EDL Callback
     */
    const edlCallbackNestedStack = new cdk.NestedStack(scope, 'EdlCallbackNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(edlCallbackNestedStack, 'EdlCallbackLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'urs_callback'
      },
      entry: '../../serverless/src/edlCallback/handler.js',
      functionName: 'edlCallback',
      functionNamePrefix
    })

    /**
     * EDL Login
     */
    const edlLoginNestedStack = new cdk.NestedStack(scope, 'EdlLoginNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(edlLoginNestedStack, 'EdlLoginLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'login'
      },
      entry: '../../serverless/src/edlLogin/handler.js',
      functionName: 'edlLogin',
      functionNamePrefix
    })

    /**
     * Error Logger
     */
    const errorLoggerNestedStack = new cdk.NestedStack(scope, 'ErrorLoggerNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(errorLoggerNestedStack, 'ErrorLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'error_logger'
      },
      entry: '../../serverless/src/errorLogger/handler.js',
      functionName: 'errorLogger',
      functionNamePrefix
    })

    /**
     * Fix Retrieval Collection Metadata
     */
    const fixRetrievalCollectionMetadataNestedStack = new cdk.NestedStack(scope, 'FixRetrievalCollectionMetadataNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(fixRetrievalCollectionMetadataNestedStack, 'FixRetrievalCollectionMetadataLambda', {
      ...defaultLambdaConfig,
      description: 'Fixes retrieval collection metadata that was improperly written',
      entry: '../../serverless/src/fixRetrievalCollectionMetadata/handler.js',
      functionName: 'fixRetrievalCollectionMetadata',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(15)
    })

    /**
     * Generate Color Maps
     */
    const generateColorMapsNestedStack = new cdk.NestedStack(scope, 'GenerateColorMapsNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(generateColorMapsNestedStack, 'GenerateColorMapsLambda', {
      ...defaultLambdaConfig,
      description: 'Gather Color Map data from GIBS and store it in RDS',
      entry: '../../serverless/src/generateColorMaps/handler.js',
      functionName: 'generateColorMaps',
      functionNamePrefix,
      schedules: [{
        enabled: colormapJobEnabled,
        input: {
          projection: 'epsg4326'
        },
        schedule: events.Schedule.cron({
          hour: '12',
          minute: '0',
          month: '*',
          weekDay: 'MON-FRI',
          year: '*'
        })
      }, {
        enabled: colormapJobEnabled,
        input: {
          projection: 'epsg3857'
        },
        schedule: events.Schedule.cron({
          hour: '12',
          minute: '5',
          month: '*',
          weekDay: 'MON-FRI',
          year: '*'
        })
      }, {
        enabled: colormapJobEnabled,
        input: {
          projection: 'epsg3413'
        },
        schedule: events.Schedule.cron({
          hour: '12',
          minute: '10',
          month: '*',
          weekDay: 'MON-FRI',
          year: '*'
        })
      }, {
        enabled: colormapJobEnabled,
        input: {
          projection: 'epsg3031'
        },
        schedule: events.Schedule.cron({
          hour: '12',
          minute: '12',
          month: '*',
          weekDay: 'MON-FRI',
          year: '*'
        })
      }],
      timeout: cdk.Duration.minutes(5)
    })

    /**
     * Generate GIBS Tags
     */
    const generateGibsTagsNestedStack = new cdk.NestedStack(scope, 'GenerateGibsTagsNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(generateGibsTagsNestedStack, 'GenerateGibsTagsLambda', {
      ...defaultLambdaConfig,
      description: 'Tag CMR collections with GIBS product information',
      entry: '../../serverless/src/generateGibsTags/handler.js',
      functionName: 'generateGibsTags',
      functionNamePrefix,
      memorySize: 512,
      schedules: [{
        enabled: gibsJobEnabled,
        schedule: events.Schedule.cron({
          hour: '12',
          minute: '45',
          month: '*',
          weekDay: 'MON-FRI',
          year: '*'
        })
      }],
      timeout: cdk.Duration.minutes(5)
    })

    /**
     * Get Saved Access Configs
     */
    const getSavedAccessConfigsNestedStack = new cdk.NestedStack(scope, 'GetSavedAccessConfigsNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(getSavedAccessConfigsNestedStack, 'GetSavedAccessConfigsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'saved_access_configs'
      },
      entry: '../../serverless/src/getSavedAccessConfigs/handler.js',
      functionName: 'getSavedAccessConfigs',
      functionNamePrefix
    })

    /**
     * Save Shapefile
     */
    const saveShapefileNestedStack = new cdk.NestedStack(scope, 'SaveShapefileNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(saveShapefileNestedStack, 'SaveShapefileLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: shapefilesApiGatewayResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'shapefiles'
      },
      entry: '../../serverless/src/saveShapefile/handler.js',
      functionName: 'saveShapefile',
      functionNamePrefix
    })

    /**
     * Get Shapefile
     */
    const getShapefileNestedStack = new cdk.NestedStack(scope, 'GetShapefileNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(getShapefileNestedStack, 'GetShapefileLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        parentId: shapefilesApiGatewayResource?.ref,
        parentPath: 'shapefiles',
        path: '{id}'
      },
      entry: '../../serverless/src/getShapefile/handler.js',
      functionName: 'getShapefile',
      functionNamePrefix
    })

    /**
     * GraphQL
     */
    const graphQlNestedStack = new cdk.NestedStack(scope, 'GraphQlNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(graphQlNestedStack, 'GraphQlLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        // Only allow POST in production
        methods: stageName === 'dev' ? ['GET', 'POST'] : ['POST'],
        path: 'graphql'
      },
      entry: '../../serverless/src/graphQl/handler.js',
      functionName: 'graphql',
      functionNamePrefix
    })

    /**
     * Migrate Database
     */
    const migrateDatabaseNestedStack = new cdk.NestedStack(scope, 'MigrateDatabaseNestedStack')
    const { lambdaFunction: migrateDatabaseLambda } = new application.NodeJsFunction(migrateDatabaseNestedStack, 'MigrateDatabaseLambda', {
      ...defaultLambdaConfig,
      bundling: {
        ...defaultLambdaConfig.bundling,
        commandHooks: {
          beforeBundling(): string[] {
            return []
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `mkdir -p ${outputDir}/migrations`,
              `cp -R ${inputDir}/../../migrations ${outputDir}/`
            ]
          },
          beforeInstall(): string[] {
            return []
          }
        }
      },
      entry: '../../serverless/src/migrateDatabase/handler.js',
      functionName: 'migrateDatabase',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(5)
    })
    // Run database migrations when deployment is completed
    // eslint-disable-next-line no-new
    new events.Rule(migrateDatabaseNestedStack, 'RunMigrationsRule', {
      eventPattern: {
        detailType: ['CloudFormation Stack Status Change'],
        source: ['aws.cloudformation'],
        detail: {
          'stack-id': [`${scope.stackId}`],
          'status-details': {
            status: ['UPDATE_COMPLETE']
          }
        }
      },
      targets: [new eventsTargets.LambdaFunction(migrateDatabaseLambda)]
    })

    /**
     * OpenSearch Granule Search
     */
    const openSearchGranuleSearchNestedStack = new cdk.NestedStack(scope, 'OpenSearchGranuleSearchNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(openSearchGranuleSearchNestedStack, 'OpenSearchGranuleSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        parentId: opensearchApiGatewayResource.ref,
        parentPath: 'opensearch',
        path: 'granules'
      },
      entry: '../../serverless/src/openSearchGranuleSearch/handler.js',
      functionName: 'openSearchGranuleSearch',
      functionNamePrefix
    })

    /**
     * Process Color Map
     */
    const processColorMapNestedStack = new cdk.NestedStack(scope, 'ProcessColorMapNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(processColorMapNestedStack, 'ProcessColorMapLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/processColorMap/handler.js',
      functionName: 'processColorMap',
      functionNamePrefix,
      reservedConcurrentExecutions: 25,
      sqs: {
        batchSize: 10,
        queue: queues.colorMapsProcessingQueue
      },
      timeout: cdk.Duration.minutes(5)
    })

    /**
     * Process Tag
     */
    const processTagNestedStack = new cdk.NestedStack(scope, 'ProcessTagNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(processTagNestedStack, 'ProcessTagLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/processTag/handler.js',
      functionName: 'processTag',
      functionNamePrefix,
      reservedConcurrentExecutions: 25,
      sqs: {
        batchSize: 10,
        queue: queues.tagProcessingQueue
      },
      timeout: cdk.Duration.minutes(5)
    })

    /**
     * Relevancy Logger
     */
    const relevancyLoggerNestedStack = new cdk.NestedStack(scope, 'RelevancyLoggerNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(relevancyLoggerNestedStack, 'RelevancyLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'relevancy_logger'
      },
      entry: '../../serverless/src/relevancyLogger/handler.js',
      functionName: 'relevancyLogger',
      functionNamePrefix
    })

    /**
     * Replace CWIC With OpenSearch
     */
    const replaceCwicWithOpenSearchNestedStack = new cdk.NestedStack(scope, 'ReplaceCwicWithOpenSearchNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(replaceCwicWithOpenSearchNestedStack, 'ReplaceCwicWithOpenSearchLambda', {
      ...defaultLambdaConfig,
      description: 'Replaces references of isCwic with isOpenSearch',
      entry: '../../serverless/src/replaceCwicWithOpenSearch/handler.js',
      functionName: 'replaceCwicWithOpenSearch',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(15)
    })

    /**
     * Retrieve Granule Links
     */
    const retrieveGranuleLinksNestedStack = new cdk.NestedStack(scope, 'RetrieveGranuleLinksNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(retrieveGranuleLinksNestedStack, 'RetrieveGranuleLinksLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'granule_links'
      },
      entry: '../../serverless/src/retrieveGranuleLinks/handler.js',
      functionName: 'retrieveGranuleLinks',
      functionNamePrefix,
      memorySize: 256
    })

    /**
     * Scale Image
     */
    // Downloaded the lambda layer zip from https://github.com/pH200/sharp-layer/releases
    // Download the release-x64.zip file, rename it sharp-{release}-x64.zip and place it in the layers directory
    // The release number needs to match the version of sharp installed in package.json
    const sharpLambdaLayer = new lambda.LayerVersion(scope, 'SharpLambdaLayer', {
      code: lambda.Code.fromAsset('../../layers/sharp-0.33.5-x64.zip'),
      compatibleRuntimes: [defaultLambdaConfig.runtime],
      description: 'Sharp Lambda Layer'
    })
    const scaleImageNestedStack = new cdk.NestedStack(scope, 'ScaleImageNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(scaleImageNestedStack, 'ScaleImageLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: scaleApiGatewayResource,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'scale'
      },
      entry: '../../serverless/src/scaleImage/handler.js',
      functionName: 'scaleImage',
      functionNamePrefix,
      layers: [sharpLambdaLayer],
      memorySize: 256
    })

    /**
     * Store User Data
     */
    const storeUserDataNestedStack = new cdk.NestedStack(scope, 'StoreUserDataNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(storeUserDataNestedStack, 'StoreUserDataLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/storeUserData/handler.js',
      functionName: 'storeUserData',
      functionNamePrefix,
      sqs: {
        queue: queues.userDataQueue
      },
      timeout: cdk.Duration.minutes(5)
    })
  }
}
