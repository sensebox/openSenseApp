import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private API_URL = 'https://api.opensensemap.org/boxes';
  private exposure = '?exposure=outdoor';
  private boxId = '/5a687677411a790019444133';
  private sensorId = '5a687677411a79001944413a';
  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  setBoxId(boxId){
    this.boxId = String(boxId);
  }

  setSensorId(sensorId){
    this.boxId = String(sensorId);
  }

  getData() {
    return this.http.get(`${this.API_URL}${this.exposure}`);
  }

  getSensorData() {
    let today = new Date();
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    let string = this.API_URL + this.boxId+ + '/data/' + this.sensorId + '?from-date=' + oneWeekAgo.toISOString() + '&to-date=' + today.toISOString() + '&format=json';
    console.log(string);
    return this.http.get('https://api.opensensemap.org/boxes/:593bcd656ccf3b0011791f5a/data/593bcd656ccf3b0011791f5b?from-date=2018-11-10T21:43:49.575Z&to-date=2018-11-11T21:46:12.907Z&format=json');

  }
}
