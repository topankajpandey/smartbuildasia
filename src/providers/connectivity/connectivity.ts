/*import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
 
declare var Connection;
 
@Injectable()
export class ConnectivityProvider {
 
  onDevice: boolean;
 
  constructor(public platform: Platform, private network: Network){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice && this.network.onConnect){
      return this.network.onConnect !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && this.network.onDisconnect){
      return this.network.onDisconnect === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
 
  watchOnline(): Observable<any> {
    return Network.onConnect();
  }
 
  watchOffline(): Observable<any> {
    return Network.onDisconnect();
  }
 
}*/