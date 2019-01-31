import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from '../../../../app-server/client/src/app/shared/directives/directives.module';
import { HorizontalBarChartComponent } from './horizontal-bar-chart.component';

@NgModule({
  imports: [CommonModule, SharedDirectivesModule],
  exports: [HorizontalBarChartComponent],
  declarations: [
    HorizontalBarChartComponent
  ],
})
export class HorizontalBarChartModule {
}
