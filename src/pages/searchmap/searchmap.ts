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
/**
 * Generated class for the SearchmapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var google;
@IonicPage()
@Component({
  selector: 'page-searchmap',
  templateUrl: 'searchmap.html',
})
export class SearchmapPage {

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
    public area_covered:any;
    public resultdata:any;
    public project_marker_pin = 'http://dev614.trigma.us/ionic-projects/icon/search_location_pin.png';
    public user_lat = '1.283850';
    public user_lng = '103.844743';
    constructor(public viewCtrl: ViewController, public authService: AuthService, private alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public mapService: MapService,  public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private zone: NgZone) {
      this.autocompleteItems = [];
      this.autocomplete = {query: ''};
      this.token = localStorage.token;
      this.area_covered = localStorage.area_covered;
    }

  
  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

  cancel() {
    this.viewCtrl.dismiss({"foo" : "bar"});
  }



  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(address: any) {
    this.autocompleteItems = [];
    this.autocomplete = {query: ''};
    var get_data_address = address;
    var geo_addr = address.split(' ').join('+');

    this.mapService.get_lat_lng(geo_addr).then((result) => {
      this.geo_results = result;
      let lat = this.geo_results.results[0].geometry.location.lat;
      let lng = this.geo_results.results[0].geometry.location.lng;

      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        zoom: 13,
        center:latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      var marker_icon = this.project_marker_pin;
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: this.map,
        draggable: true,
        icon: marker_icon
      });    
      this.addMarkerInfoWindowWithoutDrag(marker,lat,lng);
      google.maps.event.addListener(marker, 'dragend', (event) => {
        lat = event.latLng.lat();
        lng = event.latLng.lng();
        this.addMarkerInfoWindow(marker,lat,lng);
      });
    }); 
  }
  
  updateSearch() {
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


  ionViewDidLoad() {
    
  }

  addMarkerInfoWindowWithoutDrag(marker,lat,lng){
    let latlng = lat+','+lng;
    this.mapService.get_adddress_by_lat_lng(latlng).then((result) => {
      this.resultdata = result;
      console.log(this.resultdata.results[0].formatted_address);
      var latlngbounds = new google.maps.LatLngBounds();
      google.maps.event.addListener(marker, 'click', (e) => {
        this.viewCtrl.dismiss({
          "address" : this.resultdata.results[0].formatted_address,
          "lat":lat,
          "lng":lng
        });
      });
    });
  }


  addMarkerInfoWindow(marker,lat,lng){
    console.log('yes');
    let latlng = lat+','+lng;
    this.mapService.get_adddress_by_lat_lng(latlng).then((result) => {
      this.resultdata = result;
      console.log(this.resultdata.results[0].formatted_address);
      google.maps.event.addListener(marker, 'click', (e) => {
        this.viewCtrl.dismiss({
          "address" : this.resultdata.results[0].formatted_address,
          "lat":lat,
          "lng":lng
        });
      });
    });
  }



}
