import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'sensify-page-about',
  templateUrl: 'sensify-about.html',
})
export class SensifyAboutPage {
  newRadius : any;
  newValidationRange : any;
  newSenseboxID : any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyAboutPage');
  }

  //TODO
  //-save inputs in other variables on button press so that they dont vanish when switching between tabs
  //-show current settings in the fields
  //-Think about other setting options that we need
  test(){
    alert("radius:"+this.newRadius+",       validationRange:"+this.newValidationRange+",        SenseBoxID:"+this.newSenseboxID)
  }

}
