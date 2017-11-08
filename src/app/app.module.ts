
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OneSignal } from '@ionic-native/onesignal';
import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file'; 
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path'; 
import { Camera } from '@ionic-native/camera'; 

//import { TranslateModule,  } from '@ngx-translate/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/*
* Import components and pages
* Import related modeule
*/ 
 


import { HomePage } from '../pages/home/home';
import { SubmissionPage } from '../pages/submission/submission';
import { SubmissiondetailPage } from '../pages/submission/submissiondetail';
import { ReferalPage } from '../pages/referal/referal';
import { ReferfriendPage } from '../pages/referfriend/referfriend';
import { SignupPage } from '../pages/signup/signup';
import { WelcomePage } from '../pages/welcome/welcome';
import { InformationPage } from '../pages/information/information';
import { CreateprojectPage } from '../pages/information/createproject';
import { ProjectdetailPage } from '../pages/information/projectdetail';
import { StackholderinformationPage } from '../pages/information/stackholderinformation';
import { SubmitphotoPage } from '../pages/information/submitphoto';
import { EditsubmissionPage } from '../pages/editsubmission/editsubmission';
import { EditstackholderPage } from '../pages/editstackholder/editstackholder';

import { MyProfilePage } from '../pages/my-profile/my-profile';
import { EditprofilePage } from '../pages/my-profile/editprofile'; 
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { MymoneyPage } from '../pages/mymoney/mymoney';
import { ContactPage } from '../pages/contact/contact';
import { TermsPage } from '../pages/terms/terms';
import { HowitworkPage } from '../pages/howitwork/howitwork';
import { ConsultantPage } from '../pages/consultant/consultant';
import { MapPage } from '../pages/map/map';
import { SearchmapPage } from '../pages/searchmap/searchmap';
import { LanguagePage } from '../pages/language/language';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation'; 
import { LocationAccuracy } from '@ionic-native/location-accuracy'; 
import { Base64 } from '@ionic-native/base64';
import { AuthService } from '../providers/auth-service/auth-service';
import { MapService } from '../providers/map-service/map-service';
import { ProjectService } from '../providers/project-service/project-service';
import { CameraService } from '../providers/camera-service/camera-service';
import { AccountService } from '../providers/account-service/account-service';
import { CreateProjectService } from '../providers/create-projects/create-projects';
import { TestingProvider } from '../providers/testing/testing';
import { IonicStorageModule } from '@ionic/storage';
import { SubmissionService } from '../providers/submission-service/submission-service';
import { ImagePicker } from '@ionic-native/image-picker'; 
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';   
import { SocialSharing } from '@ionic-native/social-sharing'; 
import { Deeplinks } from '@ionic-native/deeplinks';


/*export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}*/



@NgModule({
  declarations: [
      MyApp,
      HomePage,
      SubmissionPage,
      SubmissiondetailPage,
      ReferalPage,
      ContactPage,
      SignupPage,
      WelcomePage,
      InformationPage,
      CreateprojectPage,
      ProjectdetailPage,
      StackholderinformationPage,
      TermsPage,
      HowitworkPage,
      SubmitphotoPage,
      EditsubmissionPage,
      EditstackholderPage,
      TabsPage,
      MyProfilePage,
      MymoneyPage,
      EditprofilePage,
      ForgotPasswordPage,
      ReferfriendPage,
      ConsultantPage,
      MapPage,
      SearchmapPage,
      LanguagePage
  ],

  imports: [
    BrowserModule,
    HttpModule,
    //CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(MyApp, {
        backButtonText: 'Back',
        backButtonIcon:'arrow-back',
        iconMode: 'ios',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'bottom',
        pageTransition: 'ios-transition'
      }
    ),
    IonicStorageModule.forRoot()
    /*TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })*/
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SubmissionPage,
    SubmissiondetailPage,
    ReferalPage,
    ContactPage,
    SignupPage,
    WelcomePage,
    InformationPage,
    CreateprojectPage,
    ProjectdetailPage,
    StackholderinformationPage,
    TermsPage,
    HowitworkPage,
    SubmitphotoPage,
    EditsubmissionPage,
    EditstackholderPage,
    TabsPage,
    MyProfilePage,
    MymoneyPage,
    EditprofilePage,
    ForgotPasswordPage,
    ReferfriendPage,
    ConsultantPage,
    MapPage,
    SearchmapPage,
    LanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Diagnostic,
    File,
    Transfer,
    Camera,
    FilePath,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    AuthService, 
    MapService, 
    ProjectService,
    CameraService,
    AccountService,
    TestingProvider,
    CreateProjectService,
    SubmissionService,
    ImagePicker,
    Base64,
    NativePageTransitions,
    SocialSharing,
    Deeplinks,
    NativePageTransitions,
    OneSignal,
    //Push,
    FCM
  ]
})
export class AppModule {

}


