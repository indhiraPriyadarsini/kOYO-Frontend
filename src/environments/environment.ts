// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // aws_cognito_identity_pool_id:'us-east-1:a90c96be-57c5-46db-9ef8-f58fb7af65bf',
  aws_user_pools_id: 'us-east-1_nXbLepMWr',
  aws_user_pools_web_client_id: '4h9k4rnelj3uf9rlff42u464us',
  redirectSignIn: 'http://localhost:4200/pages/',
  redirectSignOut: 'http://localhost:4200',
  api: "https://d7h4a53qq5.execute-api.us-east-1.amazonaws.com/Prod/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
