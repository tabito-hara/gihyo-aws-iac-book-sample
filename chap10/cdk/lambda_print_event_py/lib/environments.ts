export type Stages = 'dev';

export interface EnvironmentProps {
  account: string;
}

export const environmentProps: {[key in Stages]: EnvironmentProps} = {
  'dev': {
    account: '123456789012',
  }
}
