import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutWeatherPage } from './about-weather';

@NgModule({
  declarations: [
    AboutWeatherPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutWeatherPage),
  ],
})
export class AboutWeatherPageModule {}
