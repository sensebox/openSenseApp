import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  aboutlists: any;
  constructor(public navCtrl: NavController, public data: DataProvider) {
  }

  ionViewDidLoad() {
    this.aboutlists = this.data.lists;
  }

  itemClicked(item):void{
    this.navCtrl.push('InfoPage', item);

  }
    

}
