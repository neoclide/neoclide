
module.exports = {
  entry: './src/index.js',
  output: {
    path: 'renderer',
    filename: 'bundle.js'
  },
  resolve: {
    root: __dirname,
    packageAlias: 'browser'
  },
  devtool: 'cheap-module-inline-source-map',
  target: 'electron',
  externals: [{
    /*全局变量载入*/
    polymer: 'var Polymer'
  }]
}
