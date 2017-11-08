import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../providers/auth-service/auth-service';
import { IonicPage, NavParams, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  loading: any;
  forgetdata = { login_email:''};
  data: any;
  public lang_arr:any;
  lang = {
    email: 'Email', 
    reset: 'Reset',
    forgot_password: 'Forgot Password'
  };
  user_detail:{};
  resetForm: FormGroup;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public authService: AuthService, public navParams: NavParams, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public formdata: FormBuilder) {
      this.resetForm = this.formdata.group({
            email: ['', [Validators.required, Validators.email]],
      });
  }

  ionViewDidLoad() {
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }

  alertForLocator(title,subTitle, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    alert.present();
  }

  reset_password(){
    this.showLoader();
    this.authService.reset(this.forgetdata).then((result) => {
      this.data = result;
      console.log(result);
      if(this.data){ 
        if(this.data.status_code==200){
            this.loading.dismiss();
            this.alertForLocator('Success','Password reset successfully', 'Ok');
            this.navCtrl.setRoot(HomePage);
        }else{
          this.loading.dismiss();
          this.alertForLocator('Error',this.data.ack, 'Dismiss');
        }
      }else{
        this.loading.dismiss();
        this.alertForLocator('Error',this.data.ack, 'Dismiss');
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
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
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
