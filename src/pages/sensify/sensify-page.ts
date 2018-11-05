import { ApiProvider } from '../../providers/api/api';
import { Location, Settings } from '../../providers/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from "@ionic-native/geolocation";



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
    public settings: Settings;
    currentPos: Geoposition;

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private geolocation: Geolocation) {
        // TODO: check for localStorage
        this.settings = {
            gps: true,
            radius: 20,
            ranges: {
                temperature: 5
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifyPage');
        this.tabSelector = 'start';
        this.getUserPosition();
    }

    public changeTab(tab) {
        console.log(tab);
        this.tabSelector = tab;
    }

    public setSettings(settings: Settings) {
        console.log(settings);
        // TODO: adapt localStorage with new settings
    }

    /**
     * ##############################
     * Positioning
     * ##############################
     */

    // Get the current location
    getUserPosition() {
        // TODO: check if this.settings.gps === true
        this.geolocation.getCurrentPosition()
            .then((pos: Geoposition) => {
                this.settings.location = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            })
    }

    // Watch the user position
    subscription = this.geolocation.watchPosition()
        .subscribe(pos => {
            let location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }
            // necessary to re-define this.settings to trigger ngOnChanges in sensify.map.ts
            this.settings = {
                location: location,
                radius: this.settings.radius,
                ranges: this.settings.ranges,
                gps: this.settings.gps
            }
        });

    // TODO: getClosestSenseBoxes (only in sensify-page.ts) & set metadata.closestSenseBoxes


}