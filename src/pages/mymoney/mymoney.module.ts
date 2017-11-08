import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MymoneyPage } from './mymoney';

@NgModule({
  declarations: [
    MymoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(MymoneyPage),
  ],
})
export class MymoneyPageModule {}
