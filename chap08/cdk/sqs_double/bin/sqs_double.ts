#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsDoubleStack } from '../lib/sqs_double-stack';

const app = new cdk.App();
new SqsDoubleStack(app, 'SqsDoubleStack', {});
