import * as cdk from 'aws-cdk-lib';

export interface SqsTestStackProps extends cdk.StackProps {
  visibilityTimeout: cdk.Duration;
}

export type STAGE = 'dev' | 'stg' | 'prd';

export const propsLong: { [key in STAGE]: SqsTestStackProps } = {
  ['dev']: {
    visibilityTimeout: cdk.Duration.seconds(300)
  },
  ['stg']: {
    visibilityTimeout: cdk.Duration.seconds(200)
  },
  ['prd']: {
    visibilityTimeout: cdk.Duration.seconds(100)
  },
}

export const propsShort: { [key in STAGE]: SqsTestStackProps } = {
  ['dev']: {
    visibilityTimeout: cdk.Duration.seconds(30)
  },
  ['stg']: {
    visibilityTimeout: cdk.Duration.seconds(20)
  },
  ['prd']: {
    visibilityTimeout: cdk.Duration.seconds(10)
  },
}
