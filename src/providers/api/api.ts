import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private API_URL = 'https://api.opensensemap.org/boxes/';
  private boxId ='5a687677411a790019444133';

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }


  getData(){
    return this.http.get(`${this.API_URL} ${this.boxId}`);
  }

}
