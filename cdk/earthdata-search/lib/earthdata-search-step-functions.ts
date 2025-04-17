import * as cdk from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets'
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions'

import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface StepFunctionsProps {
  /** Default Lambda config options */
  defaultLambdaConfig: application.NodeJsFunctionProps;
  /** Optional: Used to rename log groups during the migration to CDK */
  logGroupSuffix: string;
  /** The time in milliseconds to wait between checking the status of an order */
  orderStatusRefreshTime: number;
  /** The Role for the step function */
  role: cdk.aws_iam.IRole;
  /** The stage name (dev/sit/etc) */
  stageName: string;
  /** SQS Queues that trigger lambda functions */
  queues: {
    /** The SQS queue for processing catalog rest orders */
    catalogRestOrderQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing CMR orders */
    cmrOrderingOrderQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing color maps */
    colorMapsProcessingQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing harmony orders */
    harmonyOrderQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing swodlr orders */
    swodlrOrderQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing tags */
    tagProcessingQueue: cdk.aws_sqs.IQueue;
    /** The SQS queue for processing user data */
    userDataQueue: cdk.aws_sqs.IQueue;
  };
}

export class StepFunctions extends Construct {
  constructor(scope: cdk.Stack, id: string, props: StepFunctionsProps) {
    super(scope, id)

    const {
      defaultLambdaConfig,
      logGroupSuffix,
      orderStatusRefreshTime,
      role,
      stageName,
      queues
    } = props

    const functionNamePrefix = scope.stackName

    /**
     * Fetch Catalog Rest Order
     */
    const fetchCatalogRestOrderNestedStack = new cdk.NestedStack(scope, 'FetchCatalogRestOrderNestedStack')
    const { lambdaFunction: fetchCatalogRestOrderLambda } = new application.NodeJsFunction(fetchCatalogRestOrderNestedStack, 'FetchCatalogRestOrderLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/fetchCatalogRestOrder/handler.js',
      functionName: 'fetchCatalogRestOrder',
      functionNamePrefix
    })

