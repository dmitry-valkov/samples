/* eslint-disable valid-jsdoc */

const _ = require('lodash');

class RootStatisticStrategy {

  /**
   * @param {object} app
   */
  constructor(app) {
    this.app = app;
  }

  getLegend(bars, statuses) {
    statuses = _.sortBy(statuses, 'index');
    this._mutateBarsWithLookups(bars, statuses);

    const legend = statuses.map((status) => {
      status.count = bars.reduce((acc, bar) => {
        const found = _.find(bar.stages, { code: status.code });

        if (found) {
          return acc + found.count;
        }

        return acc;
      }, 0);

      return status;
    });

    return legend;
  }

  statsMapper(stat) {
    let { stages, total, project } = stat;

    return { project, stages, total };
  }

  /**
   * Create and return 'All Documents' bar with total statistics
   *
   * @param {*} legend
   * @param {string} barName
   * @return {{project: {id: string, name: string}, stages: [{}], total: number}}
   */
  createAllBar(legend, barName = 'All Documents') {
    return {
      project: {
        id: '',
        name: barName,
      },
      stages: legend,
      total: legend.reduce((acc, status) => acc + status.count, 0),
    };
  }

  /**
   * @param bars
   * @param statuses
   * @private
   */
  _mutateBarsWithLookups(bars, statuses) {
    bars.forEach((bar) => {
      bar.stages = bar.stages.map((stage) => {
        const found = _.find(statuses, { code: stage.code }) || {};

        return Object.assign({}, stage, found);
      });
    });
  }

  getAggregatePipeline() {
    throw new Error('Children of RootStatisticStrategy must implement `getGroupByProjectAndStatus` method.');
  }
}

module.exports = {
  RootStatisticStrategy,
};
