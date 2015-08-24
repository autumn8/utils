// Karma configuration
// Generated on Mon Aug 17 2015 09:47:28 GMT+0200 (South Africa Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],

    files: [
      /*'lib/angular.js',
      'lib/angular-mocks.js',*/
      './src/**/*.es6.js',
      './test/**/*.spec.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.es6.js': ['browserify'],
      './test/**/*.spec.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    },




    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome']

  });
};
