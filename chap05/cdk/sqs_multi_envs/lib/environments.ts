export type Stages = 'dev' | 'stg' | 'prd';

export interface EnvironmentProps {
  account: string;
  region: string;
}

export const environmentProps: { [key in Stages]: EnvironmentProps } = {
  ['dev']: {
    account: '111111111111',
    region: 'ap-northeast-1',
  },
  ['stg']: {
    account: '222222222222',
    region: 'ap-northeast-1',
  },
  ['prd']: {
    account: '333333333333',
    region: 'ap-northeast-1',
  },
}
