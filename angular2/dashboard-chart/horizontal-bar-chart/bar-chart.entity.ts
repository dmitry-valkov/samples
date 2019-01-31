import { HelpersService } from '../../../../app-server/client/src/app/shared/services/helpers.service';
import { IBarChartOptions, IJobStatBar } from '../interfaces';

export const DEFAULT_OPTIONS: IBarChartOptions = {
  barClicking: false,
  titleClicking: false,
  showPercent: false,
  offLinks: false,
  showTotal: true,
  showTitle: true,
};

export class BarChartViewModel {
  public set data(value: IJobStatBar) {
    this._data = value;
  }

  public get data(): IJobStatBar {
    return this._getTransformedData();
  }

  public set options(value: IBarChartOptions) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, value);
  }

  public get options(): IBarChartOptions {
    return this._options || DEFAULT_OPTIONS;
  }

  private _data: IJobStatBar;
  private _options: IBarChartOptions;

  private _getTransformedData(): IJobStatBar {
    const stages = this._data.stages.map((item) => {
      const realPercent = item.count / (this._options.relativeTo || this._data.total) * 100;

      item.percent = Number((realPercent).toFixed(1));
      item.hintText = HelpersService.createHintText(item.count, item.name);

      return item;
    });

    return Object.assign({}, this._data, { stages });
  }
}
