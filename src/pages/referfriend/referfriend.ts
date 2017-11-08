import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ReferfriendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-referfriend',
  templateUrl: 'referfriend.html',
})
export class ReferfriendPage {
    public ref_msg = "";
    referral = "";
    referral_rewared_prize = "";
    ref_url = "https://play.google.com/store/apps/details?id=io.ionic.smartbuildasia";
    public lang_arr:any;
    lang = {
      "refer_friend" : "Refer a Friend",
      "earnby" : "Earn by",
      "referring": "referring",
      "code" : "Use this Code",
      "code_desc1" : "Refer a friend and be rewarded for that!",
      "code_desc2" : "When your friend submits the information for",
      "code_desc3" : "a first time, gain",
      "msgnr" : "Messenger",
      "more" : "More"	
    };
    constructor(private socialSharing: SocialSharing, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
      this.referral = localStorage.referral_code;
      this.ref_msg = "Sign Up for Smart Buils Asia and get a attractive referral bonus with this code "+this.referral;
      this.referral_rewared_prize = localStorage.referral_rewared_prize;
    
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferfriendPage');
    if(localStorage.language_code){
      let language_code = localStorage.language_code;
      this.authService.get_lang(language_code).then((result) => {
      this.lang_arr = result; 
      this.viewCtrl.setBackButtonText(this.lang_arr.back);
      this.lang = this.lang_arr;
      });
    }
  }

  
  facebook_share(){
    this.socialSharing.shareViaFacebook(this.ref_msg,  "", this.ref_url).
    then(() => {
    }).catch(() => {
    });
  }

  whatsapp_share(){ 
    let ref_msg = "*Sign Up for Smart Buils Asia and get a attractive referral bonus with this code* *_"+this.referral+"_*";
    this.socialSharing.shareViaWhatsApp(ref_msg,  "", this.ref_url).
    then(() => {
    }).catch(() => {
    });
  }
  more_share(){
    this.socialSharing.share(this.ref_msg,  "SBA REFERRAL", "", this.ref_url).
    then(() => {
    }).catch(() => {
    });
  }

}
