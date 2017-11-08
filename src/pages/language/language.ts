import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ToastController, NavParams } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  public lang_arr:any;
  lang = {login: '', email: '', password: '', sign_up: '', forgot_password: ''};
  constructor(public navCtrl: NavController, private toastCtrl: ToastController,  public authService: AuthService, public events: Events, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  english(){
    localStorage.setItem('language_code', 'en');

    let language_code = localStorage.language_code;
    this.authService.get_lang('en').then((result) => {
     this.lang_arr = result; 
     this.lang = this.lang_arr;

    this.events.publish('user:changerTop',
        this.lang_arr.home_page,
        this.lang_arr.my_submissions,
        this.lang_arr.my_referrals,
        this.lang_arr.how_it_works,
        this.lang_arr.language,
    );

    this.events.publish('user:changerBottom',
      this.lang_arr.terms_and_conditions,
      this.lang_arr.contact_us,
      this.lang_arr.log_out
    );

    
    if(localStorage.token){
      this.navCtrl.setRoot(WelcomePage);
    }else{
      this.navCtrl.setRoot(HomePage);
    }
    });

    
  }

  malay(){
    localStorage.setItem('language_code', 'mys');
    let language_code = localStorage.language_code;
    this.authService.get_lang('mys').then((result) => {
     this.lang_arr = result; 
     this.lang = this.lang_arr;

    this.events.publish('user:changerTop',
     this.lang_arr.home_page,
     this.lang_arr.my_submissions,
     this.lang_arr.my_referrals,
     this.lang_arr.how_it_works,
     this.lang_arr.language,
    );

    this.events.publish('user:changerBottom',
      this.lang_arr.terms_and_conditions,
      this.lang_arr.contact_us,
      this.lang_arr.log_out
    );

    if(localStorage.token){
      this.navCtrl.setRoot(WelcomePage);
    }else{
      this.navCtrl.setRoot(HomePage);
    }
    
    });
  }

  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
