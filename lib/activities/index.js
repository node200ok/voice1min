
var _ = require('underscore'),
    names = [
        'root',
        'latest'
    ], activityList = [];

try {
    _.each(names, function(val) {
        var activity = require('./' + val);
        activity.name = val;
        activityList.push(activity);
    });
} catch (err) {
    throw new Error('Activity Error');
}
module.exports = activityList;

