import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule,  Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CustomFormsModule } from 'ng2-validation'
import { PasswordValidation } from '../../validators/password.validator';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
 
  loading: any;
  regData = { login_email:'', login_password:''};
  data: any;
  regForm: FormGroup;
  referral_code = "";
  public lang_arr:any;
  lang = {
      "login": "Login",
      "sign_up": "Sign Up",
      "username":	"Username",
      "email": "Email",   	   
      "phone_number":	"Phone Number",
      "password": "Password - min 6 characters",
      "confirm_password":	"Confirm Password",
      "referral_number": "Referral Number",
      "registration_successful":	"Registration Successful"
    };

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public authService: AuthService, 
    public loadingCtrl: LoadingController, private toastCtrl: ToastController, public formdata: FormBuilder) {
      
      this.regForm = this.formdata.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            referral_code: [''],
            password: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
            confirm_password: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
        }, {
            validator: PasswordValidation.MatchPassword // your validation method
        });

        
        if(localStorage.referraldata){
          this.referral_code = localStorage.referraldata;
          
        }

  }

  alertForLocator(title, text, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [button]
    });
    alert.present();
  }

  registration() {
    this.showLoader();
    //this.regData['referral_code'] = this.referral_code;
    this.authService.register(this.regData).then((result) => {
      this.data = result;
      if(this.data && this.data.status_code==200){
          this.loading.dismiss();
          this.presentToast("Registration successfull...");
          this.navCtrl.setRoot(HomePage);
      }else if (this.data.status_code==617){
        this.alertForLocator('Wrong Token', 'Wrong or already exist', 'Ok');
        this.loading.dismiss();
      }else{
        this.alertForLocator('Undefined', this.data.ack, 'Ok');
        this.loading.dismiss();
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
      duration: 15000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
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

  login(){
    this.navCtrl.push(HomePage);
  }
  
}