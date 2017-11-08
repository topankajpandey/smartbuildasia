import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, NavController, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { CameraService } from '../../providers/camera-service/camera-service';
import * as $ from 'jquery'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { StackholderinformationPage } from '../information/stackholderinformation';
import { ProjectdetailPage } from '../information/projectdetail';
import { SubmissionPage } from '../submission/submission';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';

@IonicPage()
@Component({
  selector: 'page-editstackholder',
  templateUrl: 'editstackholder.html',
})
export class EditstackholderPage {

  public project_id:any;
  public loading: any;
  public cons_tab: String;
  public token:any;
  private logout:any;
  public project_name:any;
  public distance:any;
  public galery_src:any;
  public galery_len:Number;
  public imageUri:any;
  public base64Image: any;
  public data:any;
  public type_title:any;
  public subm_type_id:any;
  public submit_type:any;
  public photos_url = '';
  public consultantLength: Number;
  public consultant = { company_role:'', description:''};
  public consultantText = { company_name:'', company_role:'', description:'',  contr_name:'', contr_phone:'', contr_email:''};
  public consultantTextData = { company_name:'', company_role:'', description:'',  contr_name:'', contr_phone:'', contr_email:''};
  public bussiness_form: FormGroup;
  public text_form: FormGroup;
  public referral_rewared_prize = 0;
  public action = 'update';
  public data_id:Number;
  public lang_arr:any;
  lang = {
    "business_card" : "Business Card",
    "text_only" : "Text Only",
    "reward" : "Reward",
    "company_role" : "Company Role",
    "desc" : "Description",
    "submit_info" : "Submit Info",
    "comp_name" : "Company Name",
    "contact_email":"Contact Email",
    "con_phone" : "Contact Phone Number",
    "con_name" : "Contact Name",
    "subm" : "Submission",
    "take_photo": "Take Photo",
    "photo" : "Photo",
    "no_photo_uploaded": "No photo uploaded",
    "upload_gallery": "Upload From Gallery"

  };

  constructor(public viewCtrl: ViewController, private base64: Base64, private imagePicker: ImagePicker,  public app: App, public navCtrl: NavController, public authService: AuthService, public toastCtrl: ToastController, public diagnostic: Diagnostic, private camera: Camera,  public cameraService: CameraService, public formdata: FormBuilder, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public navParams: NavParams) {
  
    this.type_title = navParams.get('type_title');
    this.subm_type_id = navParams.get('subm_type_id');
    this.submit_type = navParams.get('submit_type');
    this.project_id = navParams.get('project_id');
    console.log(this.submit_type);
    this.cons_tab = "BusinessCard";
    //this.project_id = localStorage.project_id;
    this.token = localStorage.token;
    

    this.bussiness_form = this.formdata.group({
      company_role: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.text_form = this.formdata.group({
      company_name: ['', [Validators.required]],
      company_role: ['', [Validators.required]],
      contr_name: ['', [Validators.required]],
      contr_phone: ['', [Validators.required]],
      contr_email: ['', [Validators.required, Validators.email]]
    }); 

    if(localStorage.action){
      this.action = localStorage.action;
    }
    if(localStorage.data_id){
      this.data_id = localStorage.data_id;
    }

    this.referral_rewared_prize = localStorage.referral_rewared_prize;

    console.log(this.action);

  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad EditstackholderPage');
    this.showLoader();
    this.photos_url = 'assets/images/card.png';
    let submission_data = {type:this.subm_type_id, project_id:this.project_id, token:this.token}
    this.authService.get_submission_data(submission_data).then((result) => {
      this.data = result;
      if(this.data && this.data.status_code==200){
          this.loading.dismiss();
          
              this.consultant = { 
                company_role:this.data.response.detail.company_role,
                description:this.data.response.detail.description,
              };
              
              this.consultantTextData = { 
                company_role:this.data.response.detail.company_role,
                description:this.data.response.detail.description,
                company_name: this.data.response.detail.company_name, 
                contr_name:   this.data.response.detail.contr_name, 
                contr_phone:  this.data.response.detail.contr_phone, 
                contr_email:  this.data.response.detail.contr_email
              };
              this.consultantLength = this.data.response.detail.length;
              this.photos_url = this.data.response.detail.photos_url;
              
      }else if(this.data && this.data.status_code==401){
        this.authService.logout(this.logout);
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

  text_card_submission(){
    this.showLoader();
    this.consultantText['type'] = this.subm_type_id;
    this.consultantText['project_id'] = this.project_id;
    this.consultantText['token'] = this.token;
    this.consultantText['image'] = localStorage.bussiness_photo;
    this.consultantText['data_id'] = this.data_id;
    this.consultantText['action'] = this.action;
    this.cameraService.project_submission(this.consultantText).then((result) =>
    {
        this.text_form.reset();
        this.loading.dismiss();
        this.data = result;
        if(this.data && this.data.status_code==200){
            this.alertForLocator('Site photo uploaded successfully.', 'Success', 'Ok');
            this.navCtrl.push(SubmissionPage)
            .then(() => {
              this.navCtrl.remove(1, 2);
            });
        }else if(this.data && this.data.status_code==401){
          this.loading.dismiss();
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  bussiness_card_submission(){
 
    this.showLoader();
    this.consultant['type'] = this.subm_type_id;
    this.consultant['project_id'] = this.project_id;
    this.consultant['token'] = this.token;
    this.consultant['keyword'] = localStorage.keyword;
    this.consultant['submit_type'] = 'finish';
    this.consultant['data_id'] = this.data_id;
    this.consultant['action'] = this.action;
    
    this.cameraService.project_submission(this.consultant).then((result) => {
        this.bussiness_form.reset();
        this.loading.dismiss();
        this.data = result;
        if(this.data && this.data.status_code==200){
          this.alertForLocator('Site photo uploaded successfully.', 'Success', 'Ok');
          this.navCtrl.push(SubmissionPage)
          .then(() => {
            this.navCtrl.remove(1, 2);
          });
        }else if(this.data && this.data.status_code==401){
          this.loading.dismiss();
          this.authService.logout(this.logout);
          this.navCtrl.setRoot(HomePage);
        }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  alertForLocator(error, title, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: error,
      buttons: [button]
    });
    alert.present();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

 

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

  click_cam_pick(type){
    localStorage.setItem('keyword', this.makeid());
    let sourceType;
    if(type=='CAMERA'){
      sourceType = this.camera.PictureSourceType.CAMERA
    }else{
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    }
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:sourceType,
      targetWidth: 2000,
      targetHeight: 2000,
      allowEdit: true,
      correctOrientation: false,
      saveToPhotoAlbum: true,
    }
    this.camera.getPicture(options).then((imageData) => { 
        this.base64Image = "data:image/jpeg;base64," + imageData;
        let porject_data = {type:this.subm_type_id, submit_type:'temp', project_id:this.project_id, keyword:localStorage.keyword, token:this.token, image:imageData}
        localStorage.setItem('bussiness_photo', this.base64Image);
        this.cameraService.project_submission(porject_data).then((result) => {
          this.data = result;
          if(this.data && this.data.status_code==200){
          }else if(this.data && this.data.status_code==401){
            this.authService.logout(this.logout);
            this.navCtrl.setRoot(HomePage);
          }
        });
      }, (err) => {
          this.loading.dismiss();
          this.alertForLocator(err, 'Error', 'Dismiss');
      });
  }

  take_picture(type){
    this.click_cam_pick(type);
  }


  ionViewDidLoad() {
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.viewCtrl.setBackButtonText(this.lang_arr.back);
      this.lang = this.lang_arr;
      });
    }
  }

}