    /**
     * Fetch CMR Ordering Order
     */
    const fetchCmrOrderingOrderNestedStack = new cdk.NestedStack(scope, 'FetchCmrOrderingOrderNestedStack')
    const { lambdaFunction: fetchCmrOrderingOrderLambda } = new application.NodeJsFunction(fetchCmrOrderingOrderNestedStack, 'FetchCmrOrderingOrderLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/fetchCmrOrderingOrder/handler.js',
      functionName: 'fetchCmrOrderingOrder',
      functionNamePrefix
    })

    /**
     * Fetch Harmony Order
     */
    const fetchHarmonyOrderNestedStack = new cdk.NestedStack(scope, 'FetchHarmonyOrderNestedStack')
    const { lambdaFunction: fetchHarmonyOrderLambda } = new application.NodeJsFunction(fetchHarmonyOrderNestedStack, 'FetchHarmonyOrderLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/fetchHarmonyOrder/handler.js',
      functionName: 'fetchHarmonyOrder',
      functionNamePrefix
    })

    /**
     * Fetch SWODLR Order
     */
    const fetchSwodlrOrderNestedStack = new cdk.NestedStack(scope, 'FetchSwodlrOrderNestedStack')
    const { lambdaFunction: fetchSwodlrOrderLambda } = new application.NodeJsFunction(fetchSwodlrOrderNestedStack, 'FetchSwodlrOrderLambda', {
      ...defaultLambdaConfig,
      entry: '../../serverless/src/fetchSwodlrOrder/handler.js',
      functionName: 'fetchSwodlrOrder',
      functionNamePrefix
    })

    /**
     * Update Order Status
     */
    const updateOrderStatusStateMachine = new stepfunctions.StateMachine(scope, 'UpdateOrderStatus', {
      stateMachineName: `UpdateOrderStatusWorkflow-${stageName}${logGroupSuffix}`,
      role,
      definitionBody: stepfunctions.DefinitionBody.fromString(JSON.stringify({
        Comment: 'Update Order Status',
        StartAt: 'InitialWait',
        States: {
          InitialWait: {
            Type: 'Wait',
            Seconds: 10,
            Next: 'DetermineOrderType'
          },
          DetermineOrderType: {
            Type: 'Choice',
            Choices: [{
              Variable: '$.orderType',
              StringEquals: 'ESI',
              Next: 'FetchCatalogRestOrderStatus'
            }, {
              Variable: '$.orderType',
              StringEquals: 'ECHO ORDERS',
              Next: 'FetchCmrOrderingOrderStatus'
            }, {
              Variable: '$.orderType',
              StringEquals: 'Harmony',
              Next: 'FetchHarmonyOrderStatus'
            }, {
              Variable: '$.orderType',
              StringEquals: 'SWODLR',
              Next: 'FetchSwodlrOrderStatus'
            }]
          },
          FetchCatalogRestOrderStatus: {
            Type: 'Task',
            Resource: fetchCatalogRestOrderLambda.functionArn,
            Next: 'CheckOrderStatus'
          },
          FetchCmrOrderingOrderStatus: {
            Type: 'Task',
            Resource: fetchCmrOrderingOrderLambda.functionArn,
            Next: 'CheckOrderStatus'
          },
          FetchHarmonyOrderStatus: {
            Type: 'Task',
            Resource: fetchHarmonyOrderLambda.functionArn,
            Next: 'CheckOrderStatus'
          },
          FetchSwodlrOrderStatus: {
            Type: 'Task',
            Resource: fetchSwodlrOrderLambda.functionArn,
            Next: 'CheckOrderStatus'
          },
          CheckOrderStatus: {
            Type: 'Choice',
            Choices: [{
              Variable: '$.orderStatus',
              StringEquals: 'creating',
              Next: 'WaitForRetry'
            }, {
              Variable: '$.orderStatus',
              StringEquals: 'complete',
              Next: 'OrderComplete'
            }, {
              Variable: '$.orderStatus',
              StringEquals: 'failed',
              Next: 'OrderFailed'
            }, {
              Variable: '$.orderStatus',
              StringEquals: 'in_progress',
              Next: 'WaitForRetry'
            }],
            Default: 'OrderFailed'
          },
          WaitForRetry: {
            Type: 'Wait',
            Seconds: orderStatusRefreshTime / 1000,
            Next: 'DetermineOrderType'
          },
          OrderComplete: {
            Type: 'Succeed'
          },
          OrderFailed: {
            Type: 'Fail'
          }
        }
      }))
    })

    /**
     * Submit Catalog Rest Order
     */
    const submitCatalogRestOrderNestedStack = new cdk.NestedStack(scope, 'SubmitCatalogRestOrderNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(submitCatalogRestOrderNestedStack, 'SubmitCatalogRestOrderLambda', {
      ...defaultLambdaConfig,
      environment: {
        ...defaultLambdaConfig.environment,
        UPDATE_ORDER_STATUS_STATE_MACHINE_ARN: updateOrderStatusStateMachine.stateMachineArn
      },
      entry: '../../serverless/src/submitCatalogRestOrder/handler.js',
      functionName: 'submitCatalogRestOrder',
      functionNamePrefix,
      memorySize: 192,
      sqs: {
        queue: queues.catalogRestOrderQueue
      },
      timeout: cdk.Duration.minutes(10)
    })

    /**
     * Submit CMR Ordering Order
     */
    const submitCmrOrderingOrderNestedStack = new cdk.NestedStack(scope, 'SubmitCmrOrderingOrderNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(submitCmrOrderingOrderNestedStack, 'SubmitCmrOrderingOrderLambda', {
      ...defaultLambdaConfig,
      environment: {
        ...defaultLambdaConfig.environment,
        UPDATE_ORDER_STATUS_STATE_MACHINE_ARN: updateOrderStatusStateMachine.stateMachineArn
      },
      entry: '../../serverless/src/submitCmrOrderingOrder/handler.js',
      functionName: 'submitCmrOrderingOrder',
      functionNamePrefix,
      sqs: {
        queue: queues.cmrOrderingOrderQueue
      },
      timeout: cdk.Duration.minutes(10)
    })

    /**
     * Submit Harmony Order
     */
    const submitHarmonyOrderNestedStack = new cdk.NestedStack(scope, 'SubmitHarmonyOrderNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(submitHarmonyOrderNestedStack, 'SubmitHarmonyOrderLambda', {
      ...defaultLambdaConfig,
      environment: {
        ...defaultLambdaConfig.environment,
        UPDATE_ORDER_STATUS_STATE_MACHINE_ARN: updateOrderStatusStateMachine.stateMachineArn
      },
      entry: '../../serverless/src/submitHarmonyOrder/handler.js',
      functionName: 'submitHarmonyOrder',
      functionNamePrefix,
      memorySize: 256,
      sqs: {
        queue: queues.harmonyOrderQueue
      },
      timeout: cdk.Duration.minutes(10)
    })

    /**
     * Submit SWODLR Order
     */
    const submitSwodlrOrderNestedStack = new cdk.NestedStack(scope, 'SubmitSwodlrOrderNestedStack')
    // eslint-disable-next-line no-new
    new application.NodeJsFunction(submitSwodlrOrderNestedStack, 'SubmitSwodlrOrderLambda', {
      ...defaultLambdaConfig,
      environment: {
        ...defaultLambdaConfig.environment,
        UPDATE_ORDER_STATUS_STATE_MACHINE_ARN: updateOrderStatusStateMachine.stateMachineArn
      },
      entry: '../../serverless/src/submitSwodlrOrder/handler.js',
      functionName: 'submitSwodlrOrder',
      functionNamePrefix,
      sqs: {
        queue: queues.swodlrOrderQueue
      },
      timeout: cdk.Duration.minutes(10)
    })

    /**
     * Generate Collection Capability Tags
     */
    const generateCollectionCapabilityTagsNestedStack = new cdk.NestedStack(scope, 'GenerateCollectionCapabilityTagsNestedStack')
    const { lambdaFunction: generateCollectionCapabilityTagsLambda } = new application.NodeJsFunction(generateCollectionCapabilityTagsNestedStack, 'GenerateCollectionCapabilityTagsLambda', {
      ...defaultLambdaConfig,
      description: 'Iterate over all CMR collections adding tags specific to EDSC',
      entry: '../../serverless/src/generateCollectionCapabilityTags/handler.js',
      functionName: 'generateCollectionCapabilityTags',
      functionNamePrefix,
      timeout: cdk.Duration.minutes(15)
    })

    /**
     * Generate Collection Capability Tags
     */
    const generateCollectionCapabilityStateMachine = new stepfunctions.StateMachine(generateCollectionCapabilityTagsNestedStack, 'GenerateCollectionCapabilityTags', {
      stateMachineName: `GenerateCollectionCapabilityTags-${stageName}${logGroupSuffix}`,
      role,
      definitionBody: stepfunctions.DefinitionBody.fromString(JSON.stringify({
        Comment: 'Generate Collection Capability Tags',
        StartAt: 'ProcessCollectionPage',
        States: {
          ProcessCollectionPage: {
            Type: 'Task',
            Resource: generateCollectionCapabilityTagsLambda.functionArn,
            Next: 'CheckMoreCollections'
          },
          CheckMoreCollections: {
            Type: 'Choice',
            Choices: [{
              Variable: '$.hasMoreCollections',
              BooleanEquals: true,
              Next: 'ProcessCollectionPage'
            }],
            Default: 'TaggingComplete'
          },
          TaggingComplete: {
            Type: 'Succeed'
          }
        }
      }))
    })

    // Schedule the GenerateCollectionCapabilityTags state machine
    // eslint-disable-next-line no-new
    new events.Rule(generateCollectionCapabilityTagsNestedStack, 'GenerateCollectionCapabilityTagsSchedule', {
      schedule: events.Schedule.cron({
        hour: '12,18',
        minute: '20',
        month: '*',
        weekDay: 'MON-FRI',
        year: '*'
      }),
      targets: [
        new eventsTargets.SfnStateMachine(generateCollectionCapabilityStateMachine)
      ]
    })
  }
}
