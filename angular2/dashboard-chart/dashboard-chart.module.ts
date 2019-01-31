import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedDirectivesModule } from '../../../app-server/client/src/app/shared/directives/directives.module';
import { ReviewerDashboardChart } from 'reviewer-dashboard-chart';
import { ProjectsSortingModule } from '../../../app-server/client/src/app/shared/modules/projects-sorting/projects.sorting.module';

import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { DashboardChartComponent } from './dashboard-chart.component';

import { DashboardChartService } from './dashboard-chart.service';
import { HorizontalBarChartModule } from './horizontal-bar-chart/horizontal-bar-chart.module';

@NgModule({
  imports: [
    CommonModule,
    ProjectsSortingModule,
    SharedDirectivesModule,
    HorizontalBarChartModule,
  ],
  exports: [
    DashboardChartComponent,
    ReviewerDashboardChart,
    HorizontalBarChartModule,
  ],
  declarations: [
    DashboardChartComponent,
    ReviewerDashboardChart,
    ChartLegendComponent,
  ],
  providers: [
    DashboardChartService
  ],
})
export class DashboardChartModule {
}
