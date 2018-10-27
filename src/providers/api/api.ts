import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Location {
  latitude : number;
  longitude : number;
}

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private API_URL = 'https://api.testing.opensensemap.org'

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }


  getData(){
    return this.http.get(`${this.API_URL}/boxes/5b0d436fd40a290019ef444d`);
  }
  
  getSenseBoxes(){
    return this.http.get(`${this.API_URL}/boxes?exposure=outdoor,mobile,unknown`); 
  }

  getAllSenseBoxes(): any {
    return this.http.get(`${this.API_URL}/boxes?exposure=outdoor,unknown`);
  }

  public calculateDistance(userLocation : Location, senseBoxLocation : Location) {
    // Deg --> Rad
    let lat1 = userLocation.latitude*Math.PI/180;
    let lat2 = senseBoxLocation.latitude*Math.PI/180;
    let lng1 = userLocation.longitude*Math.PI/180;
    let lng2 = senseBoxLocation.longitude*Math.PI/180;
    // distance calculation:
    let cosG = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    let dist = 6378.388 * Math.acos(cosG);
    return dist;
};
}
