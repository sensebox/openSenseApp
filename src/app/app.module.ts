import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { openSenseApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { LeafletPage } from '../pages/leaflet/leaflet';
import { LeafletPageModule } from '../pages/leaflet/leaflet.module';

@NgModule({
  declarations: [
    openSenseApp,
    HomePage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(openSenseApp),
    LeafletPageModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    HomePage,
    LeafletPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider
  ]
})
export class AppModule {}
