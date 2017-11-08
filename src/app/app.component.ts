
import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, Platform, MenuController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HomeService} from './services/home.service';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { SubmissionPage } from '../pages/submission/submission';
import { ReferalPage } from '../pages/referal/referal';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TermsPage } from '../pages/terms/terms';
import { HowitworkPage } from '../pages/howitwork/howitwork';
import { WelcomePage } from '../pages/welcome/welcome';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { MapPage } from '../pages/map/map';
import { LanguagePage } from '../pages/language/language';
import { AuthService } from '../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SignupPage } from '../pages/signup/signup';
import { OneSignal } from '@ionic-native/onesignal';
import { TranslateService } from '@ngx-translate/core';
//import {Push,PushToken } from '@ionic/cloud-angular';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';



@Component({
  templateUrl: 'app.html',
  //templateUrl: '../pages/my-profile/app.html'

})
 
export class MyApp {
  @ViewChild(Nav) nav: Nav;
    rootPage:any = HomePage;
    pages: Array<{title: string, component: any}>;
    footerpages: Array<{title: string, component: any}>;
    login_username: any;
    public user_profile:any;
    public user_profile_pic:any;
    public redeemed_amount:any;
    public referraldata:any;
    public home_page = 'Home';
    public my_submissions = 'My Submissions';
    public my_referrals = 'My Referrals';
    public how_it_works = 'How it Works';
    public language = 'Language';
    public log_out = "Logout";
    @ViewChild(Nav) navChild:Nav;
    constructor( public oneSignal: OneSignal, public menuCtrl: MenuController, private diagnostic: Diagnostic, private deeplinks: Deeplinks, private alertCtrl: AlertController, public events: Events, private storage: Storage, public platform: Platform, public authService: AuthService, public statusBar: StatusBar, public splashScreen: SplashScreen) {
      
     
      this.initializeApp();

      events.subscribe('user:login', (user, photo, redeem, pending) => {
        this.user_profile = user;
        this.user_profile_pic = photo;
        this.redeemed_amount = redeem;
      });

      events.subscribe('user:changerTop', (home_page, my_submissions, my_referrals, how_it_works, language) => {
        this.home_page = home_page;
        this.my_submissions = my_submissions;
        this.my_referrals = my_referrals;
        this.how_it_works = how_it_works;
        this.language = language;

        this.pages = [
          { title: this.home_page, component: WelcomePage },   
          { title: this.my_submissions, component: SubmissionPage },
          { title: this.my_referrals, component: ReferalPage },
          { title: this.how_it_works, component: HowitworkPage },
          { title: this.language, component: LanguagePage },
        ];
  
      });

      events.subscribe('user:changerBottom', (terms_and_conditions, contact_us, log_out) => {
 
        this.footerpages = [
          { title: terms_and_conditions, component: TermsPage },
          { title: contact_us, component: ContactPage },
        ];

        this.log_out = log_out;
  
      });

      this.pages = [
        { title: this.home_page, component: WelcomePage },   
        { title: this.my_submissions, component: SubmissionPage },
        { title: this.my_referrals, component: ReferalPage },
        { title: this.how_it_works, component: HowitworkPage },
        { title: this.language, component: LanguagePage },
      ];

      
      this.footerpages = [
          { title: 'Terms and Conditions', component: TermsPage },
          { title: 'Contact Us', component: ContactPage },
          
      ];

      
   } 



   push_notification_android(){
    
    this.oneSignal.startInit('32e1c127-942a-46b9-abca-f11a81d8ffe0', '703322744261');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      //this.nav.setRoot(SignupPage);
    });
    this.oneSignal.handleNotificationOpened().subscribe(() => {
      this.nav.setRoot(WelcomePage);
    });

    this.oneSignal.endInit();

   }


   alertForLocator(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }

   initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.deeplinks.routeWithNavController(this.navChild, {
        '/about-us': SignupPage
        
      }).subscribe( (match) =>{
        this.referraldata = JSON.stringify(match.$args.referral);
        localStorage.setItem('referraldata', this.referraldata);
        this.nav.setRoot(SignupPage);


      }, (noMatch) => {

      });

      if (this.platform.is('android') || this.platform.is('ios')) {
        this.diagnostic.requestLocationAuthorization();
        this.diagnostic.requestCameraAuthorization();
      }

      if (this.platform.is('android')) {
        this.push_notification_android();
      }

    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
 
  logout(){

    /*this.events.publish('user:changerTop',
      this.lang_arr.home_page,
      this.lang_arr.my_submissions,
      this.lang_arr.my_referrals,
      this.lang_arr.how_it_works,
      this.lang_arr.language,
    );*/

    this.menuCtrl.enable(false);
    this.authService.logout();
    this.nav.setRoot(HomePage);

  }

   myprofile(){
    this.nav.setRoot(MyProfilePage);
  }

  
}
