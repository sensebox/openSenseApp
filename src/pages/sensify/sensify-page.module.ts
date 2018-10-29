import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyPage } from './sensify-page';
import { MapPageModule } from '../sensify-map/sensify-map.module';

@NgModule({
  declarations: [
    SensifyPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyPage),
    MapPageModule
  ]
})
export class SensifyPageModule {}
