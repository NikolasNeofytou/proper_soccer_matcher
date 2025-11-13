module.exports = function (options, webpack) {
  // Handle the case when externals is an array
  const externals = Array.isArray(options.externals) ? [...options.externals] : [];
  
  return {
    ...options,
    externals: [
      ...externals,
      function ({ context, request }, callback) {
        if (/^bcrypt$/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      },
    ],
  };
};
