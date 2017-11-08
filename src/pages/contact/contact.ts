import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public lang_arr:any;
  lang = {
    "contact":"Contact Us",
    "contact_heading1" : "Please contact us",
    "contact_heading2" : "for any problem",
    "feedback1" : "We will be happy to have your feedback",
    "feedback2" : "to improve the App",
    "call" : "Call Us",
    "email" : "Email"   
  };
  constructor(public navCtrl: NavController,public authService: AuthService) {
    this.clear_data();
  }

  ionViewDidLoad() {
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }

  clear_data(){
    localStorage.removeItem('action');
    localStorage.removeItem('data_id');
    localStorage.removeItem('project_id');
  }

}
