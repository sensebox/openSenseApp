import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyPage } from './sensify-page';
import { SensifyStartPageModule } from '../sensify-start/sensify-start.module';
import { SensifyMapPageModule } from '../sensify-map/sensify-map.module';
import { SensifyAboutPageModule } from '../sensify-about/sensify-about.module';

@NgModule({
  declarations: [
    SensifyPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyPage),
    SensifyStartPageModule,
    SensifyMapPageModule,
    SensifyAboutPageModule,
  ]
})
export class SensifyPageModule {}
