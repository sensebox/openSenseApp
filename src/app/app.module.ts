import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { openSenseApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PendulumPage } from '../pages/pendulum/pendulum';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { GlobalProvider } from '../providers/global/global';

@NgModule({
  declarations: [
    openSenseApp,
    HomePage,
    PendulumPage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(openSenseApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    HomePage,
    PendulumPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    GlobalProvider
  ]
})
export class AppModule {}
