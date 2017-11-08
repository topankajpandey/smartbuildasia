import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

let apiUrl = 'http://35.154.215.19/sba/public/';
let geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY';
//ionic package build android

@Injectable()
export class MapService {

  constructor(public http: Http) {}

  get_project(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(apiUrl+'projects_map', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  get_lat_lng(address) {
    return new Promise((resolve, reject) => {
        let geoaddress =  "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyAA5O_c-KLeIyZpC0bSSrdjepJJ2teLcyI";
        this.http.get(
          geoaddress,
        )
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  get_adddress_by_lat_lng(address) {
    return new Promise((resolve, reject) => {
        let geoaddress =  "https://maps.googleapis.com/maps/api/geocode/json?latlng="+address+"&sensor=true";
        this.http.get(
          geoaddress,
        )
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }
  



}