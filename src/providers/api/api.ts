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
  private boxId ='5bb610bf043f3f001b6a4c53';
  private sat24Location = 'DE'; // https://en.sat24.com/en/freeimages
  private sat24Url ='https://api.sat24.com/animated/'+this.sat24Location+'/rainTMC/2/Central%20European%20Standard%20Time/9553668';

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }


  getData(){
    return this.http.get(`${this.API_URL} ${this.boxId}`);
  }

}
