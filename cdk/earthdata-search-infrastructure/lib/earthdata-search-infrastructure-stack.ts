import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { infrastructure } from '@edsc/cdk-utils';

export interface EarthdataSearchInfrastructureStackProps extends cdk.StackProps {
}

const {
  DB_ALLOCATED_STORAGE = '20',
  DB_INSTANCE_CLASS = 'db.t3.micro',
  SUBNET_ID_A = 'local-subnet-a',
  SUBNET_ID_B = 'local-subnet-b',
  STAGE_NAME = 'dev',
  VPC_ID = 'local-vpc',
} = process.env;

/**
 * The AWS CloudFormation template for this Serverless application
 */
export class EarthdataSearchInfrastructureStack extends cdk.Stack {
  /**
   * Role used to execute commands across the serverless application
   */
  public readonly edscServerlessAppRole;

  public constructor(scope: cdk.App, id: string, props: EarthdataSearchInfrastructureStackProps = {}) {
    super(scope, id, props);

    // Resources
    const serverlessAppRole = new iam.CfnRole(this, 'ServerlessAppRole', {
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
      ],
      permissionsBoundary: [
        'arn:aws:iam::',
        this.account,
        ':policy/NGAPShRoleBoundary',
      ].join(''),
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
                'states.amazonaws.com',
                'events.amazonaws.com',
              ],
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
      policies: [
        {
          policyName: 'RDSIAMAuthentication',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'rds-db:connect',
                ],
                Resource: [
                  'arn:aws:rds-db:',
                  this.region,
                  ':',
                  this.account,
                  ':dbuser',
                  '/lambda',
                ].join(''),
              },
            ],
          },
        },
        {
          policyName: 'EDSCLambdaBase',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'sqs:*',
                ],
                Resource: '*',
              },
              {
                Effect: 'Allow',
                Action: [
                  'secretsmanager:GetSecretValue',
                ],
                Resource: '*',
              },
              {
                Effect: 'Allow',
                Action: [
                  'lambda:InvokeFunction',
                ],
                Resource: '*',
              },
              {
                Effect: 'Allow',
                Action: [
                  'states:*',
                ],
                Resource: '*',
              },
              {
                Effect: 'Allow',
                Action: [
                  's3:GetBucketLocation',
                  's3:GetObject',
                  's3:PutObject',
                ],
                Resource: '*',
              },
            ],
          },
        },
      ],
    });

    const lambdaSecurityGroup = new infrastructure.LambdaSecurityGroup(this, 'EDSCLambdaSecurityGroup', {
      appName: 'EarthdataSearch',
      groupDescriptionName: 'EDSC',
      stageName: STAGE_NAME,
      vpcId: VPC_ID
    });

    new infrastructure.Redis(this, 'EDSCRedis', {
      appName: 'EarthdataSearch',
      cacheName: `earthdata-search-${STAGE_NAME}`,
      cacheNodeType: 'cache.t2.medium',
      engineVersion: '7.0',
      stageName: STAGE_NAME,
      subnetIds: [SUBNET_ID_A, SUBNET_ID_B],
      vpcId: VPC_ID
    })

    new infrastructure.Database(this, 'EDSCDatabase', {
      allocatedStorage: DB_ALLOCATED_STORAGE,
      appName: 'EDSC',
      databaseUsername: 'edsc',
      dbInstanceClass: DB_INSTANCE_CLASS,
      dbName: `edsc_${STAGE_NAME}`,
      engineVersion: '14.10',
      lambdaSecurityGroupId: lambdaSecurityGroup.securityGroup.attrGroupId,
      logicalIdPrefix: 'Encrypted',
      stageName: STAGE_NAME,
      subnetIds: [SUBNET_ID_A, SUBNET_ID_B],
      vpcId: VPC_ID
    });

    // Outputs
    this.edscServerlessAppRole = serverlessAppRole.attrArn;
    new cdk.CfnOutput(this, 'CfnOutputEDSCServerlessAppRole', {
      key: 'EDSCServerlessAppRole',
      description: 'Role used to execute commands across the serverless application',
      exportName: `${STAGE_NAME}-EDSCServerlessAppRole`,
      value: this.edscServerlessAppRole!.toString(),
    });
  }
}
