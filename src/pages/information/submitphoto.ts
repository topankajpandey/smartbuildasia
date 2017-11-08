import { Component } from '@angular/core';
import { Nav, AlertController, ViewController, IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { App } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ProjectService } from '../../providers/project-service/project-service';
import { CameraService } from '../../providers/camera-service/camera-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { ProjectdetailPage } from '../information/projectdetail';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import * as $ from 'jquery'


declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-submitphoto',
  templateUrl: 'submitphoto.html',
})
export class SubmitphotoPage {

  public base64Image:any;
  public photos : any;
  public project_id:any;
  public token:any;
  public data:any;
  public loading: any;
  private logout:any;
  public project_name:any;
  public distance:any;
  public submit_title:any;
  public submit_id:any;
  public galery_src:any;
  public galery_len:Number;
  public imageUri:any;
  public hold_img_url:any;
  public subm_type_id:any;
  public action='new';
  public data_id:Number;
  public lang_arr:any;
  lang = {
    "take_photo" : "Take Photo",
    "of_site" : "of project site",
    "submit_photo" : "Submit Photo",
    "upload_gallery" : "Upload From Gallery"

  };
  constructor(public app: App, private base64: Base64, private imagePicker: ImagePicker, public viewCtrl: ViewController, public navCtrl: NavController, public authService: AuthService, public cameraService: CameraService, private alertCtrl: AlertController, public diagnostic: Diagnostic, public navParams: NavParams, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {
    this.project_id = navParams.get('project_id');
    this.subm_type_id = navParams.get('subm_type_id');
    this.submit_id = navParams.get('submit_id');
    this.submit_title = navParams.get('submit_title');
    this.project_name = navParams.get('project_name');
    this.distance = navParams.get('distance');
    this.token = localStorage.token;

    if(localStorage.action){
      this.action = localStorage.action;
    }

    if(localStorage.data_id){
      this.data_id = localStorage.data_id;
    }
    
    console.log(this.submit_id);
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

  alertForLocator(error, title, button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: error,
      buttons: [button]
    });
    alert.present();
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

  take_photo(type){
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
      targetWidth: 400,
      allowEdit: true,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then((imageData) => {
       
        localStorage.setItem('keyword', this.makeid());
        this.base64Image = "data:image/jpeg;base64," + imageData;
        let porject_data = {type:this.submit_id, submit_type:'temp', project_id:this.project_id, keyword:localStorage.keyword, token:this.token, image:imageData}
        this.cameraService.project_submission(porject_data).then((result) => {
            this.data = result;
            if(this.data && this.data.status_code==200){

            }else if(this.data && this.data.status_code==401){
              this.authService.logout(this.logout);
              this.navCtrl.setRoot(HomePage);
            }
        });
      }, (err) => {
          this.presentToast('Something wrong with request processing...');
      });
    }


    

    /*gallery_photo(){
      this.imagePicker.getPictures({
        quality: 80,
        maximumImagesCount:1,
        width: 400
      }).then((results) => {
        this.galery_src = results;
        this.galery_len = results.length;
        if(this.galery_len>0){
          $(".after_submission").show();
          $(".before_submission").hide();
        }
        localStorage.setItem('keyword', this.makeid());
        let counter = 0;
        for (var i = 0; i < results.length; i++) {
            this.imageUri = results[i];
            this.base64.encodeFile(this.imageUri).then((base64File: string) => {
              let imagedata = JSON.stringify(base64File);
              //let porject_data = {type:this.submit_id, keyword:localStorage.keyword, project_id:this.project_id,token:this.token, image:imagedata};
              let porject_data = {type:this.submit_id, submit_type:'temp', project_id:this.project_id, keyword:localStorage.keyword, token:this.token, image:imagedata};
              this.cameraService.project_submission(porject_data).then((result) => {
                this.loading.dismiss();
                this.data = result
                if(this.data && this.data.status_code==200){
                  
                }else if(this.data && this.data.status_code==401){
                  this.loading.dismiss();
                  this.authService.logout(this.logout);
                  this.navCtrl.setRoot(HomePage);
                }
              }, (err) => {
                this.loading.dismiss();
                this.presentToast('Something wrong with request processing...');
              });
          });
          counter++;
        } 
      }, (err) => { });
    }

    takePictureFromGallery() {
      this.gallery_photo();
    }*/

    submit_photo_gallery(){
      this.showLoader();
      let porject_data = {type:this.submit_id, data_id: this.data_id, action: this.action, submit_type:'finish', keyword:localStorage.keyword, project_id:this.project_id,token:this.token};
      this.cameraService.project_submission(porject_data).then((result) => {
        this.loading.dismiss();
        this.data = result;
        //this.loading.dismiss();
        if(this.data && this.data.status_code==200){
          this.alertForLocator('Site photo uploaded successfully.', 'Success', 'Ok');
          this.navCtrl.push(ProjectdetailPage)
          .then(() => {
            this.navCtrl.remove(2, 2);
          });
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
