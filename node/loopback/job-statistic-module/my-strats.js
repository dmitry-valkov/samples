const { RootStatisticStrategy } = require('./root-strat');
const { JOB } = require('../../../constants/job');

class MyRootStrategy extends RootStatisticStrategy {
  constructor(app, user) {
    super(app);

    this.user = user;
    this.lookup = app.models.lookup;
  }

  getAggregatePipeline() {
    const Job = this.app.models.Job;
    const matcher = Job.get_matcher_user_and_status(this.user, { stage_code: this.stage_code });

    return [
      { $project: { status: true, currentStep: true, project: true } },
      { $match: matcher },
      { $group: {
          _id: { projectId: '$project.id', statusCode: '$status.code' },
          count: { $sum: 1 },
          project: { $first: '$project' },
          status: { $first: '$status' },
        },
      },
      { $group: {
          _id: { projectId: '$_id.projectId' },
          total: { $sum: '$count' },
          project: { $first: '$project' },
          stages: {
            $addToSet: {
              code: '$status.code',
              stage_code: '$status.stage_code',
              name: '$status.name',
              count: '$count',
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ];
  }

  statsMapper(stats) {
    return super.statsMapper(stats);
  }

  async getLegend(bars) {
    const statuses = await this.getStatuses();

    return super.getLegend(bars, statuses);
  };

  async getStatuses() {
    return await this.lookup.collection.aggregate([
      { $match: { category_code: 'ATA_JOB_STATUS' } },
      { $project: { values: 1 } },
      { $unwind: '$values' },
      { $match: { 'values.stage_code': this.stage_code } },
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

class MyAssignmentsStrategy extends MyRootStrategy {

  /**
   * @param {object} app
   * @param {User} user
   */
  constructor(app, user) {
    super(app, user);

    this.stage_code = JOB.NEW_STAGES.READY4ACTION.code;
  }
}

class MyEscalationsStrategy extends MyRootStrategy {

  /**
   * @param {object} app
   * @param {User} user
   */
  constructor(app, user) {
    super(app, user);

    this.stage_code = JOB.NEW_STAGES.ESCALATED.code;
  }

  createAllBar(legend, barName = 'All Issues') {
    return super.createAllBar(legend, barName);
  }
}

module.exports = {
  MyAssignmentsStrategy,
  MyEscalationsStrategy,
};
