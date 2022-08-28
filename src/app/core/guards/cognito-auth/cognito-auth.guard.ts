import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {
  CognitoAuthService,
  CustomUser,
} from '@services/cognito-auth/cognito-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CognitoAuthGuard implements CanActivate {
  constructor(private cas: CognitoAuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.cas
      .getCurrentUser()
      .then((user) =>
        user && (user as CustomUser).username.startsWith('presidio')
          ? true
          : this.router.parseUrl('/')
      )
      .catch((_err) => this.router.parseUrl('/'));
  }
}
