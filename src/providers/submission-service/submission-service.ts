import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = 'http://35.154.215.19/sba/public/';

@Injectable()
export class SubmissionService {

  constructor(public http: Http) {}

    getSubmissionList(content,page) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

        this.http.post(apiUrl+'user_submissions?page='+page, content, {headers: headers})
            .subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);
            });
        });
    }

    getSubmissionDetail(content) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            console.log(content);this.http.post(apiUrl+'view_submission', content, {headers: headers})
            .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
            });
        });
    }
}