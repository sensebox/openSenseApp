import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensifyAboutPage } from './sensify-about';

@NgModule({
  declarations: [
    SensifyAboutPage,
  ],
  imports: [
    IonicPageModule.forChild(SensifyAboutPage),
  ],
})
export class SensifyAboutPageModule {}
