import { Component } from '@angular/core';
import { DashboardChartComponent } from './dashboard-chart.component';
import { IJobStatBar, IJobStatStage } from './interfaces';

@Component({
  selector: 'reviewer-dashboard-chart',
  templateUrl: 'dashboard-chart.component.html',
  styleUrls: ['dashboard-chart.component.scss']
})

export class ReviewerDashboardChart extends DashboardChartComponent {

  protected onChartClick(
    bar: IJobStatBar,
    stage: IJobStatStage = {} as IJobStatStage
  ) {
    const queryParams = {
      projectId: bar.project.id,
    };

    let url: string;
    const { stage_code, code } = stage;

    queryParams['status'] = JSON.stringify({ stage_code, code });
    url = `/validate/preview`;

    this.router.navigate([url], { queryParams }).catch(console.error);
  }
}
