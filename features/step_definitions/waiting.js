module.exports = function() {
  this.Given(/^I note down the time$/, function(callback) {
    var self = this;

    self.time = new Date();
    callback();
  });

  this.When(/^I wait '(.*)' seconds$/, function(interval, callback) {
    var self = this;

    if (process.env.PARALLEL_CUCUMBER_PROFILE === 'busy') {
      while ((new Date() - self.time) < (interval * 1000)) {
        // noop
      }
      callback();
    }
    else if (process.env.PARALLEL_CUCUMBER_PROFILE === 'sleep') {
      setTimeout(
        function() {
          callback();
        },
        interval * 1000
      );
    }
    else {
      callback({ message: 'ERROR: WAIT environment variable has not been set' });
    }
  });

  this.Then(/^'(.*)' to '(.*)' seconds should have elapsed$/, function(minInterval, maxInterval, callback) {
    var self = this;

    var actualInterval = new Date() - self.time;
    minInterval *= 1000;
    maxInterval *= 1000;

    if (actualInterval < minInterval) {
      callback({ message: 'Elapsed interval was ' + actualInterval + ' milliseconds which is less than the minimum interval of ' + minInterval + ' milliseconds' });
    }
    else if (actualInterval > maxInterval) {
      callback({ message: 'Elapsed interval was ' + actualInterval + ' milliseconds which is greater than the maximum interval of ' + minInterval + ' milliseconds' });
    }
    else {
      callback();
    }
  });
};
