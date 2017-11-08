import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {App} from "ionic-angular/index";
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

let apiUrl = 'http://35.154.215.19/sba/public/';

@Injectable()
export class CreateProjectService {

  constructor(private app:App,public http: Http) {

  }

  saveProject(dataProject) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(apiUrl+'create_projects', JSON.stringify(dataProject), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  

}