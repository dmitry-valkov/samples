import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IJobStatBar } from 'interfaces';

import { IProjectsSorting } from '../../../app-server/client/src/app/shared/modules/projects-sorting/interfaces';
import { ProjectsSortingService } from '../../../app-server/client/src/app/shared/modules/projects-sorting/projects.sorting.service';

import { DashboardChartService } from './dashboard-chart.service';
import { IBarChartOptions, IJobStat, IJobStatStage, ILegend, StageCode } from './interfaces';
import { UserService } from '../../../app-server/client/src/app/shared/services/user.service';
import { USER } from '../../../app-server/common/constants/user';
const {
  STAKEHOLDER,
} = USER.ROLE_NAMES;

@Component({
  selector: 'dashboard-chart',
  templateUrl: 'dashboard-chart.component.html',
  styleUrls: ['/dashboard-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChartComponent implements IProjectsSorting {
  public bars: IJobStatBar[] = [];

  @Input() set stats(value) {
    this._stats = value;

    this.bars = value.bars;
    this.legend = value.legend;
    this.barOptions.relativeTo = this.relativeStat ?
      this.service.getBarWithMaxCount(this.bars).total :
      null;
  }
  get stats() {
    return this._stats;
  }
  @Input() protected title: string;
  @Input() protected stageCode: StageCode;
  @Input() protected offLinks: boolean = false;
  @Input() protected relativeStat: boolean = false;
  @Input() protected legendLabel: string;

  protected legend: ILegend[] = [];

  protected barOptions: IBarChartOptions = {
    barClicking: true,
    titleClicking: true,
    showPercent: true,
    showTotal: true,
    offLinks: this.offLinks,
  };

  private _stats: IJobStat;

  constructor(
    protected service: DashboardChartService,
    protected router: Router,
    protected userService: UserService,
  ) {}

  public onSortChanged(type: ProjectSort) {
    this.bars = ProjectsSortingService.sort(
      type, this.bars, { existAll: true, map: { title: 'project.name', createdAt: 'project.id' } }
    );
  }

  protected onChartClick(
    bar: IJobStatBar,
    stage: IJobStatStage = {} as IJobStatStage
  ) {
    if (this.userService.user.roleName === STAKEHOLDER) {
      return;
    }

    const queryParams = {};

    let url: string;
    const { stage_code, code } = stage;

    if (!this.stageCode || this.stageCode === StageCode.ESCALATED) {
      queryParams['stage'] = stage_code;
    } else {
      queryParams['status'] = code;
    }

    url = `/configuration-object/data-hub/${bar.project.id}/workflow-tab`;

    this.router.navigate([url], { queryParams }).catch(console.error);
  }
}
