import * as budgets from 'aws-cdk-lib/aws-budgets'
import * as cdk from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import { Construct } from 'constructs'

import { application } from '@edsc/cdk-utils'

export interface BedrockBudgetProps {
  /** Monthly budget limit in USD */
  budgetLimit: number;
  /** Default Lambda config options */
  defaultLambdaConfig: application.NodeJsFunctionProps;
  /** Name of the SSM parameter indicating whether NLP search should be disabled */
  nlpSearchDisabledParameterName: string;
  /** The stage name (dev/sit/etc) */
  stageName: string;
}

/**
 * Monthly AWS Budget for the Amazon Bedrock service.
 *
 * - 80% of actual spend: publishes to the notification SNS topic
 * - 100% of forecasted spend: publishes to the notification SNS topic
 * - 99% of actual spend: publishes to the disable SNS topic, which triggers a lambda
 *   that sets an SSM parameter indicating the NLP search feature should be disabled
 * - When the budget resets at the start of each month, a scheduled lambda re-enables NLP search
 *
 * Email subscriptions to the notification topic are intentionally not managed by CDK.
 * They are added/removed manually in the SNS console so they can be changed without a deployment.
 */
export class BedrockBudget extends Construct {
  /** SSM Parameter indicating whether NLP search should be disabled */
  public readonly nlpSearchDisabledParameter: ssm.StringParameter

  /** SNS topic that receives the budget email notifications */
  public readonly notificationTopic: sns.Topic

  constructor(scope: cdk.Stack, id: string, props: BedrockBudgetProps) {
    super(scope, id)

    const {
      budgetLimit,
      defaultLambdaConfig,
      nlpSearchDisabledParameterName,
      stageName
    } = props

    const functionNamePrefix = scope.stackName

    const bedrockBudgetNestedStack = new cdk.NestedStack(scope, 'BedrockBudgetNestedStack')
    const { account } = cdk.Stack.of(bedrockBudgetNestedStack)

    // Allows AWS Budgets to publish to the provided topic
    const allowBudgetsToPublish = (topic: sns.Topic) => {
      const { policyDependable } = topic.addToResourcePolicy(
        new iam.PolicyStatement({
          actions: ['SNS:Publish'],
          conditions: {
            StringEquals: {
              'aws:SourceAccount': account
            },
            ArnLike: {
              'aws:SourceArn': `arn:${cdk.Aws.PARTITION}:budgets::${account}:*`
            }
          },
          principals: [new iam.ServicePrincipal('budgets.amazonaws.com')],
          resources: [topic.topicArn]
        })
      )

      return policyDependable
    }

    this.nlpSearchDisabledParameter = new ssm.StringParameter(bedrockBudgetNestedStack, 'NlpSearchDisabledParameter', {
      description: 'Set to "true" when the Bedrock budget has been reached and NLP search should be disabled',
      parameterName: nlpSearchDisabledParameterName,
      stringValue: 'false'
    })

    // SNS topic for the budget email notifications. Email subscriptions are managed
    // manually in the AWS console and are not part of this stack
    this.notificationTopic = new sns.Topic(bedrockBudgetNestedStack, 'BedrockBudgetNotificationTopic', {
      displayName: `Earthdata Search ${stageName} Bedrock budget notifications`,
      topicName: `earthdata-search-${stageName}-bedrock-budget-notifications`
    })

    const notificationTopicPolicy = allowBudgetsToPublish(this.notificationTopic)

    // SNS topic the budget publishes to when the actual spend threshold is reached
    const budgetTopic = new sns.Topic(bedrockBudgetNestedStack, 'BedrockBudgetTopic', {
      displayName: `Earthdata Search ${stageName} Bedrock budget`,
      topicName: `earthdata-search-${stageName}-bedrock-budget`
    })

    const budgetTopicPolicy = allowBudgetsToPublish(budgetTopic)

    // Disables NLP search when triggered by the budget SNS topic, and re-enables NLP search
    // when triggered by the monthly schedule
    const { lambdaFunction: setNlpSearchStatusLambda } = new application.NodeJsFunction(bedrockBudgetNestedStack, 'SetNlpSearchStatusLambda', {
      ...defaultLambdaConfig,
      description: 'Disables NLP search when the Bedrock budget is reached, and re-enables it when the budget resets',
      entry: '../../serverless/src/setNlpSearchStatus/handler.js',
      functionName: 'setNlpSearchStatus',
      functionNamePrefix,
      schedules: [{
        enabled: true,
        input: {
          action: 'enable'
        },
        // AWS Budgets reset monthly budgets at 00:00 UTC on the 1st, EventBridge cron schedules are in UTC
        schedule: events.Schedule.cron({
          day: '1',
          hour: '0',
          minute: '5',
          month: '*',
          year: '*'
        })
      }]
    })

    // The parameter name is provided to all lambdas via NLP_SEARCH_DISABLED_PARAMETER_NAME in the
    // default environment. Permission to read/write the parameter is granted to the shared
    // application role in the earthdata-search-infrastructure stack

    budgetTopic.addSubscription(new snsSubscriptions.LambdaSubscription(setNlpSearchStatusLambda))

    const notificationTopicSubscribers = [{
      address: this.notificationTopic.topicArn,
      subscriptionType: 'SNS'
    }]

    const budget = new budgets.CfnBudget(bedrockBudgetNestedStack, 'BedrockBudget', {
      budget: {
        budgetLimit: {
          amount: budgetLimit,
          unit: 'USD'
        },
        budgetName: `earthdata-search-${stageName}-bedrock`,
        budgetType: 'COST',
        costFilters: {
          Service: ['Amazon Bedrock']
        },
        timeUnit: 'MONTHLY'
      },
      notificationsWithSubscribers: [
        {
          notification: {
            comparisonOperator: 'GREATER_THAN',
            notificationType: 'ACTUAL',
            threshold: 80,
            thresholdType: 'PERCENTAGE'
          },
          subscribers: notificationTopicSubscribers
        },
        {
          notification: {
            comparisonOperator: 'GREATER_THAN',
            notificationType: 'FORECASTED',
            threshold: 100,
            thresholdType: 'PERCENTAGE'
          },
          subscribers: notificationTopicSubscribers
        },
        {
          notification: {
            comparisonOperator: 'GREATER_THAN',
            notificationType: 'ACTUAL',
            threshold: 99,
            thresholdType: 'PERCENTAGE'
          },
          subscribers: [{
            address: budgetTopic.topicArn,
            subscriptionType: 'SNS'
          }]
        }
      ]
    })

    // AWS Budgets validates it can publish to the topics when the budget is created
    if (notificationTopicPolicy) budget.node.addDependency(notificationTopicPolicy)
    if (budgetTopicPolicy) budget.node.addDependency(budgetTopicPolicy)
  }
}
