import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

  signup() {
      this.navCtrl.push(SignupPage);
  }

  login() {
      this.navCtrl.push(WelcomePage);
  }

}
