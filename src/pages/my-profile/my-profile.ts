import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { EditprofilePage } from '../my-profile/editprofile';
import { MymoneyPage } from '../mymoney/mymoney';
import { AccountService } from '../../providers/account-service/account-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
/**
 * Generated class for the MyProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  public username: any;
  private logout:any;
  public loading: any;
  public token:string;
  public data:any;
  public profile_pic:any;
  public email:any;
  public phone:any;
  public redeemed_amount:any;
  public pending_amount:any;
  public profileData = {password:'', token:''};

  public lang_arr:any;
  lang = {
    "my_profile":"My Profile",  
    "edit":"Edit",	   
    "still_due":"Still Due",	   
    "total_received":"Total received",	   
    "contact_email":"Contact Email",	   
    "phone":"Phone",	   
    "how_get_money":"How to Get my Money"
  };

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public authService: AuthService, public loadingCtrl: LoadingController, public accountService: AccountService, public navParams: NavParams) {
    this.username = localStorage.username;
    this.token = localStorage.token;
    this.profile_pic = localStorage.photo_url;
    this.email = localStorage.email;
    this.phone = localStorage.phone;
    this.redeemed_amount = localStorage.redeemed_amount;
    this.pending_amount	 = localStorage.pending_amount;
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  edit_profile(){
	this.navCtrl.push(EditprofilePage);  
  }
  
  get_money(){
	this.navCtrl.push(MymoneyPage);  
  }

}
