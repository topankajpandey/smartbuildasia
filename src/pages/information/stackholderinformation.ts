import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { ConsultantPage } from '../consultant/consultant';
import { ProjectService} from '../../providers/project-service/project-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-stackholderinformation',
  templateUrl: 'stackholderinformation.html',
})
export class StackholderinformationPage {

  public project_id:any;
  public project_name:any;
  public distance:any;
  private logout:any;
  public data: any;
  public stacklist:any;
  public stacklist_len:Number;
  public userlatlng:any;
  public loading: any;
  public lang_type:any;
  public detail = {name:'', distance:''};
  public lang_arr:any;
  lang = {
    "submit_info" : "Submit Information",
    "select_who" : "Select Who"

  };
  constructor(public viewCtrl: ViewController, private toastCtrl: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public authService: AuthService, public projectService: ProjectService, public navParams: NavParams) {

    this.project_name = navParams.get('project_name');
    this.distance = navParams.get('distance');
  }

  

  ngAfterViewInit() {
    this.showLoader();
    this.userlatlng = JSON.parse(localStorage.getItem('user_lat_lng'));
    let lat_lng_token = {subm_type:'stakeholder_information', lat:this.userlatlng.lat, lng:this.userlatlng.lng, token:localStorage.token, project_id:localStorage.project_id};
    this.projectService.get_single_project(lat_lng_token).then((result) => {
      this.loading.dismiss();
      this.data = result;
      if(this.data && this.data.status_code==200){
        this.stacklist = this.data.response.list;
        this.detail = this.data.response.detail[0];
        this.stacklist_len = this.data.response.list.length;   
      }else if(this.data && this.data.status_code==401){
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast('Something wrong with request processing...');
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
  
  main_consultant(title, subm_type_id){
    console.log(title + subm_type_id);
    this.navCtrl.push(ConsultantPage,{
      type_title:title,
      subm_type_id:subm_type_id,
      project_id:this.project_id,
      project_name:this.project_name,
      distance:this.distance
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

  ionViewDidLoad() {
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      this.viewCtrl.setBackButtonText(this.lang_arr.back);
      this.lang_type = localStorage.language_code;
      });
    }
  }

}
