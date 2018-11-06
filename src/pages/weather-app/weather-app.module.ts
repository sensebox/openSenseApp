import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherAppPage } from './weather-app';
import { LeafletPageModule } from '../leaflet/leaflet.module';

@NgModule({
  declarations: [
    WeatherAppPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherAppPage),
    LeafletPageModule
  ],
})
export class WeatherAppPageModule {}
