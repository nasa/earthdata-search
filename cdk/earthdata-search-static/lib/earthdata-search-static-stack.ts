import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { staticAssets } from '@edsc/cdk-utils'

const {
  SITE_BUCKET = 'mock-bucket'
} = process.env

export class EarthdataSearchStaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new staticAssets.S3Site(this, 'EarthdataSearchSite', {
      destinationBucketName: SITE_BUCKET,
      sourceFolder: '../../static/dist'
    })
  }
}
