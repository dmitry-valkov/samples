import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { IBarChartOptions, IJobStatBar, IJobStatProject } from '../interfaces';
import { BarChartViewModel } from './bar-chart.entity';

@Component({
  selector: 'horizontal-bar-chart',
  templateUrl: 'horizontal-bar-chart.component.html',
  styleUrls: ['horizontal-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalBarChartComponent implements OnChanges {
  @Input() data: IJobStatBar;
  @Input() options: IBarChartOptions;

  @Output() titleClicked: EventEmitter<IJobStatProject> = new EventEmitter<IJobStatProject>();
  @Output() barClicked: EventEmitter<IJobStatBar> = new EventEmitter<IJobStatBar>();

  protected isOffLinks: boolean;
  protected viewModel: BarChartViewModel = new BarChartViewModel();

  ngOnChanges(changes) {
    if (changes['options']) {
      this.viewModel.options = this.options;
    }

    if (changes['data'] && this.data) {
      this.viewModel.data = this.data;
    }
  }

  protected titleClick() {
    if (
      this.options.titleClicking &&
      !this._isAllBar()
    ) {
      this.titleClicked.emit(this.data.project);
    }
  }

  protected barClick(item) {
    if (
      this.options.barClicking &&
      !this._isAllBar()
    ) {
      this.barClicked.emit(item);
    }
  }

  private _isAllBar(): boolean {
    return this.viewModel.data.project.id === '';
  }
}
