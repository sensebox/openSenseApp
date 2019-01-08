import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicStorageModule } from '@ionic/storage';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { openSenseApp } from './app.component';
import { ApiProvider } from '../providers/api/api';
import { helpers } from '../pages/sensify/js/helpers';
import { validation } from '../pages/sensify/js/validation';

@NgModule({
    declarations: [
        openSenseApp
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        IonicModule.forRoot(openSenseApp),
        LeafletModule,
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        openSenseApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ApiProvider,
        LocalNotifications,
        NativeGeocoder,
        helpers,
        validation
    ]
})
export class AppModule { }
