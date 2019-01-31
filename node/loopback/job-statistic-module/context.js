const { ByStageStrategy } = require('./dashboard-strats');
const { ProjectStrategy } = require('./project-strat');
const { ObjectID } = require('mongodb');
const { JOB } = require('../../../constants/job');
const _ = require('lodash');

class JobStatisticContext {

  /**
   * @param {object} user
   * @param {object} app
   */
  constructor(user, app) {
    const { organizationId, roleName } = user;

    this.Job = app.models.Job;
    this.Project = app.models.Project;
    this.organizationId = organizationId;

    this.pipelineStarter = [
      { $match: { organizationId: organizationId } },
      { $match: { status: { $exists: true } } },
    ];

    this.excludedStages = JOB.ROLE_EXCLUDED_STAGES[roleName] || [];

    for (const stage of this.excludedStages) {
      this.pipelineStarter.push({ $match: { 'status.stage_code': { $ne: stage } } });
    }
  }

  setStrategy(strategy) {
    if (!strategy) throw new Error('Class JobStatisticContext, method setStrategy - param strategy is required!');

    this.strategy = strategy;
  }

  /**
   * @return {Promise<{bars: [{}], legend: [{}]}>}
   */
  async getStats() {
    const aggregationPipe = this._getAggregationPipe();

    let bars = await this.Job.collection
      .aggregate(aggregationPipe)
      .map((stat) => this.strategy.statsMapper(stat))
      .toArray();

    const legend = this._filterLegendForRole(await this.strategy.getLegend(bars));

    // Empty projects needs only for Documents Tab on Dashboard
    if (this.strategy instanceof ByStageStrategy) {
      bars = bars.concat(await this._getEmptyProjects(bars));
    }

    // AllBar no need for ProjectStrategy
    if (!(this.strategy instanceof ProjectStrategy)) {
      bars = [this.strategy.createAllBar(legend), ...(_.sortBy(bars, 'project.name'))];
    }

    bars = bars.map((bar) => {
      bar.stages = _.sortBy(bar.stages, 'index');

      return bar;
    });

    return { bars, legend };
  }

  async _getEmptyProjects(bars) {
    const exclude = bars.map((bar) => new ObjectID(bar.project.id));

    return await this.Project.collection.aggregate([
      { $match:
          {
            $and: [
              { organizationId: this.organizationId },
              { _id: { $nin: exclude } },
            ],
          },
      },
      { $project: { _id: 1, name: 1 } },
    ])
      .map(({ _id, name }) => ({ total: 0, stages: [], project: { id: _id, name } }))
      .toArray();
  }

  /**
   * Formed and return aggregation pipe
   *
   * @return {[]}
   * @private
   */
  _getAggregationPipe() {
    const strategyPipeline = this.strategy.getAggregatePipeline();

    return this.pipelineStarter.concat(strategyPipeline);
  }

  /**
   * Filter legends which deprecated for current user role
   *
   * @param {[]} legends
   * @return {[]}
   * @private
   */
  _filterLegendForRole(legends) {
    return legends.filter((legend) => {
      return !this.excludedStages.includes(legend.code);
    });
  }
}

module.exports = {
  JobStatisticContext,
};
