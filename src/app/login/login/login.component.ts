import { Component, OnInit } from '@angular/core';
import { CognitoAuthService } from '@services/cognito-auth/cognito-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private cas: CognitoAuthService) {
    // document.body.style.backgroundImage="url('../../assets/loginbackground.png')";
    // document.body.style.backgroundSize="cover";
  }

  ngOnInit(): void {}
  async login() {
    await this.cas.login();
  }
}
