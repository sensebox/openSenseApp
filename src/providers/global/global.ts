import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
    public radius: number = 20;      //In kilometers
    public tempRange: number = 5;    //In °Celsius
    public senseboxID: String = "";  //Personalized SenseBox ID

    constructor(public http: HttpClient) {
        console.log('Hello GlobalProvider Provider');
    }

}
