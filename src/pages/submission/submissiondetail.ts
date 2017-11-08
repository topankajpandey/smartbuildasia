import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController  } from 'ionic-angular';
import { SubmissionService } from '../../providers/submission-service/submission-service';
import { ProjectdetailPage } from '../information/projectdetail';
import { EditsubmissionPage } from '../editsubmission/editsubmission';
import { EditstackholderPage } from '../editstackholder/editstackholder';
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the SubmissiondetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submissiondetail',
  templateUrl: 'submissiondetail.html',
})
export class SubmissiondetailPage {
  //submission_tab: String;
  public submissionDetail;
  private page:any;
  public loading: any;
  public token:any;
  public data:any;
  public id:any;
  public lang_arr:any;
  //public sub_subm_type_id:String;
  lang = {
    "edit":	"Edit",
    "details" : "Details",
    "comment" : "Comment",
    "stack_info" : "Stakeholder Information",
    "company_role" : "Company Role"	,
    "comp_name" : "Company Name",
    "con_phone" : "Contact Phone Number",
    "con_name" : "Contact Name",
    "contact_email":"Contact Email",
    "visiting_card": "Visiting Card",
    "desc" : "Description",
    "not_available" : "Not Available"
  };
  public detailData:{};
  type_title:String;
  constructor(public navCtrl: NavController,public authService: AuthService, public navParams: NavParams,public loadingCtrl: LoadingController, public submission: SubmissionService) {
    this.submissionDetail = [];
    //this.submission_tab = "All";
    this.token = localStorage.token;
    this.id = navParams.get('id');
    this.type_title = navParams.get('title'); 
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmissiondetailPage');
    this.getSubmitionDetail();
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.lang = this.lang_arr;
      });
    }
  }
  

  getSubmitionDetail(){
    this.submissionDetail = [];
    this.showLoader();
    let page = 1;
    let data = {token:this.token, subm_id:this.id};
    this.submission.getSubmissionDetail(data).then(
      (result) => {
        //alert(JSON.stringify(result));
        this.loading.dismiss();
        this.data = result; 
        if(this.data && this.data.status_code==200){
          this.submissionDetail = this.data.response.detail;
          //this.sub_subm_type_id = this.data.response.detail.sub_subm_type_id;
          //console.log(this.sub_subm_type_id);
        }
      },
      (err) => { console.log('error', err) }
    )
  }

  update_detail(subm_type_id, project_id, title, submission_id, submission_title){
    //console.log("this = "+title);
    //localStorage.setItem('project_id', project_id);
    //localStorage.setItem('project_name', title);
    localStorage.setItem('data_id', submission_id);
    //localStorage.setItem('action', 'update_submission');
    //this.navCtrl.push(ProjectdetailPage);
    

    if(subm_type_id=='site_photo' || subm_type_id=='project_list_photos' || subm_type_id=='sign_board_photo' ){
      this.navCtrl.push(EditsubmissionPage, {
        project_id:project_id,
        subm_type_id:subm_type_id,
        project_name:title,
        submit_id:submission_id,
        submission_title:submission_title,
        action:'update_submission',
      });
    }else{
      this.navCtrl.push(EditstackholderPage, {
        project_id:project_id,
        subm_type_id:subm_type_id,
        project_name:title,
        submit_id:submission_id,
        submission_title:submission_title,
        action:'update_submission',
      });
    }

  }


  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: ''
    });
    this.loading.present();
  }

}
