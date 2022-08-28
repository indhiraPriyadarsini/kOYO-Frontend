import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitoAuthGuard } from './cognito-auth/cognito-auth.guard';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [CognitoAuthGuard],
})
export class GuardsModule {
  constructor(@Optional() @SkipSelf() module: GuardsModule) {
    if (module) {
      throw new Error('Guards are already been instantiated by App Module');
    }
  }
}
