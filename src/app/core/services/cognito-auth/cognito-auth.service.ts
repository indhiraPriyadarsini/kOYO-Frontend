import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  id: string | null;
  email: string | null;
  name: string | null;
}
export interface CustomUser {
  attributes: {
    name: string;
    email: string;
    sub: string;
  };
  username: string;
}
const initialAuthState = {
  isLoggedIn: false,
  username: null,
  id: null,
  email: null,
  name: null,
};
@Injectable({
  providedIn: 'root',
})
export class CognitoAuthService {
  constructor() {
    this.getCurrentUser().then(
      (user: any) => this.assignUser(user),
      (err) => this.authStateSub.next(initialAuthState)
    );
    Hub.listen('auth', async ({ payload: { event } }) => {
      if (event === 'signIn') {
        this.assignUser(await this.getCurrentUser());
      } else {
        this.authStateSub.next(initialAuthState);
      }
    });
  }
  private readonly authStateSub = new BehaviorSubject<AuthState>(
    initialAuthState
  );
  readonly authState$ = this.authStateSub.asObservable();
  readonly isLoggedIn$ = this.authState$.pipe(map((state) => state.isLoggedIn));
  readonly getCurrentUser = (): Promise<any> => Auth.currentAuthenticatedUser();
  private assignUser(user: any): void {
    if (!user) {
      return;
    }
    const {
      attributes: { sub: id, email, name },
      username,
    } = user as CustomUser;
    sessionStorage.setItem("token",user.signInUserSession.idToken.jwtToken)
    this.authStateSub.next({ isLoggedIn: true, id, username, email, name });
  }
  readonly login = () => Auth.federatedSignIn({ customProvider: 'presidio' });
  readonly logout = () => Auth.signOut();
}