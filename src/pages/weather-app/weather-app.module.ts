import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherAppPage } from './weather-app';
import { SenseBoxPageModule } from '../sense-box/sense-box.module';

@NgModule({
  declarations: [
    WeatherAppPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherAppPage),
    SenseBoxPageModule,
  ],
})
export class WeatherAppPageModule {}
