import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StackholderinformationPage } from '../information/stackholderinformation';
import { SubmitphotoPage } from '../information/submitphoto';
import { ProjectService} from '../../providers/project-service/project-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';


/**
 * Generated class for the InformationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-projectdetail',
  templateUrl: 'projectdetail.html',
})
export class ProjectdetailPage {
  
  @ViewChild('map') mapElement: ElementRef;

  public project_id:any;
  public map: any;
  public token:any;
  public data:any;
  private logout:any;
  public project_detail:any;
  public project_detail_length: Number;
  public project_name:any;
  public sign_board_status = 0;
  public priority = 0;
  public wanted_information:any;
  public wanted_information_len = 0;
  public distance:any;
  public site_photo1:any;
  public site_photo1_ml:any;
  public lang_type:any;
  public lang_arr:any;
  lang = {
    "project_details" : "Project Details",
    "wanted_info" : "Wanted Information",
    "top_priority" : "Top Priority",
    "what_to_submit": "Select what to submit",
    "site_photo" : "Site Photo",
    "project_list" : "Project List Photos",
    "sign_board" : "Signboard Photo",
    "stack_info" : "Stakeholder Information",
    "not_applicable":"Not applicable" 

  };
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public authService: AuthService, public projectService: ProjectService, public geolocation: Geolocation, public navParams: NavParams) {
    
    
    this.token = localStorage.token;
    this.project_id = localStorage.project_id;
  }

  ngAfterViewInit() {
    console.log("Map project detail");
    let userlatlng = JSON.parse(localStorage.getItem('user_lat_lng'));
    let lat_lng_token = {lat:userlatlng.lat, lng:userlatlng.lng, token:this.token, project_id:this.project_id};
    this.site_photo1 = "Site Photo";
    this.site_photo1_ml = "Foto Tapak";
    this.projectService.get_single_project(lat_lng_token).then((result) => {
      this.data = result;
      if(this.data && this.data.status_code==200){
        this.project_detail = this.data.response.detail;     
        this.addMarker(this.data.response.detail[0]);
        this.project_name = this.data.response.detail[0].name;
        this.sign_board_status = this.data.response.detail[0].enabled;
        this.priority = this.data.response.detail[0].priority;
        this.distance = this.data.response.detail[0].distance;
        this.wanted_information = this.data.response.detail[0].wanted_information;
        this.wanted_information_len = this.data.response.detail[0].wanted_information.length;
      }else if(this.data && this.data.status_code==401){
        this.authService.logout(this.logout);
        this.navCtrl.setRoot(HomePage);
      }
    });

    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.viewCtrl.setBackButtonText(this.lang_arr.back);
      this.lang = this.lang_arr;
      this.lang_type = localStorage.language_code;
      });
    }
  }




  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  addMarker(map_data){

        var marker_icon = 'http://dev614.trigma.us/ionic-projects/icon/near-locations.png'; 
        let latLng = new google.maps.LatLng(map_data['latitude'], map_data['longitude']);
        let mapOptions = {
          zoom: 13,
          center:latLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(map_data['latitude'], map_data['longitude']),
          map: this.map,
          icon: marker_icon
        });
        let content = "<h6>"+map_data['name']+"</h6><strong>"+map_data['distance']+" km away from you</strong>";          
        this.addInfoWindow(marker, content);


      
  }

  site_photo(submit_id, title){
    this.navCtrl.push(SubmitphotoPage,{
      submit_id:submit_id,
      submit_title:title,
      project_id:this.project_id,
      project_name:this.project_name,
      distance:this.distance
    });
  }


  stackholder_information(){
    this.navCtrl.push(StackholderinformationPage,{
      project_id:this.project_id,
      project_name:this.project_name,
      distance:this.distance
    });
  }

}
