import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, ToastController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
/**
 * Generated class for the MymoneyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mymoney',
  templateUrl: 'mymoney.html',
})
export class MymoneyPage {
  public lang_arr:any;
  logout:any;
  loading: any;
  public current_platform = "";
  data: any;
  content1 = "";
  content2 = "";
  content3 = "";
  content4 = "";
  content5 = "";
  lang = {
    "money":"Money",
    "how_get1" : "How do I get my",
    "how_get2" : "money?",
    "desc1" : "To the money Smartbuild Asia owes you for",
    "desc2" : "your great contribution depends on your",
    "desc3" : "payment reference",
    "text1" : "Come to our office every 1st and 15th",
    "text2" : "day of the month",
    "locate" : "Locate Us",
    "masjid" : "29B Mosque",
    "contact" : "Contact Us",
    "back":"Back"	
  };
  constructor(public viewCtrl: ViewController, public platform: Platform, public toastCtrl: ToastController, public authService: AuthService, private alertCtrl: AlertController, public loadingCtrl: LoadingController,  public navCtrl: NavController, public navParams: NavParams) {
 
    if (this.platform.is('android')) {
      this.current_platform = 'android';
    }else{
      this.current_platform = 'ios';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MymoneyPage');
    this.get_data();
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }

  get_data(){
    this.showLoader();
    this.authService.get_my_money({token:localStorage.token}).then((result) => {
      this.loading.dismiss();
      this.data = result; 
      if(this.data && this.data.status_code==200){
        if(localStorage.language_code=='en'){
          this.content1 = this.data.response.detail[0].content;   
          this.content2 = this.data.response.detail[1].content;   
          this.content3 = this.data.response.detail[2].content;   
          this.content4 = this.data.response.detail[3].content;   
          this.content5 = this.data.response.detail[4].content;   
        }else{
          this.content1 = this.data.response.detail[0].content_ml; 
          this.content2 = this.data.response.detail[1].content_ml; 
          this.content3 = this.data.response.detail[2].content_ml; 
          this.content4 = this.data.response.detail[3].content_ml; 
          this.content5 = this.data.response.detail[4].content_ml; 
        }
      }else if(this.data && this.data.status_code==401){
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('Something wrong with request processing...');
    });
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
