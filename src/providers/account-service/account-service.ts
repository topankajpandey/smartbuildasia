import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {App} from "ionic-angular/index";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Rx"



@Injectable()
export class AccountService {

  private apiUrl = 'http://35.154.215.19/sba/public/';
  constructor(private app:App,public http: Http) {

  }

  
  profile_edit(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.apiUrl+'edit_profile', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }


}