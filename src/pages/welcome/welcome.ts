import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { InformationPage } from '../information/information';
import { ReferalPage } from '../referal/referal';
import { SubmissionPage } from '../submission/submission';
import { MapPage } from '../map/map';
import { AccountService } from '../../providers/account-service/account-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../../pages/home/home';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  username: any;
  private logout:any;
  public loading: any;
  public token:string;
  public data:any;
  public profile_pic:any;
  public pending_amount = "0";
  public profileData = {password:'', token:''};
  public total_ammount:any;
  public lang_arr:any;
  lang = {
    "welcome_user":	"Welcome", 
    "give_info":	"Give Information",	   
    "or":	"Or",	   
    "refer_friend":	"Refer a Friend",  
    "congratulations":	"Congratulations",	   
    "earned": "You have earned",
    "last_week": "last week",  
    "submission_button" : "My Submissions"
  };
  constructor( public platform: Platform, private toastCtrl: ToastController,  private locationAccuracy: LocationAccuracy, public loadingCtrl: LoadingController, private diagnostic: Diagnostic, public geolocation: Geolocation, private alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public authService: AuthService, public accountService: AccountService, public navParams: NavParams) {
        this.username = localStorage.username;
        this.token = localStorage.token;
        this.profile_pic = localStorage.photo_url;
        this.onDeviceReady();
        this.username =  window.localStorage.getItem('username');
        this.profile_pic =  window.localStorage.getItem('photo_url');
        this.clear_data();
        this.total_ammount = parseInt(localStorage.redeemed_amount) + parseInt(localStorage.pending_amount);
    }

    ionViewDidLoad() {
      this.pending_amount = localStorage.pending_amount;
      this.geolocation.getCurrentPosition().then((resp) => {
        let lat_lng_token = {lat:resp.coords.latitude, lng:resp.coords.longitude};
        let json_lat_lng = {lat:resp.coords.latitude,lng:resp.coords.longitude};
        localStorage.setItem('user_lat_lng', JSON.stringify(json_lat_lng)); 
      });

      if(localStorage.language_code){
        let language_code = localStorage.language_code;
        this.authService.get_lang(language_code).then((result) => {
        this.lang_arr = result; 
        this.lang = this.lang_arr;
        });
      }
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


    showLoader(){
      this.loading = this.loadingCtrl.create({
          content: ''
      });
      this.loading.present();
    }
  
    dismiss() {
      this.viewCtrl.dismiss();
    }


    alertForLocator() {
      let alert = this.alertCtrl.create({
        title: 'GPS Error',
        subTitle: 'Need to enable GPS service',
        buttons: ['Dismiss']
      });
      alert.present();
    }

    onDeviceReady() {
      if (this.platform.is('ios') || this.platform.is('android')) {
        console.log("navigator.geolocation works well");
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => console.log('Request successful'),
              error => console.log('Error requesting location permissions', error)
            );
          }
        });
      }
    }


    checkLocation()
    {
      if (this.platform.is('ios') || this.platform.is('android')) {
          this.navCtrl.push(MapPage);
      }else{
          this.geolocation.getCurrentPosition().then((resp) => {
          this.navCtrl.push(MapPage);
        }).catch( (e) => {
          this.diagnostic.switchToLocationSettings();
        });
      }
    }

    give_info(){
      this.navCtrl.push(InformationPage);
    }
    
    refer_friend(){
        this.navCtrl.push(ReferalPage);
    }

    my_submission(){
        this.navCtrl.push(SubmissionPage);
    }
    
    map_view(){
      this.checkLocation();
    }

    clear_data(){
      localStorage.removeItem('action');
      localStorage.removeItem('data_id');
      localStorage.removeItem('project_id');
    }

}
