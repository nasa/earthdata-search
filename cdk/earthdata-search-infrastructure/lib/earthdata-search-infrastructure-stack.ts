import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { RemovalPolicy } from 'aws-cdk-lib'

import { infrastructure } from '@edsc/cdk-utils'

export interface EarthdataSearchInfrastructureStackProps extends cdk.StackProps {
}

const {
  DB_ALLOCATED_STORAGE = '20',
  DB_INSTANCE_CLASS = 'db.t3.micro',
  EDSC_HOST = 'http://localhost:8080',
  NLP_SHORT_NAME_FILE_BUCKET_NAME = 'earthdata-search-dev-nlp-short-name-file',
  SHAPEFILE_UPLOAD_BUCKET_NAME = 'earthdata-search-dev-shapefile-upload',
  SUBNET_ID_A = 'local-subnet-a',
  SUBNET_ID_B = 'local-subnet-b',
  STAGE_NAME = 'dev',
  VPC_ID = 'local-vpc'
} = process.env

/**
 * The AWS CloudFormation template for this Serverless application
 */
export class EarthdataSearchInfrastructureStack extends cdk.Stack {
  /**
   * Role used to execute commands across the serverless application
   */
  public readonly edscServerlessAppRole

  public constructor(
    scope: cdk.App,
    id: string,
    props: EarthdataSearchInfrastructureStackProps = {}
  ) {
    super(scope, id, props)

    // Resources
    const serverlessAppRole = new iam.CfnRole(this, 'ServerlessAppRole', {
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
      ],
      permissionsBoundary: [
        'arn:aws:iam::',
        this.account,
        ':policy/NGAPShRoleBoundary'
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
                'events.amazonaws.com'
              ]
            },
            Action: 'sts:AssumeRole'
          }
        ]
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
                  'rds-db:connect'
                ],
                Resource: [
                  'arn:aws:rds-db:',
                  this.region,
                  ':',
                  this.account,
                  ':dbuser',
                  '/lambda'
                ].join('')
              }
            ]
          }
        },
        {
          policyName: 'EDSCLambdaBase',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'sqs:*'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'secretsmanager:GetSecretValue'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'lambda:InvokeFunction'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'states:*'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  's3:GetBucketLocation',
                  's3:GetObject',
                  's3:PutObject'
                ],
                Resource: '*'
              },
              {
                // Allows `convertShapefile` to remove uploaded shapefiles after they are converted
                Effect: 'Allow',
                Action: [
                  's3:DeleteObject'
                ],
                Resource: `arn:aws:s3:::${SHAPEFILE_UPLOAD_BUCKET_NAME}/*`
              },
              {
                Effect: 'Allow',
                Action: [
                  'bedrock:InvokeModelWithResponseStream',
                  'bedrock:InvokeModel'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'es:ESHttpPost'
                ],
                Resource: '*'
              },
              {
                Effect: 'Allow',
                Action: [
                  'firehose:PutRecord'
                ],
                Resource: '*'
              },
              {
                // Allows the setNlpSearchStatus lambda to disable NLP search when the Bedrock budget is reached
                // and re-enable it when the budget resets, and the nlpSearch lambda to check the flag before
                // calling Bedrock
                Effect: 'Allow',
                Action: [
                  'ssm:GetParameter',
                  'ssm:PutParameter'
                ],
                Resource: [
                  'arn:aws:ssm:',
                  this.region,
                  ':',
                  this.account,
                  `:parameter/earthdata-search/${STAGE_NAME}/nlp-search-disabled`
                ].join('')
              }
            ]
          }
        }
      ]
    })

    const lambdaSecurityGroup = new infrastructure.LambdaSecurityGroup(this, 'EDSCLambdaSecurityGroup', {
      appName: 'EarthdataSearch',
      groupDescriptionName: 'EDSC',
      stageName: STAGE_NAME,
      vpcId: VPC_ID
    })

    // eslint-disable-next-line no-new
    new infrastructure.Valkey(this, 'EDSCValkey', {
      appName: 'EarthdataSearch',
      cacheName: `earthdata-search-${STAGE_NAME}-valkey`,
      cacheNodeType: 'cache.t2.medium',
      cacheParameterGroupFamily: 'valkey9',
      engine: 'valkey',
      engineVersion: '9.0',
      stageName: STAGE_NAME,
      subnetIds: [SUBNET_ID_A, SUBNET_ID_B],
      vpcId: VPC_ID
    })

    // eslint-disable-next-line no-new
    new infrastructure.Database(this, 'EDSCDatabase', {
      allocatedStorage: DB_ALLOCATED_STORAGE,
      allowMajorVersionUpgrade: true,
      appName: 'EDSC',
      databaseUsername: 'edsc',
      dbInstanceClass: DB_INSTANCE_CLASS,
      dbName: `edsc_${STAGE_NAME}`,
      engineVersion: '18.4',
      lambdaSecurityGroupId: lambdaSecurityGroup.securityGroup.attrGroupId,
      logicalIdPrefix: 'Encrypted',
      stageName: STAGE_NAME,
      subnetIds: [SUBNET_ID_A, SUBNET_ID_B],
      vpcId: VPC_ID
    })

    // S3 bucket for storing NLP short name file
    // eslint-disable-next-line no-new
    new s3.Bucket(this, 'EDSCShortNameFileBucket', {
      bucketName: NLP_SHORT_NAME_FILE_BUCKET_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY
    })

    // S3 bucket for storing shapefiles to be converted
    // eslint-disable-next-line no-new
    new s3.Bucket(this, 'EDSCS3ShapefileBucket', {
      bucketName: SHAPEFILE_UPLOAD_BUCKET_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // The browser uploads directly to the bucket using a presigned URL from `getShapefileUploadUrl`
      cors: [{
        allowedHeaders: ['*'],
        allowedMethods: [s3.HttpMethods.PUT],
        allowedOrigins: [EDSC_HOST],
        maxAge: 3000
      }],
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [{
        // `convertShapefile` deletes files after a successful conversion, this cleans up
        // any uploads that were abandoned or failed to convert
        id: 'ExpireUnconvertedShapefiles',
        enabled: true,
        expiration: cdk.Duration.days(1)
      }],
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Outputs
    this.edscServerlessAppRole = serverlessAppRole.attrArn
    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, 'CfnOutputEDSCServerlessAppRole', {
      key: 'EDSCServerlessAppRole',
      description: 'Role used to execute commands across the serverless application',
      exportName: `${STAGE_NAME}-EDSCServerlessAppRole`,
      value: this.edscServerlessAppRole!.toString()
    })
  }
}
