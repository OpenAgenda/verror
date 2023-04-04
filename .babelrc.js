'use strict';

module.exports = {
  presets: [
    [
      require.resolve('@openagenda/babel-preset'),
      {
        transformRuntime: false
      }
    ]
  ],
  sourceType: 'unambiguous'
};
