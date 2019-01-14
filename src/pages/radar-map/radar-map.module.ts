import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadarMapPage } from './radar-map';

@NgModule({
  declarations: [
    RadarMapPage,
  ],
  imports: [
    IonicPageModule.forChild(RadarMapPage),
  ],
})
export class RadarMapPageModule {}
