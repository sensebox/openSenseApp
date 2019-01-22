import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing-page';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    IonicPageModule.forChild(LandingPage),
  ],
  exports: [
    LandingPage,
  ]
})
export class LandingPageModule {}
