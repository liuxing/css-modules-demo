const path = require('path')

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        ]
       }
    ]
  }
}

// loader: 'style-loader!css-loader?modules'
// loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]'