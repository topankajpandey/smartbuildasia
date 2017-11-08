import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmissionPage } from './submission';

@NgModule({
  declarations: [
    SubmissionPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmissionPage),
  ],
})
export class SubmissionPageModule {}
