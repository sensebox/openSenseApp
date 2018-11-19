import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Metadata } from '../../../providers/model';
import { AlertController } from 'ionic-angular';

import { SensifyPage } from '../../../pages/sensify/sensify-page';


@Component({
    selector: 'sensify-page-settings',
    templateUrl: 'sensify-settings.html'
})
export class SensifySettingsPage {

    @Input()
    public metadata: Metadata;

    @Output()
    public onMetadataChange: EventEmitter<Metadata> = new EventEmitter();

    newRadius: any;
    newValidationRange: any;
    newSenseboxID: any;


    constructor(public mySensifyPage:SensifyPage, public alertCrtl: AlertController, private alertCtrl: AlertController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SensifySettingsPage');
    }

    //SETTINGS
    //-Think about other setting options that we need
    public changeSettings() {
        if (this.newRadius) {
            this.metadata.settings.radius = this.newRadius;
        }
        if (this.newValidationRange) {
            this.metadata.settings.ranges.temperature = this.newValidationRange;
        }
        if (this.newSenseboxID) {
            this.metadata.settings.mySenseBox = this.newSenseboxID;
        }
        this.mySensifyPage.setMetadata(this.metadata);

        if (this.newRadius || this.newValidationRange || this.newSenseboxID) {
            let alert = this.alertCtrl.create({
                title: 'Saved successfully',
                subTitle: 'Settings are saved successfully',
                buttons: ['OK']
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: 'Nothing changed',
                subTitle: 'There were no settings changed',
                buttons: ['OK']
            });
            alert.present();
        }

        //Reset Input forms after setting change
        this.newRadius = null;
        this.newValidationRange = null;
        this.newSenseboxID = null;
        //this.onMetadataChange.emit(this.metadata);    
    }

}
