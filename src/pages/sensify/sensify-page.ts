import { ApiProvider } from '../../providers/api/api';
import { Location } from '../../providers/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'sensify-page',
  templateUrl: 'sensify-page.html',
})
export class SensifyPage {

  tab: String;
  tabSelector: String;
  start: boolean;
  map: boolean;
  about: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensifyPage');
    this.tabSelector = 'start';

  }

  public changeTab(tab) {
    console.log(tab);
    this.tabSelector = tab;
  }
  
}