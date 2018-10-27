import { ApiProvider, Location } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SenseBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sense-box',
  templateUrl: 'sense-box.html',
})
export class SenseBoxPage {

  boxData: any;
  allBoxes: any;
  closesz
  closestBoxes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenseBoxPage');
  }

  getData(){
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
    })

  }

  getSenseBoxes(){
    this.api.getSenseBoxes().subscribe(res => {
      console.log(res);
      this.allBoxes = res;
    })
  }

  getClosestSenseBox(){
    let myLocation : Location = {
      longitude : 7.6261347, 
      latitude : 51.9606649
    }
    let closestSenseBoxes = [];
    this.api.getAllSenseBoxes().subscribe(res => {
      let allBoxes : any = res;
      allBoxes.forEach(element => {
        let boxLocation : Location = {
          latitude : element.currentLocation.coordinates[1], 
          longitude : element.currentLocation.coordinates[0]
        };
        let distance : number = this.api.calculateDistance(myLocation, boxLocation);
        if (distance <= 50) {
          closestSenseBoxes.push(element);
        }
      });
       
      this.closestBoxes = closestSenseBoxes;
      console.log(this.closestBoxes);
     
    });

  }
}
