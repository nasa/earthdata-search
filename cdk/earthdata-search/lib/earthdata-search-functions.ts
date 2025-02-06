import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

import { application } from '@edsc/cdk-utils';
import { SharedApiGatewayResources } from './earthdata-search-shared-api-gateway-resources';

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
    /** The EDL Admin Authorizer */
    edlAdminAuthorizer: apigateway.CfnAuthorizer;
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
    super(scope, id);

    const {
      apiScope,
      apiGatewayDeployment,
      apiGatewayRestApi,
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
      adminApiGatewayResource,
      adminProjectsApiGatewayResource,
      adminRetrievalsApiGatewayResource,
      collectionsApiGatewayResource,
      colormapsApiGatewayResource,
      conceptsApiGatewayResource,
      contactInfoApiGatewayResource,
      granulesApiGatewayResource,
      opensearchApiGatewayResource,
      projectsApiGatewayResource,
      projectsIdApiGatewayResource,
      retrievalCollectionsApiGatewayResource,
      retrievalsApiGatewayResource,
      retrievalsIdApiGatewayResource,
      scaleConceptTypeApiGatewayResource,
      shapefilesApiGatewayResource
    } = sharedResources

    /**
     * Admin Get Preferences Metrics
     */
    const adminGetPreferencesMetricsNestedStack = new cdk.NestedStack(scope, 'AdminGetPreferencesMetricsNestedStack');
    new application.NodeJsFunction(adminGetPreferencesMetricsNestedStack, 'AdminGetPreferencesMetricsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentId: adminApiGatewayResource.ref,
        parentPath: 'admin',
        path: 'preferences_metrics'
      },
      entry: '../../serverless/src/adminGetPreferencesMetrics/handler.js',
      functionName: 'adminGetPreferencesMetrics',
      functionNamePrefix,
      memorySize: 1024,
    });

    /**
     * Admin Get Projects
     */
    const adminGetProjectsNestedStack = new cdk.NestedStack(scope, 'AdminGetProjectsNestedStack');
    new application.NodeJsFunction(adminGetProjectsNestedStack, 'AdminGetProjectsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: adminProjectsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentPath: 'admin',
        path: 'projects'
      },
      entry: '../../serverless/src/adminGetProjects/handler.js',
      functionName: 'adminGetProjects',
      functionNamePrefix,
    });

    /**
     * Admin Get Project
     */
    const adminGetProjectNestedStack = new cdk.NestedStack(scope, 'AdminGetProjectNestedStack');
    new application.NodeJsFunction(adminGetProjectNestedStack, 'AdminGetProjectLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentId: adminProjectsApiGatewayResource?.ref,
        parentPath: 'admin/projects',
        path: '{id}'
      },
      entry: '../../serverless/src/adminGetProject/handler.js',
      functionName: 'adminGetProject',
      functionNamePrefix
    })

    /**
     * Admin Get Retrievals
     */
    const adminGetRetrievalsNestedStack = new cdk.NestedStack(scope, 'AdminGetRetrievalsNestedStack');
    new application.NodeJsFunction(adminGetRetrievalsNestedStack, 'AdminGetRetrievalsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: adminRetrievalsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentPath: 'admin',
        path: 'retrievals'
      },
      entry: '../../serverless/src/adminGetRetrievals/handler.js',
      functionName: 'adminGetRetrievals',
      functionNamePrefix,
    });

    /**
     * Admin Get Retrieval
     */
    const adminGetRetrievalNestedStack = new cdk.NestedStack(scope, 'AdminGetRetrievalNestedStack');
    new application.NodeJsFunction(adminGetRetrievalNestedStack, 'AdminGetRetrievalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentId: adminRetrievalsApiGatewayResource?.ref,
        parentPath: 'admin/retrievals',
        path: '{id}'
      },
      entry: '../../serverless/src/adminGetRetrieval/handler.js',
      functionName: 'adminGetRetrieval',
      functionNamePrefix,
    })

    /**
     * Admin Get Retrievals Metrics
     */
    const adminGetRetrievalsMetricsNestedStack = new cdk.NestedStack(scope, 'AdminGetRetrievalsMetricsNestedStack');
    new application.NodeJsFunction(adminGetRetrievalsMetricsNestedStack, 'AdminGetRetrievalsMetricsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentId: adminApiGatewayResource.ref,
        parentPath: 'admin',
        path: 'retrievals_metrics'
      },
      entry: '../../serverless/src/adminGetRetrievalsMetrics/handler.js',
      functionName: 'adminGetRetrievalsMetrics',
      functionNamePrefix,
    });

    /**
     * Admin Is Authorized
     */
    const adminIsAuthorizedNestedStack = new cdk.NestedStack(scope, 'AdminIsAuthorizedNestedStack');
    new application.NodeJsFunction(adminIsAuthorizedNestedStack, 'AdminIsAuthorizedLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['GET'],
        parentId: adminApiGatewayResource.ref,
        parentPath: 'admin',
        path: 'is_authorized'
      },
      entry: '../../serverless/src/adminIsAuthorized/handler.js',
      functionName: 'adminIsAuthorized',
      functionNamePrefix,
    });

    /**
     * Alert Logger
     */
    const alertLoggerNestedStack = new cdk.NestedStack(scope, 'AlertLoggerNestedStack')
    new application.NodeJsFunction(alertLoggerNestedStack, 'AlertLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'alert_logger',
      },
      entry: '../../serverless/src/alertLogger/handler.js',
      functionName: 'alertLogger',
      functionNamePrefix,
    });

    /**
     * Autocomplete
     */
    const autocompleteNestedStack = new cdk.NestedStack(scope, 'AutocompleteNestedStack')
    new application.NodeJsFunction(autocompleteNestedStack, 'AutocompleteLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        path: 'autocomplete',
      },
      entry: '../../serverless/src/autocomplete/handler.js',
      functionName: 'autocomplete',
      functionNamePrefix,
    });

    /**
     * Cloudfront To Cloudwatch
     */
    const cloudfrontToCloudwatchNestedStack = new cdk.NestedStack(scope, 'CloudfrontToCloudwatchNestedStack');
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
      vpc: defaultLambdaConfig.vpc,
    });

    /**
     * CMR Granule Search
     */
    const cmrGranuleSearchNestedStack = new cdk.NestedStack(scope, 'CmrGranuleSearchNestedStack');
    new application.NodeJsFunction(cmrGranuleSearchNestedStack, 'CmrGranuleSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: granulesApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'granules',
      },
      entry: '../../serverless/src/cmrGranuleSearch/handler.js',
      functionName: 'cmrGranuleSearch',
      functionNamePrefix,
      memorySize: 256
    });

    /**
     * Collection Search
     */
    const collectionSearchNestedStack = new cdk.NestedStack(scope, 'CollectionSearchNestedStack');
    new application.NodeJsFunction(collectionSearchNestedStack, 'CollectionSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: collectionsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'collections',
      },
      entry: '../../serverless/src/collectionSearch/handler.js',
      functionName: 'collectionSearch',
      functionNamePrefix,
      memorySize: 192,
    });

    /**
     * Concept Metadata
     */
    const conceptMetadataNestedStack = new cdk.NestedStack(scope, 'ConceptMetadataNestedStack');
    new application.NodeJsFunction(conceptMetadataNestedStack, 'ConceptMetadataLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        parentId: conceptsApiGatewayResource.ref,
        parentPath: 'concepts',
        path: 'metadata',
      },
      entry: '../../serverless/src/conceptMetadata/handler.js',
      functionName: 'conceptMetadata',
      functionNamePrefix,
    });

    /**
     * Decode ID
     */
    const decodeIdNestedStack = new cdk.NestedStack(scope, 'DecodeIdNestedStack');
    new application.NodeJsFunction(decodeIdNestedStack, 'DecodeIdLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'decode_id',
      },
      entry: '../../serverless/src/decodeId/handler.js',
      functionName: 'decodeId',
      functionNamePrefix,
    });

    /**
     * Get Projects
     */
    const getProjectsNestedStack = new cdk.NestedStack(scope, 'GetProjectsNestedStack');
    new application.NodeJsFunction(getProjectsNestedStack, 'GetProjectsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: projectsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'projects',
      },
      entry: '../../serverless/src/getProjects/handler.js',
      functionName: 'getProjects',
      functionNamePrefix,
    });

    /**
     * Delete Project
     */
    const deleteProjectNestedStack = new cdk.NestedStack(scope, 'DeleteProjectNestedStack');
    new application.NodeJsFunction(deleteProjectNestedStack, 'DeleteProjectLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: projectsIdApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        parentPath: 'projects',
        path: '{id}',
      },
      entry: '../../serverless/src/deleteProject/handler.js',
      functionName: 'deleteProject',
      functionNamePrefix,
    });

    /**
     * Get Retrievals
     */
    const getRetrievalsNestedStack = new cdk.NestedStack(scope, 'GetRetrievalsNestedStack');
    new application.NodeJsFunction(getRetrievalsNestedStack, 'GetRetrievalsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'retrievals',
      },
      entry: '../../serverless/src/getRetrievals/handler.js',
      functionName: 'getRetrievals',
      functionNamePrefix,
    });


    /**
     * Delete Retrieval
     */
    const deleteRetrievalNestedStack = new cdk.NestedStack(scope, 'DeleteRetrievalNestedStack');
    new application.NodeJsFunction(deleteRetrievalNestedStack, 'DeleteRetrievalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsIdApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        parentPath: 'retrievals',
        path: '{id}',
      },
      entry: '../../serverless/src/deleteRetrieval/handler.js',
      functionName: 'deleteRetrieval',
      functionNamePrefix,
    });

    /**
     * EDD Logger
     */
    const eddLoggerNestedStack = new cdk.NestedStack(scope, 'EddLoggerNestedStack');
    new application.NodeJsFunction(eddLoggerNestedStack, 'EddLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'edd_logger',
      },
      entry: '../../serverless/src/eddLogger/handler.js',
      functionName: 'eddLogger',
      functionNamePrefix,
    });

    /**
     * EDL Callback
     */
    const edlCallbackNestedStack = new cdk.NestedStack(scope, 'EdlCallbackNestedStack');
    new application.NodeJsFunction(edlCallbackNestedStack, 'EdlCallbackLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'urs_callback',
      },
      entry: '../../serverless/src/edlCallback/handler.js',
      functionName: 'edlCallback',
      functionNamePrefix,
    });

    /**
     * EDL Login
     */
    const edlLoginNestedStack = new cdk.NestedStack(scope, 'EdlLoginNestedStack');
    new application.NodeJsFunction(edlLoginNestedStack, 'EdlLoginLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'login',
      },
      entry: '../../serverless/src/edlLogin/handler.js',
      functionName: 'edlLogin',
      functionNamePrefix,
    });

    /**
     * Error Logger
     */
    const errorLoggerNestedStack = new cdk.NestedStack(scope, 'ErrorLoggerNestedStack');
    new application.NodeJsFunction(errorLoggerNestedStack, 'ErrorLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'error_logger',
      },
      entry: '../../serverless/src/errorLogger/handler.js',
      functionName: 'errorLogger',
      functionNamePrefix,
    });

    /**
     * Export Search
     */
    const exportSearchNestedStack = new cdk.NestedStack(scope, 'ExportSearchNestedStack');
    new application.NodeJsFunction(exportSearchNestedStack, 'ExportSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        parentId: collectionsApiGatewayResource?.ref,
        parentPath: 'collections',
        path: 'export',
      },
      entry: '../../serverless/src/exportSearch/handler.js',
      functionName: 'exportSearch',
      functionNamePrefix,
      memorySize: 192,
    });

    /**
     * Fix Retrieval Collection Metadata
     */
    const fixRetrievalCollectionMetadataNestedStack = new cdk.NestedStack(scope, 'FixRetrievalCollectionMetadataNestedStack');
    new application.NodeJsFunction(fixRetrievalCollectionMetadataNestedStack, 'FixRetrievalCollectionMetadataLambda', {
      ...defaultLambdaConfig,
      description: 'Fixes retrieval collection metadata that was improperly written',
      entry: '../../serverless/src/fixRetrievalCollectionMetadata/handler.js',
      functionName: 'fixRetrievalCollectionMetadata',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(15),
    });

    /**
     * Generate Color Maps
     */
    const generateColorMapsNestedStack = new cdk.NestedStack(scope, 'GenerateColorMapsNestedStack');
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
        }),
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
        }),
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
        }),
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
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * Generate GIBS Tags
     */
    const generateGibsTagsNestedStack = new cdk.NestedStack(scope, 'GenerateGibsTagsNestedStack');
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
        }),
      }],
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * Generate Notebook
     */
    const generateNotebookNestedStack = new cdk.NestedStack(scope, 'GenerateNotebookNestedStack');
    new application.NodeJsFunction(generateNotebookNestedStack, 'GenerateNotebookLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        path: 'generate_notebook',
      },
      entry: '../../serverless/src/generateNotebook/handler.js',
      functionName: 'generateNotebook',
      functionNamePrefix,
    });

    /**
     * Get Color Map
     */
    const getColorMapNestedStack = new cdk.NestedStack(scope, 'GetColorMapNestedStack');
    new application.NodeJsFunction(getColorMapNestedStack, 'GetColorMapLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        parentId: colormapsApiGatewayResource.ref,
        parentPath: 'colormaps',
        path: '{product}',
      },
      entry: '../../serverless/src/getColorMap/handler.js',
      functionName: 'getColorMap',
      functionNamePrefix,
    });

    /**
     * Get Contact Info
     */
    const getContactInfoNestedStack = new cdk.NestedStack(scope, 'GetContactInfoNestedStack');
    new application.NodeJsFunction(getContactInfoNestedStack, 'GetContactInfoLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: contactInfoApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'contact_info',
      },
      entry: '../../serverless/src/getContactInfo/handler.js',
      functionName: 'getContactInfo',
      functionNamePrefix,
    });

    /**
     * Get Project
     */
    const getProjectNestedStack = new cdk.NestedStack(scope, 'GetProjectNestedStack');
    new application.NodeJsFunction(getProjectNestedStack, 'GetProjectLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: projectsIdApiGatewayResource,
        apiGatewayRestApi,
        methods: ['GET'],
        parentPath: 'projects',
        path: '{id}',
      },
      entry: '../../serverless/src/getProject/handler.js',
      functionName: 'getProject',
      functionNamePrefix,
    });

    /**
     * Get Retrieval
     */
    const getRetrievalNestedStack = new cdk.NestedStack(scope, 'GetRetrievalNestedStack');
    new application.NodeJsFunction(getRetrievalNestedStack, 'GetRetrievalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsIdApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        parentPath: 'retrievals',
        path: '{id}',
      },
      entry: '../../serverless/src/getRetrieval/handler.js',
      functionName: 'getRetrieval',
      functionNamePrefix,
    });

    /**
     * Get Retrieval Collection
     */
    const getRetrievalCollectionNestedStack = new cdk.NestedStack(scope, 'GetRetrievalCollectionNestedStack');
    new application.NodeJsFunction(getRetrievalCollectionNestedStack, 'GetRetrievalCollectionLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        parentId: retrievalCollectionsApiGatewayResource.ref,
        parentPath: 'retrieval_collections',
        path: '{id}',
      },
      entry: '../../serverless/src/getRetrievalCollection/handler.js',
      functionName: 'getRetrievalCollection',
      functionNamePrefix,
    });

    /**
     * Get Saved Access Configs
     */
    const getSavedAccessConfigsNestedStack = new cdk.NestedStack(scope, 'GetSavedAccessConfigsNestedStack');
    new application.NodeJsFunction(getSavedAccessConfigsNestedStack, 'GetSavedAccessConfigsLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'saved_access_configs',
      },
      entry: '../../serverless/src/getSavedAccessConfigs/handler.js',
      functionName: 'getSavedAccessConfigs',
      functionNamePrefix,
    });

    /**
     * Save Shapefile
     */
    const saveShapefileNestedStack = new cdk.NestedStack(scope, 'SaveShapefileNestedStack');
    new application.NodeJsFunction(saveShapefileNestedStack, 'SaveShapefileLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: shapefilesApiGatewayResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'shapefiles',
      },
      entry: '../../serverless/src/saveShapefile/handler.js',
      functionName: 'saveShapefile',
      functionNamePrefix,
    });

    /**
     * Get Shapefile
     */
    const getShapefileNestedStack = new cdk.NestedStack(scope, 'GetShapefileNestedStack');
    new application.NodeJsFunction(getShapefileNestedStack, 'GetShapefileLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        parentId: shapefilesApiGatewayResource?.ref,
        parentPath: 'shapefiles',
        path: '{id}',
      },
      entry: '../../serverless/src/getShapefile/handler.js',
      functionName: 'getShapefile',
      functionNamePrefix,
    });

    /**
     * GraphQL
     */
    const graphQlNestedStack = new cdk.NestedStack(scope, 'GraphQlNestedStack');
    new application.NodeJsFunction(graphQlNestedStack, 'GraphQlLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        path: 'graphql',
      },
      entry: '../../serverless/src/graphQl/handler.js',
      functionName: 'graphql',
      functionNamePrefix,
    });

    /**
     * Logout
     */
    const logoutNestedStack = new cdk.NestedStack(scope, 'LogoutNestedStack');
    new application.NodeJsFunction(logoutNestedStack, 'LogoutLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['DELETE'],
        path: 'logout',
      },
      entry: '../../serverless/src/logout/handler.js',
      functionName: 'logout',
      functionNamePrefix,
    });

    /**
     * Migrate Database
     */
    const migrateDatabaseNestedStack = new cdk.NestedStack(scope, 'MigrateDatabaseNestedStack');
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
            ];
          },
          beforeInstall(): string[] {
            return []
          },
        }
      },
      entry: '../../serverless/src/migrateDatabase/handler.js',
      functionName: 'migrateDatabase',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(5),
    });
    // Run database migrations when deployment is completed
    new events.Rule(migrateDatabaseNestedStack, 'RunMigrationsRule', {
      eventPattern: {
        detailType: ['CloudFormation Stack Status Change'],
        source: ['aws.cloudformation'],
        detail: {
          'stack-id': [`${scope.stackId}`],
          'status-details': {
            'status': ['UPDATE_COMPLETE']
          }
        },
      },
      targets: [new eventsTargets.LambdaFunction(migrateDatabaseLambda)]
    });

    /**
     * OpenSearch Granule Search
     */
    const openSearchGranuleSearchNestedStack = new cdk.NestedStack(scope, 'OpenSearchGranuleSearchNestedStack');
    new application.NodeJsFunction(openSearchGranuleSearchNestedStack, 'OpenSearchGranuleSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlOptionalAuthorizer,
        methods: ['POST'],
        parentId: opensearchApiGatewayResource.ref,
        parentPath: 'opensearch',
        path: 'granules',
      },
      entry: '../../serverless/src/openSearchGranuleSearch/handler.js',
      functionName: 'openSearchGranuleSearch',
      functionNamePrefix,
    });

    /**
     * Process Color Map
     */
    const processColorMapNestedStack = new cdk.NestedStack(scope, 'ProcessColorMapNestedStack');
    new application.NodeJsFunction(processColorMapNestedStack, 'ProcessColorMapLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/processColorMap/handler.js',
      functionName: 'processColorMap',
      functionNamePrefix,
      reservedConcurrentExecutions: 25,
      sqs: {
        batchSize: 10,
        queue: queues.colorMapsProcessingQueue,
      },
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * Process Tag
     */
    const processTagNestedStack = new cdk.NestedStack(scope, 'ProcessTagNestedStack');
    new application.NodeJsFunction(processTagNestedStack, 'ProcessTagLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/processTag/handler.js',
      functionName: 'processTag',
      functionNamePrefix,
      reservedConcurrentExecutions: 25,
      sqs: {
        batchSize: 10,
        queue: queues.tagProcessingQueue,
      },
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * Region Search
     */
    const regionSearchNestedStack = new cdk.NestedStack(scope, 'RegionSearchNestedStack');
    new application.NodeJsFunction(regionSearchNestedStack, 'RegionSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        path: 'regions',
      },
      entry: '../../serverless/src/regionSearch/handler.js',
      functionName: 'regionSearch',
      functionNamePrefix,
    });

    /**
     * Relevancy Logger
     */
    const relevancyLoggerNestedStack = new cdk.NestedStack(scope, 'RelevancyLoggerNestedStack');
    new application.NodeJsFunction(relevancyLoggerNestedStack, 'RelevancyLoggerLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'relevancy_logger',
      },
      entry: '../../serverless/src/relevancyLogger/handler.js',
      functionName: 'relevancyLogger',
      functionNamePrefix,
    });

    /**
     * Replace CWIC With OpenSearch
     */
    const replaceCwicWithOpenSearchNestedStack = new cdk.NestedStack(scope, 'ReplaceCwicWithOpenSearchNestedStack');
    new application.NodeJsFunction(replaceCwicWithOpenSearchNestedStack, 'ReplaceCwicWithOpenSearchLambda', {
      ...defaultLambdaConfig,
      description: 'Replaces references of isCwic with isOpenSearch',
      entry: '../../serverless/src/replaceCwicWithOpenSearch/handler.js',
      functionName: 'replaceCwicWithOpenSearch',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(15),
    });

    /**
     * Requeue Order
     */
    const requeueOrderNestedStack = new cdk.NestedStack(scope, 'RequeueOrderNestedStack');
    new application.NodeJsFunction(requeueOrderNestedStack, 'RequeueOrderLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAdminAuthorizer,
        methods: ['POST'],
        path: 'requeue_order',
      },
      entry: '../../serverless/src/requeueOrder/handler.js',
      functionName: 'requeueOrder',
      functionNamePrefix,
    });

    /**
     * Retrieve Concept
     */
    const retrieveConceptNestedStack = new cdk.NestedStack(scope, 'RetrieveConceptNestedStack');
    new application.NodeJsFunction(retrieveConceptNestedStack, 'RetrieveConceptLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        parentId: conceptsApiGatewayResource.ref,
        parentPath: 'concepts',
        path: '{id}',
      },
      entry: '../../serverless/src/retrieveConcept/handler.js',
      functionName: 'retrieveConcept',
      functionNamePrefix,
    });

    /**
     * Retrieve Granule Links
     */
    const retrieveGranuleLinksNestedStack = new cdk.NestedStack(scope, 'RetrieveGranuleLinksNestedStack');
    new application.NodeJsFunction(retrieveGranuleLinksNestedStack, 'RetrieveGranuleLinksLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['GET'],
        path: 'granule_links',
      },
      entry: '../../serverless/src/retrieveGranuleLinks/handler.js',
      functionName: 'retrieveGranuleLinks',
      functionNamePrefix,
      memorySize: 256,
    });

    /**
     * Save Contact Info
     */
    const saveContactInfoNestedStack = new cdk.NestedStack(scope, 'SaveContactInfoNestedStack');
    new application.NodeJsFunction(saveContactInfoNestedStack, 'SaveContactInfoLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: contactInfoApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'contact_info',
      },
      entry: '../../serverless/src/saveContactInfo/handler.js',
      functionName: 'saveContactInfo',
      functionNamePrefix,
    });

    /**
     * Save Project
     */
    const saveProjectNestedStack = new cdk.NestedStack(scope, 'SaveProjectNestedStack');
    new application.NodeJsFunction(saveProjectNestedStack, 'SaveProjectLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: projectsApiGatewayResource,
        apiGatewayRestApi,
        methods: ['POST'],
        path: 'projects',
      },
      entry: '../../serverless/src/saveProject/handler.js',
      functionName: 'saveProject',
      functionNamePrefix,
    });

    /**
     * Scale Image
     */
    // Downloaded the lambda layer zip from https://github.com/pH200/sharp-layer/releases
    // Download the release-x64.zip file, rename it sharp-{release}-x64.zip and place it in the layers directory
    // The release number needs to match the version of sharp installed in package.json
    const sharpLambdaLayer = new lambda.LayerVersion(scope, 'SharpLambdaLayer', {
      code: lambda.Code.fromAsset('../../layers/sharp-0.33.5-x64.zip',),
      compatibleRuntimes: [defaultLambdaConfig.runtime],
      description: 'Sharp Lambda Layer',
    })
    const scaleImageNestedStack = new cdk.NestedStack(scope, 'ScaleImageNestedStack');
    new application.NodeJsFunction(scaleImageNestedStack, 'ScaleImageLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        methods: ['GET'],
        parentId: scaleConceptTypeApiGatewayResource.ref,
        parentPath: 'scale',
        path: '{concept_id}',
      },
      entry: '../../serverless/src/scaleImage/handler.js',
      functionName: 'scaleImage',
      functionNamePrefix,
      layers: [sharpLambdaLayer],
      memorySize: 256,
    });

    /**
     * Store User Data
     */
    const storeUserDataNestedStack = new cdk.NestedStack(scope, 'StoreUserDataNestedStack');
    new application.NodeJsFunction(storeUserDataNestedStack, 'StoreUserDataLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/storeUserData/handler.js',
      functionName: 'storeUserData',
      functionNamePrefix,
      sqs: {
        queue: queues.userDataQueue,
      },
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * Submit Retrieval
     */
    const submitRetrievalNestedStack = new cdk.NestedStack(scope, 'SubmitRetrievalNestedStack');
    new application.NodeJsFunction(submitRetrievalNestedStack, 'SubmitRetrievalLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayResource: retrievalsApiGatewayResource,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'retrievals',
      },
      entry: '../../serverless/src/submitRetrieval/handler.js',
      functionName: 'submitRetrieval',
      functionNamePrefix,
    });

    /**
     * Timeline Search
     */
    const timelineSearchNestedStack = new cdk.NestedStack(scope, 'TimelineSearchNestedStack');
    new application.NodeJsFunction(timelineSearchNestedStack, 'TimelineSearchLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        parentId: granulesApiGatewayResource?.ref,
        parentPath: 'granules',
        path: 'timeline',
      },
      entry: '../../serverless/src/timelineSearch/handler.js',
      functionName: 'timelineSearch',
      functionNamePrefix,
    });

    /**
     * Update Preferences
     */
    const updatePreferencesNestedStack = new cdk.NestedStack(scope, 'UpdatePreferencesNestedStack');
    new application.NodeJsFunction(updatePreferencesNestedStack, 'UpdatePreferencesLambda', {
      ...defaultLambdaConfig,
      api: {
        apiGatewayDeployment,
        apiGatewayRestApi,
        authorizer: authorizers.edlAuthorizer,
        methods: ['POST'],
        path: 'preferences',
      },
      entry: '../../serverless/src/updatePreferences/handler.js',
      functionName: 'updatePreferences',
      functionNamePrefix,
    });
  }
}
