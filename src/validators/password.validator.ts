import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirm_password = AC.get('confirm_password').value; // to get value in input tag
        if(password != confirm_password) {
            console.log('false');
            AC.get('confirm_password').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}