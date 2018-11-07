import { ApiProvider } from '../../providers/api/api';
import { Metadata, SenseBox } from '../../providers/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import * as L from "leaflet";


@IonicPage()
@Component({
    selector: 'sensify-page',
    templateUrl: 'sensify-page.html',
})
export class SensifyPage {

    public metadata: Metadata;

    tab: String;
    tabSelector: String;
    start: boolean;
    map: boolean;
    about: boolean;
    currentPos: Geoposition;

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private geolocation: Geolocation) {
        // TODO: check for localStorage
        this.metadata = {
            settings : {
                gps: true,
                radius: 20,
                ranges: {
                temperature: 5
                }
            }
        }
        this.getUserPosition().then(
            res => {
                console.log('res: ' + res);
                if ('res 1: ' + res) {
                    this.setClosestSenseboxes().then(res2 => {
                        console.log('res 2: ' + res2);
                        if (res2) {
                            this.setClosestSensebox();
                        }
                    })
                }
            }
        );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifyPage');
        this.tabSelector = 'start';
    }

    public changeTab(tab) {
        this.tabSelector = tab;
    }

    public setMetadata(metadata: Metadata) {
        console.log(metadata);
        // TODO: adapt localStorage with new settings
    }

    /**
     * ##############################
     * Positioning
     * ##############################
     */

    // Get the current location
    getUserPosition(): Promise<boolean> {
        // TODO: check if this.settings.gps === true
        return this.geolocation.getCurrentPosition()
            .then((pos: Geoposition) => {
                this.metadata.settings.location =  new L.LatLng(pos.coords.latitude, pos.coords.longitude);
                return true;
            }, (error) => {
                return false;
            });
    }

    // Watch the user position
    subscription = this.geolocation.watchPosition()
        .subscribe(pos => {
            let location = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
            // necessary to re-define this.settings to trigger ngOnChanges in sensify.map.ts
            this.metadata = {
                settings: {
                    location: location,
                    radius: this.metadata.settings.radius,
                    ranges: this.metadata.settings.ranges,
                    gps: this.metadata.settings.gps
                }

            }
        });
    

    // Search the nearest senseBoxes
    setClosestSenseboxes() {
        return new Promise(resolve => {
            this.api.getClosestSenseBoxes(this.metadata.settings.location, this.metadata.settings.radius).subscribe(res => {
                this.metadata.senseBoxes = res;
                resolve(true);
            });
        })
    }


    // Find the nearest senseBox
    setClosestSensebox() {
        let closestBox: SenseBox = this.api.getclosestSenseBox(this.metadata.senseBoxes, this.metadata.settings.location);
        this.metadata = {
            settings: this.metadata.settings,
            senseBoxes: this.metadata.senseBoxes,
            closestSenseBox: closestBox
        }
        //Test for Validation!!! Can be called from anywhere via API
        this.api.validateSenseBoxTemperature(this.metadata.closestSenseBox, this.metadata.senseBoxes, this.metadata.settings.ranges.temperature);
    }

    // TODO: getClosestSenseBoxes (only in sensify-page.ts) & set metadata.closestSenseBoxes
    // this.metadata.senseBoxes = this.api. requests
}