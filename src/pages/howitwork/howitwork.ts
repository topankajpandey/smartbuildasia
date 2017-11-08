import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';


@IonicPage()
@Component({
  selector: 'page-howitwork',
  templateUrl: 'howitwork.html',
})
export class HowitworkPage {
  public slides:any;
  public loading: any;
  private logout:any;
  public data:any;
  public lang_type:any;
  public lang_arr:any;
  lang = {
    "how_works":"How It Works",
  };
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public authService: AuthService, public navParams: NavParams) {
    this.clear_data();
  }

  clear_data(){
    localStorage.removeItem('action');
    localStorage.removeItem('data_id');
    localStorage.removeItem('project_id');
  }

  ionViewDidLoad() {
    this.showLoader();
    let porject_data = {token:localStorage.token}
    this.authService.how_it_works(porject_data).then((result) => {
      this.loading.dismiss();
      this.data  = result;
      if(this.data && this.data.status_code==200){
        
        this.slides = this.data.response.detail;
        
      }else if(this.data && this.data.status_code==401){
        this.loading.dismiss();
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    });
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      this.lang_type = localStorage.language_code;
      console.log(this.lang_type);
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

}
