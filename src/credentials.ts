export enum AuthCred {
  REGION = 'us-east-1',
  DOMAIN = 'https://koyo-dev-test.auth.us-east-1.amazoncognito.com',
  RESPONSETYPE = 'code',
  FEDERATIONTARGET = 'COGNITO_USER_POOLS',
}

type ScopeType =
  | 'email'
  | 'openid'
  | 'profile'
  | 'aws.cognito.signin.user.admin'
  | 'phone';

export const scope: ScopeType[] = [
  'email',
  'openid',
  'profile',
  'phone',
  'aws.cognito.signin.user.admin',
];
