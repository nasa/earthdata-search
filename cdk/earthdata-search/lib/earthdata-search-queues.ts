import * as cdk from 'aws-cdk-lib'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

export interface QueuesProps {
  /** Optional: Used to rename queues during the migration to CDK */
  queueNameSuffix?: string;
}

export class Queues extends Construct {
  public readonly catalogRestOrderQueue: sqs.Queue

  public readonly cmrOrderingOrderQueue: sqs.Queue

  public readonly colorMapsProcessingQueue: sqs.Queue

  public readonly harmonyOrderQueue: sqs.Queue

  public readonly swodlrOrderQueue: sqs.Queue

  public readonly tagProcessingQueue: sqs.Queue

  public readonly userDataQueue: sqs.Queue

  constructor(scope: cdk.Stack, id: string, props: QueuesProps = {}) {
    super(scope, id)

    const {
      queueNameSuffix = ''
    } = props

    // CatalogRestOrderQueue
    const catalogRestOrderDeadLetterQueue = new sqs.Queue(scope, 'CatalogRestOrderDeadLetterQueue', {
      queueName: `${scope.stackName}-CatalogRestOrderDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const catalogRestOrderQueue = new sqs.Queue(scope, 'CatalogRestOrderQueue', {
      queueName: `${scope.stackName}-CatalogRestOrderQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(600),
      deadLetterQueue: {
        queue: catalogRestOrderDeadLetterQueue,
        maxReceiveCount: 2
      }
    })
    this.catalogRestOrderQueue = catalogRestOrderQueue

    // CmrOrderingOrderQueue
    const cmrOrderingOrderDeadLetterQueue = new sqs.Queue(scope, 'CmrOrderingOrderDeadLetterQueue', {
      queueName: `${scope.stackName}-CmrOrderingOrderDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const cmrOrderingOrderQueue = new sqs.Queue(scope, 'CmrOrderingOrderQueue', {
      queueName: `${scope.stackName}-CmrOrderingOrderQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(600),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: cmrOrderingOrderDeadLetterQueue
      }
    })
    this.cmrOrderingOrderQueue = cmrOrderingOrderQueue

    // ColorMapsProcessingQueue
    const colorMapsProcessingQueue = new sqs.Queue(scope, 'ColorMapsProcessingQueue', {
      queueName: `${scope.stackName}-ColorMapsProcessingQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(300),
      receiveMessageWaitTime: cdk.Duration.seconds(20)
    })
    this.colorMapsProcessingQueue = colorMapsProcessingQueue

    // HarmonyOrderQueue
    const harmonyOrderDeadLetterQueue = new sqs.Queue(scope, 'HarmonyOrderDeadLetterQueue', {
      queueName: `${scope.stackName}-HarmonyOrderDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const harmonyOrderQueue = new sqs.Queue(scope, 'HarmonyOrderQueue', {
      queueName: `${scope.stackName}-HarmonyOrderQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(600),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: harmonyOrderDeadLetterQueue
      }
    })
    this.harmonyOrderQueue = harmonyOrderQueue

    // SwodlrOrderQueue
    const swodlrOrderDeadLetterQueue = new sqs.Queue(scope, 'SwodlrOrderDeadLetterQueue', {
      queueName: `${scope.stackName}-SwodlrOrderDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const swodlrOrderQueue = new sqs.Queue(scope, 'SwodlrOrderQueue', {
      queueName: `${scope.stackName}-SwodlrOrderQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(600),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: swodlrOrderDeadLetterQueue
      }
    })
    this.swodlrOrderQueue = swodlrOrderQueue

    // TagProcessingQueue
    const tagProcessingDeadLetterQueue = new sqs.Queue(scope, 'TagProcessingDeadLetterQueue', {
      queueName: `${scope.stackName}-TagProcessingDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const tagProcessingQueue = new sqs.Queue(scope, 'TagProcessingQueue', {
      queueName: `${scope.stackName}-TagProcessingQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(300),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: tagProcessingDeadLetterQueue
      }
    })
    this.tagProcessingQueue = tagProcessingQueue

    // UserDataQueue
    const userDataQueueDeadLetterQueue = new sqs.Queue(scope, 'UserDataQueueDeadLetterQueue', {
      queueName: `${scope.stackName}-UserDataQueueDeadLetterQueue${queueNameSuffix}`,
      retentionPeriod: cdk.Duration.days(14)
    })
    const userDataQueue = new sqs.Queue(scope, 'UserDataQueue', {
      queueName: `${scope.stackName}-UserDataQueue${queueNameSuffix}`,
      visibilityTimeout: cdk.Duration.seconds(300),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: userDataQueueDeadLetterQueue
      }
    })
    this.userDataQueue = userDataQueue
  }
}
