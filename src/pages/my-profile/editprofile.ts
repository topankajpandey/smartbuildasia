import { Component } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { IonicPage, NavController, Events, AlertController, LoadingController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmissionPage } from '../submission/submission';
import { MyProfilePage } from '../my-profile/my-profile';
import { AccountService } from '../../providers/account-service/account-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {

  private logout:any;
  public loading: any;
  public token:string;
  public data:any;
  public profile_form: FormGroup;
  public profileData = {password:'', confirm_password:'', token:''};
  public password:any;
  public profile_pic:any;
  public profile_src:any;

  public lang_arr:any;
  lang = {
    "back":"Back",   
    "my_profile":"My Profile",
    "name":"Name",	   
    "cancel":"Cancel",	 
    "email": "Email",
    "phone":"Phone",
    "password": "Password",	       	   
    "confirm_pasword"	:"Confirm Password",	   
    "save_changes":	"Save Changes"
  };

  constructor(private nativePageTransitions: NativePageTransitions, public events: Events, public viewCtrl: ViewController, private camera: Camera,  private alertCtrl: AlertController, public formdata: FormBuilder, public navCtrl: NavController, public authService: AuthService, public loadingCtrl: LoadingController, public accountService: AccountService, public navParams: NavParams) {
    this.token = localStorage.token;
    this.profile_pic = localStorage.photo_url;
    this.profile_form = this.formdata.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: [''],
      confirm_password: [''],
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

    this.showLoader();
    this.accountService.profile_edit({token:this.token}).then(
      (result) => {
        this.loading.dismiss();
        this.data = result; 
        if(this.data && this.data.status_code==200){
          this.profileData = this.data.response.detail;
          this.profileData.token = this.token;
          delete this.profileData.password;
        }else if(this.data && this.data.status_code==401){
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }
      },
      (err) => { console.log('error', err) }
    )
  }

  update_profile(){
    console.log(this.profileData);
    this.showLoader();
    if(this.profileData.password!=this.profileData.confirm_password){
        this.loading.dismiss();
        this.alertForLocator('Password and confirm password did not match');
    }else{
      this.accountService.profile_edit(this.profileData).then(
        (result) => {
          this.loading.dismiss();
          this.data = result; 
          if(this.data && this.data.status_code==200){
            localStorage.setItem('username', this.data.response.detail.username);
            localStorage.setItem('email', this.data.response.detail.email);
            localStorage.setItem('phone', this.data.response.detail.phone);
            this.events.publish('user:login', this.data.response.detail.username, localStorage.photo_url, localStorage.redeemed_amount, localStorage.pending_amount);
            this.navCtrl.setRoot(MyProfilePage);
          }else if(this.data && this.data.status_code==401){
            this.authService.logout(this.logout);
            this.navCtrl.setRoot(HomePage);
          }else{
            this.alertForLocator(this.data.ack);
          }
        },
        (err) => { 
          this.loading.dismiss();
          this.alertForLocator(err)
        }
      )
    }
  }

  edit_picture(){

    //this.profile_pic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUREOUIyQkQ4N0VEMTFFNzg3MENEQjFCQjdEQjM2MjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUREOUIyQkU4N0VEMTFFNzg3MENEQjFCQjdEQjM2MjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFREQ5QjJCQjg3RUQxMUU3ODcwQ0RCMUJCN0RCMzYyMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFREQ5QjJCQzg3RUQxMUU3ODcwQ0RCMUJCN0RCMzYyMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkFvDC4AAAIGSURBVHjaYvz//z/DQAAWbIIGxpNxqecH4lAgdgViHSCWhoo/A+IrQLwXiFcB8Xtsmi+czcVvMQ5QA8SFQCyEw0GaUEd1AnEfEDfhM4yJCAslgPgUEDfjsBSbIxqB+DwQy5JrsTjUAFMyotEAqleCHIsP4tJIJBAG4iOkWlwPxOo45G4DcTA0WPmh7Ns41CpD4x0FMGLLTsBUzQ2kvuAw6CYQWwBT6Ac0PQJA6gQexwoi68Hl43g8IVGFbik0q4DEqvDoSyYmqL3xGLAHj9wuKI2tVPIkxmItLGKkFHHY1CoSY7EkHkNd8Mi54ZETIsbin1jEGKF0KzQhMWBJXK14zP1DsKyGlrtWOOQ0QKkXaBEoIe2GioHK7jZoiv6P5EhkcJ8Yizfjsfg/1IK1WOT+4QnF7cQE9Rw8cQXzzW8g/gvFv4gokGYSY/EbIF5JIOWyAjEzFLMRULsJWnUSVWSWU7HeLyalrH4IxLOoYOl8IL5Dau2UD8RfKbAUFPeZ5FSLP4A4jgKLk3CUCUS1QNYB8TYyLAW1v5ZS0vQBgRAg/k6CpaCQCqS0zcUAtdSPBIsDgPgzNSyGVYdtRKgDtTB3ElLERGK8VQPxYTzyJ7HlWWpYDALuOBrsH6CVBQOtLAbFty0WcXtC8UqpxSBwFS3VRgDxJYr7TkSCDUA8BVpZrCRVM0CAAQClxmzqfwY6MwAAAABJRU5ErkJggg==";
    
    this.camera.getPicture({
      quality: 80,
      destinationType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      allowEdit: true,
      correctOrientation: true,
    }).then((imageData) => {
      let image = "data:image/jpeg;base64," + imageData;
      let user_data = {token:this.token, image:image};
      this.profile_pic =  image;
      this.showLoader();
      this.accountService.profile_edit(user_data).then((result) => {
        this.loading.dismiss();
        this.data = result;
        if(this.data.status_code==200){
          localStorage.setItem('photo_url', this.data.response.detail.photo_url);
          this.events.publish('user:login', localStorage.username, this.data.response.detail.photo_url, localStorage.redeemed_amount, localStorage.pending_amount);
          this.navCtrl.setRoot(MyProfilePage); 
        }else if(this.data && this.data.status_code==401){
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }else{
          this.alertForLocator(this.data.ack);
        }
      });
    }, (err) => {
      this.loading.dismiss();
    });
  }

  alertForLocator(err) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: err,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  

  cancel(){
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500
     };
  
    this.nativePageTransitions.slide(options);
    this.navCtrl.push(MyProfilePage);
  } 

}
