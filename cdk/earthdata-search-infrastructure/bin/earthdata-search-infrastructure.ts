#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EarthdataSearchInfrastructureStack } from '../lib/earthdata-search-infrastructure-stack';

const {
  AWS_ACCOUNT = '1234567890',
  AWS_REGION = 'us-east-1',
  STAGE_NAME = 'dev',
} = process.env;
const app = new cdk.App();
new EarthdataSearchInfrastructureStack(app, `earthdata-search-infrastructure-${STAGE_NAME}`, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: AWS_ACCOUNT, region: AWS_REGION },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
