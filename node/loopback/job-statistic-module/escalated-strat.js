const { RootStatisticStrategy } = require('./root-strat');
const { JOB } = require('../../../constants/job');
const NOT_SPECIFIED = 'not_specified';

/**
 * @extends RootStatisticStrategy
 */
class EscalatedStrategy extends RootStatisticStrategy {

  /**
   * @param {object} app
   */
  constructor(app) {
    super(app);

    this.lookup = app.models.lookup;
  }

  async getLegend(bars) {
    const exceptions = await this.getAllExceptions();

    return super.getLegend(bars, exceptions);
  };

  getAggregatePipeline() {
    return [
      { $match: { 'status.stage_code': 'ESCALATED' } },
      { $project: { project: true, issues: { $concatArrays: ['$issues', '$exceptions'] } } },
      {
        $unwind: {
          path: '$issues',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $group: {
          _id: { projectId: '$project.id', code: '$issues.code' },
          count: { $sum: 1 },
          project: { $first: '$project' },
          issue: { $first: '$issues' },
        },
      },
      { $group: {
          _id: { projectId: '$_id.projectId' },
          total: { $sum: '$count' },
          project: { $first: '$project' },
          stages: {
            $addToSet: {
              code: '$issue.code',
              stage_code: JOB.NEW_STAGES.ESCALATED.code,
              count: '$count',
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ];
  }

  statsMapper(stat) {
    stat.stages = stat.stages.map((stage) => {
      if (!stage.code) {
        stage.code = NOT_SPECIFIED;
      }

      return stage;
    });

    return super.statsMapper(stat);
  }

  createAllBar(legend, barName = 'All Issues') {
    return super.createAllBar(legend, barName);
  }

  async getAllExceptions() {
    return await this.lookup.collection.aggregate([
      { $match: { category_code: 'ATA_EXCEPTION_TYPE' } },
      { $project: { values: 1 } },
      { $unwind: '$values' },
      {
        $group: {
          _id: {
            code: '$values.code',
            name: '$values.name',
            color: '$values.color',
          },
          index: { $first: '$values.index' },
        },
      },
    ])
      .map(({ _id, index }) => Object.assign(_id, { index: Number(index) }))
      .toArray();
  }
}

module.exports = {
  EscalatedStrategy,
};
