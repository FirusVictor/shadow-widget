const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const publicDir = path.join(__dirname, 'dist');

let config;
config = {
  mode: 'development',
  devServer: {
    static: publicDir,
    compress: false,
    port: 9000,
  },
  entry: path.join(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget.js',
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.txt'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public' },
        // { from: 'src/assets', to: 'assets' },
        { from: 'README.md' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: [path.resolve('src')],
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          compilerOptions: {
            module: 'es2015',
          },
        },
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          {
            loader: require.resolve('style-loader'),
            options: {
              insert: function insertAtTop(element) {

                let interval = setInterval(() => {
                  if (document.querySelector('.app-widget')) {
                    document.querySelector('.app-widget').shadowRoot.appendChild(element);
                    clearInterval(interval);
                  }
                }, 100);

              },
            },
          },
          // 'style-loader',
          'css-loader',
          // 'cssimportant-loader',
          'sass-loader',
        ],
      },
    ],
  },
};

module.exports = config;
