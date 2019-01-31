export enum DashboardType {
  MAIN = 'MAIN',
  REVIEWER = 'REVIEWER',
}

export enum StageCode {
  COMMON = 'COMMON',
  PROCESSING = 'PROCESSING',
  READY4ACTION = 'READY4ACTION',
  ESCALATED = 'ESCALATED',
  READY4EXPORT = 'READY4EXPORT',
  FAILED = 'FAILED',
}

export interface IBarChartOptions {
  showPercent?: boolean;
  showTotal?: boolean;
  showTitle?: boolean;
  offLinks?: boolean;
  barClicking?: boolean;
  titleClicking?: boolean;
  relativeTo?: number;
}

export interface IJobStatStage {
  code: string;
  stage_code: StageCode;
  name: string;
  count: number;
  color: string;
  percent?: number;
  hintText?: string;
}

export interface IJobStatProject {
  id: string;
  name: string;
}

export interface IJobStatBar {
  project: IJobStatProject;
  stages: IJobStatStage[];
  total: number;
}

export interface IJobStatsLegend {
  code: string;
  name: string;
  count: number;
  color: string;
}

export interface IJobStat {
  bars: IJobStatBar[];
  legend: IJobStatsLegend[];
}

export interface ILegend {
  name: string;
  code: string | StageCode;
  color: string;
  count: number;
  id?: string;
  jobStage?: string;
  jobStatName?: string;
}
