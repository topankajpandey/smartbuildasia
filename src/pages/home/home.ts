import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NavController, Platform, LoadingController, Events, MenuController,  ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SignupPage } from '../signup/signup';
import { WelcomePage } from '../welcome/welcome';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SlidemenuPage } from '../slidemenu/slidemenu';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import 'rxjs/add/operator/map';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal } from '@ionic-native/onesignal';
import { TranslateService } from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';
@Component({  
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loading: any;
  loginData = { login_email:'', login_password:''};
  data: any;
  user_detail:{};
  myForm: FormGroup;
  player_id = "";
  public language_code = 'en';
  public lang_arr:any;
  lang = {login: 'Login', email: 'Email', password: 'Password', sign_up: 'Sign Up', forgot_password: 'Forgot Password'};

  public screen_width =  window.screen.width;
  constructor(public oneSignal: OneSignal, public menuCtrl: MenuController, http: Http, public events: Events, public geolocation: Geolocation, public fcm: FCM, public platform: Platform, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy, public navCtrl: NavController, public authService: AuthService, 
    public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, public formdata: FormBuilder) {
      this.check_auth();
      
      this.myForm = this.formdata.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,  Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
      });

      if (this.platform.is('android')) {
        this.oneSignal.getIds().then((result) => {
          this.player_id = result.userId;
        });
      }

      this.menuCtrl.enable(false, 'unauthenticated');

  }



  ionViewDidLoad() {
    
    let options = {timeout: 10000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then((resp) => {
      let lat_lng_token = {lat:resp.coords.latitude, lng:resp.coords.longitude};
      let json_lat_lng = {lat:resp.coords.latitude,lng:resp.coords.longitude};
      localStorage.setItem('user_lat_lng', JSON.stringify(json_lat_lng)); 
    });

    if(localStorage.language_code){
      this.language_code = localStorage.language_code;
    }else{
      localStorage.setItem('language_code', this.language_code);
    }

    this.authService.get_lang(localStorage.language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
    }); 
    

  } 

  check_auth(){
    if((localStorage.getItem('token') === null || localStorage.getItem('username') === null)) {
    } else {
      this.events.publish('user:login', localStorage.username, localStorage.photo_url, localStorage.redeemed_amount, localStorage.pending_amount);
      this.navCtrl.setRoot(WelcomePage);
    }
  } 


  alertForLocator(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
  authenticate() {
    console.log(this.loginData);
    this.showLoader();
    this.loginData['player_id'] = this.player_id;
    this.loginData['screen_width'] = this.screen_width;

    this.authService.login(this.loginData).then((result) => {
      this.data = result;
      if(this.data){ 
        if(this.data.status_code==200){
          this.menuCtrl.enable(true);
            this.loading.dismiss();
            this.events.publish('user:login', this.data.response.detail.username, this.data.response.detail.profile_pic, this.data.response.detail.redeemed_amount, this.data.response.detail.pending_amount);
            
            localStorage.setItem('id', this.data.response.detail.id);
            localStorage.setItem('username', this.data.response.detail.username);
            window.localStorage.setItem("username",this.data.response.detail.username);
            localStorage.setItem('token', this.data.response.detail.token_key);
            localStorage.setItem('photo_url', this.data.response.detail.profile_pic);
            localStorage.setItem('referral_code', this.data.response.detail.referral_code);
            localStorage.setItem('referral_rewared_prize', this.data.response.detail.referral_reward.value);
            localStorage.setItem('email', this.data.response.detail.email);
            localStorage.setItem('phone', this.data.response.detail.phone);
            localStorage.setItem('redeemed_amount', this.data.response.detail.redeemed_amount);
            localStorage.setItem('pending_amount', this.data.response.detail.pending_amount);
            localStorage.setItem('zoom_level', this.data.response.zoom_level);
            localStorage.setItem('area_covered', this.data.response.area_covered);
            this.navCtrl.setRoot(WelcomePage);
        }else{
          this.loading.dismiss();
          this.alertForLocator('Error', this.data.ack);
        }
      }else{
        this.loading.dismiss();
        this.alertForLocator('Error', this.data.ack);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('Error in web api. Try later.');
    });
  }

  
 

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
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

  signup_page() {
      this.navCtrl.push(SignupPage);
  }

  forgot_password(){
    this.navCtrl.push(ForgotPasswordPage);
    
  }

  language(lang_code){
    localStorage.setItem('language_code', lang_code);
    let language_code = localStorage.language_code;
    this.authService.get_lang(language_code).then((result) => {
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
    });
    this.navCtrl.setRoot(HomePage);
  }


}
