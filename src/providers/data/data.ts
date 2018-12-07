import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DataProvider {
  lists: any = [
    {itemName: 'APP',
    
    size: 'weather app',


  
  },
    {itemName: 'VERSION',
    
    size: '1.0.0'
       
  },
    {itemName: ' DESCRIPTION',
    
    size: 'This weather app is the mobile application supportig the major iphone and android platform. Equipped with location based technology to detect user locality, the application can automatically display the latest weather forecast for cities '
  
    
  },
    {itemName: 'FAQ',
   
    size: ' how do I manage my notifications?'
    
  },
  ];

  constructor() {
    console.log('Hello DataProvider Provider');
  }

}
