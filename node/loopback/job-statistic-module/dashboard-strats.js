const { RootStatisticStrategy } = require('./root-strat');

class DashRootStatisticStrategy extends RootStatisticStrategy {

  /**
   * @param {object} app
   * @param {string} stage_code
   */
  constructor(app, stage_code) {
    super(app);

    this.stage_code = stage_code;
    this.lookup = app.models.lookup;

    this.matcherByStage = this.stage_code ?
      { $match: { 'values.stage_code': this.stage_code } } :
      void(0);
  }

  getAggregatePipeline() {
    const stagingOf = (field) => this.stage_code ?
      `$status.${field}` :
      `$status.stage_${field}`;

    const aggregationPipe = [
      {
        $group: {
          _id: { projectId: '$project.id', statusCode: stagingOf('code') },
          count: { $sum: 1 },
          project: { $first: '$project' },
          status: { $first: '$status' },
        },
      },
      {
        $group: {
          _id: { projectId: '$_id.projectId' },
          total: { $sum: '$count' },
          project: { $first: '$project' },
          stages: {
            $addToSet: {
              code: stagingOf('code'),
              stage_code: '$status.stage_code',
              name: stagingOf('name'),
              count: '$count',
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ];

    if (this.stage_code) {
      const additionalMatcher = {
        $match: {
          'status.stage_code': this.stage_code,
        },
      };

      aggregationPipe.splice(0, 0, additionalMatcher);
    }

    return aggregationPipe;
  }
}

/**
 * Strategy for simple dashboard tabs
 */
class ByStatusStrategy extends DashRootStatisticStrategy {
  async getLegend(bars) {
    const statuses = await this.getAllStatuses();

    return super.getLegend(bars, statuses);
  };

  async getAllStatuses() {
    return await this.lookup.collection.aggregate([
      { $match: { category_code: 'ATA_JOB_STATUS' } },
      { $project: { values: 1 } },
      { $unwind: '$values' },
      this.matcherByStage,
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
  };
}

/**
 * Strategy for 'Documents' tab on dashboard
 */
class ByStageStrategy extends DashRootStatisticStrategy {
  async getLegend(bars) {
    const stages = await this.getAllStages();

    return super.getLegend(bars, stages);
  };

  async getAllStages() {
    return await this.lookup.collection.aggregate([
      { $match: { category_code: 'ATA_JOB_STATUS' } },
      { $project: { values: 1 } },
      { $unwind: '$values' },
      {
        $group: {
          _id: {
            code: '$values.stage_code',
            name: '$values.stage_name',
            color: '$values.stage_color',
          },
          index: { $first: '$values.index' },
        },
      },
    ])
      .map(({ _id, index }) => Object.assign(_id, { index: Number(index) }))
      .toArray();
  };
}

module.exports = {
  ByStatusStrategy,
  ByStageStrategy,
};

