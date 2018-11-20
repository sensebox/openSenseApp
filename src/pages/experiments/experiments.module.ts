import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExperimentsPage } from './experiments';

@NgModule({
  declarations: [
    ExperimentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExperimentsPage),
  ],
})
export class ExperimentsPageModule {}
