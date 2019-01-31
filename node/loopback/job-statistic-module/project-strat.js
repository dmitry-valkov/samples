const { RootStatisticStrategy } = require('./root-strat');
const { ObjectID } = require('mongodb');

class ProjectStrategy extends RootStatisticStrategy {

  /**
   * @param {object} app
   * @param {string} projectId
   */
  constructor(app, projectId) {
    super(app);

    this.projectId = projectId;
    this.lookup = app.models.lookup;
  }

  getAggregatePipeline() {
    return [
      {
        $match: { 'project.id': new ObjectID(this.projectId) },
      },
      {
        $group: {
          _id: { statusCode: '$status.stage_code' },
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
              code: '$status.stage_code',
              stage_code: '$status.stage_code',
              name: '$status.stage_name',
              count: '$count',
              index: '$status.index',
            },
          },
        },
      },
    ];
  }

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
  ProjectStrategy,
};
