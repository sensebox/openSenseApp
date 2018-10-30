import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { Geolocation} from "@ionic-native/geolocation";

import { SensifyStartPage } from './sensify-start/sensify-start';
import { SensifyMapPage } from './sensify-map/sensify-map';
import { SensifyAboutPage } from './sensify-about/sensify-about';

@NgModule({
  declarations: [
    SensifyStartPage,
    SensifyMapPage,
    SensifyAboutPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyStartPage),
    IonicPageModule.forChild(SensifyMapPage),
    IonicPageModule.forChild(SensifyAboutPage),
    LeafletModule,
    LeafletModule.forRoot()
  ],
  providers: [
    Geolocation
  ],
  exports: [
    SensifyStartPage,
    SensifyMapPage,
    SensifyAboutPage,
  ]
})
export class SensifyComponentModule {}
