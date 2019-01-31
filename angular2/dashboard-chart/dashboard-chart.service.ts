import { Injectable } from '@angular/core';
import { JobService } from '../../../app-server/client/src/app/shared/services/job.services';
import { Observable } from 'rxjs/Rx';
import { DashboardType, IJobStat, IJobStatBar } from './interfaces';

@Injectable()
export class DashboardChartService {
  constructor(
    private api: JobService,
  ) {}

  public getData(dashboardType: DashboardType): Observable<IJobStat> {
    return this.api.getJobStats(dashboardType);
  }

  public getDataByProject(projectId: string): Observable<IJobStat> {
    return this.api.getJobStatsByProject(projectId);
  }

  public getBarWithMaxCount(bars: IJobStatBar[]): IJobStatBar {
    let barWithMaxCount: IJobStatBar;

    for (const project of bars) {
      if (
        !barWithMaxCount ||
        project.total > barWithMaxCount.total
      ) {
        barWithMaxCount = project;
      }
    }

    return barWithMaxCount;
  }
}
