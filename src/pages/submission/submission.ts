import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { SubmissiondetailPage } from '../submission/submissiondetail';
import { Geolocation } from '@ionic-native/geolocation';
import { MapPage } from '../map/map';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SubmissionService } from '../../providers/submission-service/submission-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-submission',
  templateUrl: 'submission.html',
})
export class SubmissionPage {
  submission_tab: String;
  public submissionList;
  private page:any;
  public loading: any;
  private logout:any;
  public token:any;
  public data:any;
  public subLength:any;
  public lang_arr:any;
  lang = {
    "submisison":"My Submission",
    "all" : "All",
    "pending" : "Pending",
    "accepted" : "Accepted",
    "partially" : "Partially Accepted",
    "rejected" : "Rejected",
    "no_record" : "No Record Found",
    "give_info" : "Give Information"

  };
  constructor(public platform: Platform, public toastCtrl: ToastController, public submission: SubmissionService,public authService: AuthService, public navCtrl: NavController, private diagnostic: Diagnostic, public navParams: NavParams,public geolocation: Geolocation,public loadingCtrl: LoadingController) {
    this.submissionList = [];
    this.submission_tab = "All";
    this.token = localStorage.token;
    this.clear_data();
     
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

  ngOnInit() {
    this.showLoader();
    let page = 1;
    let data = {token:this.token, type:'all'};
    this.submission.getSubmissionList(data,page).then(
      (result) => {
        this.loading.dismiss();
        this.data = result; 
        if(this.data && this.data.status_code==200){
          this.submissionList = this.data.response.detail.data;
        }else if(this.data && this.data.status_code==401){
          this.loading.dismiss();
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong with request processing...');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmissionPage');
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }

  getSubmitionList(type){
    this.submissionList = [];
    this.showLoader();
    let page = 1;
    let data = {token:this.token, type:type};
    this.submission.getSubmissionList(data,page).then(
      (result) => {
        // alert(JSON.stringify(result));
        this.loading.dismiss();
        this.data = result; 
        if(this.data && this.data.status_code==200){
          this.submissionList = this.data.response.detail.data;
        }else if(this.data && this.data.status_code==401){
          this.loading.dismiss();
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast('Something wrong with request processing...');
      });
  }

  submission_detail(id, title){
    console.log(id);
    console.log(title);
    this.navCtrl.push(SubmissiondetailPage,{
      id:id,
      title:title
    });
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

  give_info(){
    //this.navCtrl.push(MapPage); 
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


}
