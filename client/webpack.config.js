const webpack = require("webpack");
const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "./src/index.js"),
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
        test: /\.(sass|css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
				postcssOptions: {
					plugins: () => [
						require("autoprefixer")()
					],
				}
            },
          },
          'sass-loader',
        ]
      },
		],
	},
	resolve: {
		extensions: ["*", ".js", ".jsx"],
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js",
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	devServer: {
		static: './dist',
		proxy: {
			'/v1': {
				target: {
          host: "api",
          protocol: 'http:',
          port: 3001
        },
				secure: false,
				changeOrigin: true,
			},
		}
	},
};