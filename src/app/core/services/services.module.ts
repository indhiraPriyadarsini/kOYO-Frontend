import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitoAuthService } from './cognito-auth/cognito-auth.service';
import { ResumeUploadService } from './resume-upload/resume-upload.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [CognitoAuthService,ResumeUploadService],
})
export class ServicesModule {
  constructor(@Optional() @SkipSelf() module: ServicesModule) {
    if (module) {
      throw new Error('services are already been instantiated by App Module');
    }
  }
}
