import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlidemenuPage } from './slidemenu';

@NgModule({
  declarations: [
    SlidemenuPage,
  ],
  imports: [
    IonicPageModule.forChild(SlidemenuPage),
  ],
})
export class SlidemenuPageModule {}
