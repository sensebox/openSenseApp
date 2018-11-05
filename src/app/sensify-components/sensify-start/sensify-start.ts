import { Component, Input, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { Geolocation, GeolocationOptions, Geoposition } from "@ionic-native/geolocation";
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { SenseBox, Metadata } from '../../../providers/model';

@Component({
    selector: 'sensify-page-start',
    templateUrl: 'sensify-start.html',
})
export class SensifyStartPage implements OnChanges {

    @Input()
    public metadata: Metadata;

    currBox: SenseBox;

    constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
        // this.currBox = this.metadata.closestSenseBox;

        // TODO: take mySenseBox from metadata.settings and not from API request again
        // this.currBox = this.metadata.settings.mySenseBox ? this.metadata.settings.mySenseBox : this.api.getclosestSenseBoxTest(boxes, pos.coords);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifyStartPage');
    }
    
    ngOnChanges(changes) {
        //if (changes.metadata && changes.metadata.currentValue.closestSenseBox) {
        if (changes.metadata.currentValue.closestSenseBox) {
            this.currBox = this.metadata.closestSenseBox;
        }
    }
}
