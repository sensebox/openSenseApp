import { Component, Input, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { SenseBox, Metadata } from '../../../providers/model';
import { SensifyPage } from '../../../pages/sensify/sensify-page';

@Component({
    selector: 'sensify-page-start',
    templateUrl: 'sensify-start.html',
})
export class SensifyStartPage implements OnChanges {

    @Input()
    public metadata: Metadata;
    public currBox: SenseBox;
    public date: String;
    public sunrise: String;
    public sunset: String;

    constructor(public mySensifyPage:SensifyPage,public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
        this.setCurrentDate();
        // TODO: take mySenseBox from metadata.settings and not from API request again
        this.init();

        


        // this.currBox = this.metadata.settings.mySenseBox ? this.metadata.settings.mySenseBox : this.api.getclosestSenseBoxTest(boxes, pos.coords);
        
        
        
    
    }

    public async init() {
        try {
            await this.mySensifyPage.getMetadata().then(meta => {
                this.metadata = meta;
                this.currBox= this.metadata.closestSenseBox;
            });
            await this.getSunrise("https://api.sunrise-sunset.org/json?lat=" + this.metadata.settings.location.lat + "&lng=" + this.metadata.settings.location.lng + "&date=today").then(sun => {
                this.sunrise = JSON.parse(sun).results.sunrise;
                this.sunset = JSON.parse(sun).results.sunset;
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    
getSunrise(url: string): Promise<any> {
    return new Promise<any>(
      function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.onload = function () {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };
        request.onerror = function () {
          reject(new Error('XMLHttpRequest Error: ' + this.statusText));
        };
        request.open('GET', url);
        request.send();
      });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifyStartPage');
    }
    
    setCurrentDate(){
        var currentDate = new Date()
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1 //January is 0!
        var year = currentDate.getFullYear()
        console.log(day + "." + month + "." + year);
        this.date = "Today: "+day + "." + month + "." + year;
    }

    ngOnChanges(changes) {
        if (changes.metadata.currentValue.closestSenseBox) {
            this.currBox = this.metadata.closestSenseBox;
        }
    }
}
