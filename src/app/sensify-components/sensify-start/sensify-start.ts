import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { Geolocation, GeolocationOptions, Geoposition } from "@ionic-native/geolocation";
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SenseBox, Settings } from '../../../providers/model';

@Component({
    selector: 'sensify-page-start',
    templateUrl: 'sensify-start.html',
})
export class SensifyStartPage {

    // TODO: add Input metadata
    @Input()
    public settings: Settings;

    currBox: SenseBox;
    
    currentPos: Geoposition;


    constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {

        platform.ready().then(() => {
            this.geolocation.getCurrentPosition().then((pos: Geoposition) => {
                this.api.getClosestSenseBoxes(pos.coords).subscribe(boxes => {
                    this.currBox = this.api.getclosestSenseBoxTest(boxes, pos.coords)
                    console.log(this.currBox)
                });
            }).catch(e => {
                console.log(e);
            });
        }).catch(e => {
            console.log(e);
        });

        // TODO: take mySenseBox from metadata.settings and not from API request again
        // this.currBox = this.metadata.settings.mySenseBox ? this.metadata.settings.mySenseBox : this.api.getclosestSenseBoxTest(boxes, pos.coords);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifyStartPage');
    }
}
