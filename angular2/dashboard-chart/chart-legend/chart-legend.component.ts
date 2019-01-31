import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILegend } from '../interfaces';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss'],
})
export class ChartLegendComponent {
  @Input() legend: ILegend[] = [];
  @Input() label: string;
  @Input() clickable: boolean = false;
  @Output() legendClicked: EventEmitter<ILegend> = new EventEmitter();

  public legendClick(item: ILegend) {
    this.legendClicked.emit(item);
  }
}
