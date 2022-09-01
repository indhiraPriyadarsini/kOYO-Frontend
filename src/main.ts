import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from '@aws-amplify/auth';
import { AppModule } from './app/app.module';
import { environment as env } from './environments/environment';
import { AuthCred, scope } from './credentials';

const config = {
  aws_project_region: AuthCred.REGION,
  aws_user_pools_id: env.aws_user_pools_id,
  aws_user_pools_web_client_id: env.aws_user_pools_web_client_id,
  oauth: {
    domain: AuthCred.DOMAIN,
    scope,
    redirectSignIn: env.redirectSignIn,
    redirectSignOut: env.redirectSignOut,
    responseType: AuthCred.RESPONSETYPE,
  },
  federationTarget: AuthCred.FEDERATIONTARGET,
};

Auth.configure(config);

if (env.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
