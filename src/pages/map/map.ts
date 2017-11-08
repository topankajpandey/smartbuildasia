import { Component, ViewChild, ElementRef, NgZone, Directive } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { CreateprojectPage } from '../information/createproject';
import { Nav, AlertController  } from 'ionic-angular';
import { InformationPage } from '../information/information';
import { ProjectdetailPage } from '../information/projectdetail';
import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from '../../providers/map-service/map-service';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import * as $ from 'jquery' 


declare var google;

@IonicPage() 
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;

  public map: any;
  public data: any;
  private logout:any;
  public projectList: {};
  public projectlength: number;
  public autocompleteItems;
  public autocomplete;
  public service = new google.maps.places.AutocompleteService();
  public loading: any;
  public geo_results:any;
  public token:string;
  public area_covered = 0; ;
  public countSwipeUp: number = 0;
  public countSwipeDown: number = 0;
  public lang_arr:any;
  lang = {
    "give_info":	"Give Information",
    "projects_with" : "PROJECTS WITHIN",
    "search_for_address": "Search for address",
    "top_priority":"Top Priority",
    "no_priority":"No Priority",
    "project_found": "Projects Found"
  };
  public user_lat = '1.283850';
  public user_lng = '103.844743';
  public total_count_project:Number;
  public userlatlng:any;
  public user_marker_pin = 'http://dev614.trigma.us/ionic-projects/icon/location-pin.png';
  public project_marker_pin = 'http://dev614.trigma.us/ionic-projects/icon/near-locations.png';
  public search_location_pin = 'http://dev614.trigma.us/ionic-projects/icon/search_location_pin.png';
  constructor(public viewCtrl: ViewController, public authService: AuthService, private alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public mapService: MapService,  public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private zone: NgZone) {

    this.autocompleteItems = [];
    this.autocomplete = {query: ''};
    this.token = localStorage.token;
    //this.area_covered = localStorage.area_covered;
    //let lat_lng_token = {lat:this.user_lat, lng:this.user_lng, token:this.token};
    this.userlatlng = JSON.parse(localStorage.getItem('user_lat_lng'));
    this.clear_data();
  }

  clear_data(){
    localStorage.removeItem('action');
    localStorage.removeItem('data_id');
    localStorage.removeItem('project_id');
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  chooseItem(address: any) {
    $( ".search_item" ).slideUp( "slow" );
    this.autocompleteItems = [];
    this.autocomplete = {query: ''};
    var geo_addr = address.split(' ').join('+');
    this.showLoader();
    
    /* get lat long by adress*/
    this.mapService.get_lat_lng(geo_addr).then((result) => {
        this.geo_results = result;
        let lat = this.geo_results.results[0].geometry.location.lat;
        let lng = this.geo_results.results[0].geometry.location.lng;
        let zoom_level = localStorage.zoom_level;
        let latLng = new google.maps.LatLng(lat, lng);
        let mapOptions = {
          zoom:Number(zoom_level), 
          center:latLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       
        var marker_icon = this.search_location_pin;
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: this.map,
          icon: marker_icon
        });
        this.addInfoWindowSearchedLocation(marker, 'Curent searched location');

        let send_input_address = {address:address, token:this.token, lat:this.userlatlng.lat, lng:this.userlatlng.lng};
        this.mapService.get_project(send_input_address).then((result) => {
          this.data = result;
          this.loading.dismiss();
          if(this.data && this.data.status_code==200){
            let test = this.data.response.detail;
            this.projectList = this.data.response.detail;
            this.projectlength = this.data.response.detail.length;      
            this.total_count_project = this.projectlength - 1;   
            this.addMarker(this.projectList);
          }else if(this.data && this.data.status_code==401){
            this.authService.logout(this.logout);
            this.navCtrl.setRoot(HomePage);
          }else{
            this.projectList = {};
            this.projectlength = 0;
          }
        }, (err) => {
          this.loading.dismiss();
          this.presentToast(err);
        });
      
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }
  
  updateSearch() {
    $( ".search_item" ).slideUp( "fast" );
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: ['IND','SGP','MYS']} }, function (predictions, status) {
      
      me.autocompleteItems = []; 
      me.zone.run(function () { 
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

   alertForLocator() {
    let alert = this.alertCtrl.create({
      title: 'GPS Error',
      subTitle: 'Need to enable GPS service',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ngAfterViewInit() {
      
      $( ".search_item" ).slideUp( "fast" );
      this.loadMap();
      
      let lat_lng_token = {lat:this.userlatlng.lat, lng:this.userlatlng.lng, token:this.token};
      this.showLoader();
      this.mapService.get_project(lat_lng_token).then((result) => {
        this.data = result;
          if(this.data && this.data.status_code==200){
            this.loading.dismiss(); 
            //this.map = this.data.response.detail;
            this.projectList = this.data.response.detail;
            this.area_covered = this.data.response.area;
            this.projectlength = this.data.response.detail.length;
            this.total_count_project = this.projectlength - 1;
            this.addMarker(this.data.response.detail);
          }else if(this.data && this.data.status_code==401){
            this.loading.dismiss(); 
            this.authService.logout();
            this.navCtrl.setRoot(HomePage);
          }else{
            this.loading.dismiss();
          }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast(err);
      });

      if(localStorage.language_code){
        let language_code = localStorage.language_code;
        this.authService.get_lang(language_code).then((result) => {
        this.lang_arr = result; 
        this.viewCtrl.setBackButtonText(this.lang_arr.back);
        this.lang = this.lang_arr;
        });
      }

  }

  loadMap(map_data=false){
    
      let zoom_level = localStorage.zoom_level;
      let latLng = new google.maps.LatLng(this.userlatlng.lat, this.userlatlng.lng);
      let mapOptions = {
        zoom: Number(zoom_level),
        center:latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addInfoWindow(marker, content, window_id){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      
      //infoWindow.open(this.map, marker);

      $(".show_all").hide();
      $(".show_single").show().html(content);

      $("#"+window_id).click( () =>{
        let project_id = $("#"+window_id).attr('title');
        this.check_info(project_id);
      });
      
    });
  }

  addInfoWindowCurrentUser(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  addInfoWindowSearchedLocation(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  show_single_project(){
    return '<ion-item class="bt-nl item item-block item-md" ion-item="" item-right=""><div class="item-inner"><div class="input-wrapper"><ion-label class="label label-md"><span class="range" item-left="">0.87 km</span><p class="loc-det">Project Name (mansa devi complex)<br><span class="tags mrTop">Top Priority</span></p><ion-icon name="ios-arrow-forward" role="img" class="icon icon-md ion-ios-arrow-forward item-icon" aria-label="arrow forward" ng-reflect-name="ios-arrow-forward"></ion-icon></ion-label></div></div><div class="button-effect"></div></ion-item>';
  }


  addMarker(map_data){
    console.log(map_data);
    if(map_data){      
      for (let i = 0; i < map_data.length; i++) {
        if(map_data[i]['id']==0){
          var marker_icon = this.user_marker_pin; 
        }else{
          var marker_icon = this.project_marker_pin; 
        }
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(map_data[i]['latitude'], map_data[i]['longitude']),
            map: this.map,
            icon: marker_icon,
            optimized: false
          });
          let id = map_data[i]['id'];
          //let content = "<h6 id='project_detail_"+map_data[i]['id']+"' class='"+map_data[i]['id']+"'>"+map_data[i]['name']+"</h6><strong>"+map_data[i]['distance']+" km away from you</strong>";          
          if(map_data[i]['id']!=0){
            let content = '<ion-item class="bt-nl item item-block item-md" ion-item=""><div id="project_detail_'+map_data[i]['id']+'" title="'+map_data[i]['id']+'" class="item-inner"><div class="input-wrapper"><ion-label class="label label-md"><span class="range" item-left="">'+map_data[i]['distance']+' KM</span><p class="loc-det">'+map_data[i]['name']+'<br><span class="tags mrTop">Top Priority</span></p><ion-icon name="ios-arrow-forward" role="img" class="icon icon-md ion-ios-arrow-forward item-icon" aria-label="arrow forward" ng-reflect-name="ios-arrow-forward"></ion-icon></ion-label></div></div><div class="button-effect"></div></ion-item>';
            this.addInfoWindow(marker, content, 'project_detail_'+map_data[i]['id']);
          }else{
            this.addInfoWindowCurrentUser(marker, 'You are here');
          }
      }
    }
  }
  
  create_project(){
    this.navCtrl.push(CreateprojectPage);
  }


  check_info(project_id){
    $(".give-info").show();
    $(".give_info_after").hide();
    $( ".search_item" ).slideUp( "fast" );
    localStorage.setItem('project_id', project_id);
    this.navCtrl.push(ProjectdetailPage);
    
  }

  give_info(){
    $(".give-info").hide();
    $(".give_info_after").show();
    $( ".search_item" ).slideDown( "fast" );
    
  }

  give_info_after(){
    $(".give-info").show();
    $(".give_info_after").hide();
    $( ".search_item" ).slideUp( "fast" );
  }

}
