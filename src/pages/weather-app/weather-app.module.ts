import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherAppPage } from './weather-app';

@NgModule({
  declarations: [
    WeatherAppPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherAppPage),
  ],
})
export class WeatherAppPageModule {}
