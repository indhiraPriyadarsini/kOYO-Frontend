import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuthService } from '@services/cognito-auth/cognito-auth.service';
import { AuthCred, scope } from 'src/credentials';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
//`https://koyo-dev-test.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=AzureAD&redirect_uri=https://dev.koyo.app.presidio.com/pages/&response_type=CODE&client_id=4h9k4rnelj3uf9rlff42u464us&scope=aws.cognito.signin.user.admin email openid phone profile`

  public AUTH_URL:string;
  constructor(private cas: CognitoAuthService,private router:Router) {
    let scopes:string='';
    scope.forEach(element => {
      scopes+=element+' '
    });
     this.AUTH_URL='https://'+AuthCred.DOMAIN+'/oauth2/authorize?identity_provider=AzureAD&redirect_uri='+environment.redirectSignIn+'&response_type='+AuthCred.RESPONSETYPE+'&client_id='+environment.aws_user_pools_web_client_id+'&scope='+scopes;
    }

  ngOnInit(): void {
    this.cas.isLoggedIn$.subscribe(isLogged=>{
      console.log(isLogged);
      
      if(isLogged){
        this.router.navigate(['pages'])
      }
    })
    
  }

  async login() {
    location.href=this.AUTH_URL
    // this.router.navigate([this.AUTH_URL])
    // await this.cas.login();
  }
}
