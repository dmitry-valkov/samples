'use strict';

const { ProjectStrategy } = require('../job-statistic-module/project-strat');
const { JobStatisticContext } = require('../job-statistic-module/context');

module.exports = function(Job) {
  Job.getProjectStats = function(ctx, projectId, cb) {
    const { user } = ctx.req;
    const jobStatistic = new JobStatisticContext(user, Job.app);

    jobStatistic.setStrategy(new ProjectStrategy(Job.app, projectId));

    jobStatistic.getStats()
      .then(stats => cb(null, stats))
      .catch(cb);
  };

  Job.remoteMethod(
    'getProjectStats',
    {
      description: 'Return Job statistics',
      accepts: [
        { arg: 'ctx', type: 'object', http: { source: 'context' } },
        { arg: 'projectId', type: 'string', http: { source: 'query' }, required: true },
      ],
      returns: {
        arg: 'stats', type: 'object', root: true,
      },
      http: { path: '/projectStats', verb: 'get' },
    }
  );
};
