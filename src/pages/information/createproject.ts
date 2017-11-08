import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProjectdetailPage } from '../information/projectdetail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { CreateProjectService } from '../../providers/create-projects/create-projects';
import { WelcomePage } from '../welcome/welcome';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchmapPage } from '../searchmap/searchmap';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import * as $ from 'jquery'
/**
 * Generated class for the InformationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-createproject',
  templateUrl: 'createproject.html',
})


export class CreateprojectPage {
  loading: any;
  projectData = { name:'', address:'', description:'', token:'', user_id:''};
  data: any;
  token:string;
  user_id:any;
  user_detail:{};
  createProjectForm: FormGroup;
  map:any;
  public autocompleteItems;
  public autocomplete;
  public service = new google.maps.places.AutocompleteService();
  private logout:any;
  public lang_arr:any;
  lang = {
    "create_project":"Create Project",
    "project_name" : "Project Name",
    "desc" : "Description",
    "address" : "Address",
    "map" : "Map"

  };
  @ViewChild('map') mapElement: ElementRef;

  constructor(public authService: AuthService, public viewCtrl: ViewController, public modalCtrl: ModalController, public navCtrl: NavController , 
    public loadingCtrl: LoadingController, private zone: NgZone, private alertCtrl: AlertController, public formdata: FormBuilder, public projectService: CreateProjectService) {
     // this.check_auth();) 
     this.token = localStorage.token;
     this.user_id = localStorage.id;
     this.createProjectForm = this.formdata.group({
      project: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      address: ['', [Validators.required]],
      token: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      autocompleted: ['']
    });

    this.autocompleteItems = [];
    this.autocomplete = {query: ''};
  }


  alertForLocator(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  modal_map(){
    let myModal = this.modalCtrl.create(SearchmapPage);

    myModal.onDidDismiss(item => {
         this.projectData['address'] = item.address; 
         this.projectData['lat'] = item.lat; 
         this.projectData['lng'] = item.lng; 
    }); 

    myModal.present();
  }

  loadMap(){
      let latLng = new google.maps.LatLng(30.727610499999994, 76.8466372);
      let mapOptions = {
        zoom: 13,
        center:latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: ['IND','SGP','US']} }, function (predictions, status) {
      
      me.autocompleteItems = []; 
      me.zone.run(function () { 
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }


  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }


  save() {
    this.projectData['token'] = localStorage.token;
    this.showLoader();
    this.projectService.saveProject(this.projectData).then((result) => {
      this.loading.dismiss();
      this.data = result;
      if(this.data && this.data.status_code==200){
          this.alertForLocator('Success','Project created successfully');
          this.navCtrl.push(WelcomePage)
          .then(() => {
            this.navCtrl.remove(1, 3);
          });
      }else if(this.data && this.data.status_code==401){
        this.loading.dismiss();
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.loading.dismiss();
      this.alertForLocator('Error','Error in web api. Try later.');
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }

  project_detail(){
      this.navCtrl.push(ProjectdetailPage);
  }


}
