import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { ReferfriendPage } from '../referfriend/referfriend';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-referal',
  templateUrl: 'referal.html',
})
export class ReferalPage {
  refer_tab: any;
  data: any;
  completed_data: any;
  logout:any;
  loading: any;
  referral_amount = 0;
  referal_detail:any;
  referal_detail_len = 0;

  completed_referal_detail:any;
  completed_referral_amount = 0;
  completed_referal_detail_len = 0;
  public lang_arr:any;
  lang = {
    "referal":"My Referral",   
    "pending" : "Pending",
    "completed" : "Completed",
    "no_referal" : "No Referral Found",
    "refer_friend" : "Refer a Friend"
  };

  constructor(public viewCtrl: ViewController, public toastCtrl: ToastController, public authService: AuthService, private alertCtrl: AlertController, public loadingCtrl: LoadingController,  public navCtrl: NavController, public navParams: NavParams) {
    this.refer_tab = "Pending";
    this.clear_data();
  }

  ionViewDidLoad() {
    this.showLoader();
    this.authService.referal({token:localStorage.token, type:'pending'}).then((result) => {
      this.loading.dismiss();
      this.data = result; 
      if(this.data && this.data.status_code==200){
        this.referal_detail = this.data.response.detail.data;   
        this.referral_amount = this.data.response.amount[0];
        this.referal_detail_len = this.data.response.detail.data.length;   
      }else if(this.data && this.data.status_code==401){
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('Something wrong with request processing...');
    });
    
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }


  clear_data(){
    localStorage.removeItem('action');
    localStorage.removeItem('data_id');
    localStorage.removeItem('project_id');
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

  getSubmitionList(type){
    this.showLoader();
    this.completed_referal_detail = [];
    this.authService.referal({token:localStorage.token, type:type}).then((result) => {
      this.loading.dismiss();
      this.completed_data = result; 
      if(this.completed_data && this.completed_data.status_code==200){
        this.completed_referal_detail = this.completed_data.response.detail.data;   
        this.completed_referral_amount = this.completed_data.response.amount[0];
        this.completed_referal_detail_len = this.completed_data.response.detail.data.length;
        console.log("len="+this.completed_referal_detail_len)
      }else if(this.completed_data && this.completed_data.status_code==401){
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('Something wrong with request processing...');
    });
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

  referfriend(){
	  this.navCtrl.push(ReferfriendPage);
  }

}
