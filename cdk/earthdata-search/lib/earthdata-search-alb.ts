import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cr from 'aws-cdk-lib/custom-resources'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets'
import { Construct } from 'constructs'
import { Stack } from 'aws-cdk-lib/core'

export interface ALBProps {
  /** The API Gateway Rest API resource */
  apiGatewayRestApi: apigateway.CfnRestApi;
  /** The CDK stack */
  stack: Stack;
  /** The stage name */
  stageName: string;
  /** The VPC */
  vpc: ec2.IVpc;
  /** The VPC endpoint ID */
  vpcEndpointId: string;
}

export class ALB extends Construct {
  constructor(scope: Construct, id: string, props: ALBProps) {
    super(scope, id)

    const {
      apiGatewayRestApi,
      stack,
      stageName,
      vpc,
      vpcEndpointId
    } = props

    // Create the target group for the API Gateway VPC Endpoint
    const vpceTargetGroup = new elbv2.ApplicationTargetGroup(this, 'ApiGwTargetGroup', {
      healthCheck: {
        healthyHttpCodes: '200-499',
        protocol: elbv2.Protocol.HTTPS,
        enabled: true
      },
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      targetType: elbv2.TargetType.IP,
      vpc
    })

    // Create the security group for the ALB
    const streamingSecurityGroup = new ec2.SecurityGroup(scope, 'StreamingSecurityGroup', {
      vpc,
      allowAllOutbound: true,
      description: 'Security group for the streaming load balancer',
      securityGroupName: `${stack.stackName}-StreamingSecurityGroup`
    })

    streamingSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic from anywhere')
    streamingSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(80), 'Allow HTTP traffic from anywhere')
    streamingSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic from anywhere')
    streamingSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(443), 'Allow HTTPS traffic from anywhere')

    // Create the ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, 'StreamingAlb', {
      internetFacing: false,
      vpc,
      securityGroup: streamingSecurityGroup
    })

    // Create the listener for the ALB
    const listener = alb.addListener('HttpListener', {
      port: 80,
      open: true,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Not Found'
      })
    })

    // This is a custom resource that will call the EC2 API to get the IP addresses of the VPC endpoint for API Gateway. This is necessary because the VPC endpoint is created outside of this stack, and we need to know its IPs to add them to the target group for the ALB.
    const getIpsConfig = {
      service: 'EC2',
      action: 'describeNetworkInterfaces',
      parameters: {
        Filters: [
          {
            Name: 'description',
            Values: [`*${vpcEndpointId}*`]
          }
        ]
      },
      outputPaths: [
        'NetworkInterfaces.0.PrivateIpAddress',
        'NetworkInterfaces.1.PrivateIpAddress',
        'NetworkInterfaces.2.PrivateIpAddress'
      ],
      physicalResourceId: cr.PhysicalResourceId.of(`GetIp-${vpcEndpointId}`)
    }
    const getVpceIps = new cr.AwsCustomResource(this, 'GetVpceIps', {
      onCreate: getIpsConfig,
      onUpdate: getIpsConfig,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
      })
    })

    // Get the IPs from the output of the custom resource
    const ip1 = getVpceIps.getResponseField('NetworkInterfaces.0.PrivateIpAddress')
    const ip2 = getVpceIps.getResponseField('NetworkInterfaces.1.PrivateIpAddress')
    const ip3 = getVpceIps.getResponseField('NetworkInterfaces.2.PrivateIpAddress')

    // Add the IPs to the target group
    vpceTargetGroup.addTarget(new targets.IpTarget(ip1))
    vpceTargetGroup.addTarget(new targets.IpTarget(ip2))
    vpceTargetGroup.addTarget(new targets.IpTarget(ip3))

    // eslint-disable-next-line no-new
    new elbv2.CfnListenerRule(scope, 'StreamingRule', {
      listenerArn: listener.listenerArn,
      priority: 100,
      conditions: [
        {
          field: 'path-pattern',
          pathPatternConfig: {
            // Only match routes that start with /nlp
            values: ['/nlp']
          }
        }
      ],
      actions: [
        {
          type: 'forward',
          targetGroupArn: vpceTargetGroup.targetGroupArn
        }
      ],
      transforms: [
        {
          type: 'host-header-rewrite',
          hostHeaderRewriteConfig: {
            // Replace the host header with the API Gateway endpoint for the current stage
            rewrites: [{
              regex: '^.*$',
              replace: `${apiGatewayRestApi.attrRestApiId}.execute-api.${stack.region}.${stack.urlSuffix}`
            }]
          }
        },
        {
          type: 'url-rewrite',
          urlRewriteConfig: {
            // Rewrite the path to include the stage name for the current stage. This allows the frontend to call /nlp and the ALB will rewrite it to /<stage>/nlp to match the API Gateway.
            rewrites: [{
              regex: '^/nlp(.*)$',
              replace: `/${stageName}/nlp$1`
            }]
          }
        }
      ]
    })
  }
}
