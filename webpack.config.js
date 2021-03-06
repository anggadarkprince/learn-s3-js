const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
	entry: {
		app: path.resolve(__dirname, 'assets/src/javascripts/app.js'),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'assets/dist'),
		publicPath: '/assets/dist/',
		chunkFilename: '[name].bundle.js',
	},
	devtool: 'source-map',
	mode: process.env.WEBPACK_MODE || 'development',
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		},
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
				parallel: true,
				terserOptions: {
					ecma: 6,
				},
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: /node_modules/
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
		}),
		new ManifestPlugin({
			fileName: 'manifest.json',
			publicPath: 'assets/dist/'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					// Adds CSS to the DOM by injecting a `<style>` tag
					{loader: 'style-loader'},

					// Extract CSS from javascript loader
					MiniCssExtractPlugin.loader,

					// Interprets `@import` and `url()` like `import/require()` and will resolve them
					{loader: 'css-loader'},

					// Loader for webpack to process CSS with PostCSS
					{
						loader: 'postcss-loader',
						options: {
							plugins: function () {
								return [
									require('autoprefixer')
								];
							}
						}
					},

					// Loads a SASS/SCSS file and compiles it to CSS
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: [path.resolve(__dirname, 'node_modules')],
							}
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'img/'
					}
				}]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};
