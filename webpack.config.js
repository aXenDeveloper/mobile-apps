const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let pathsToClean = [
	'web/dist/*.*'
];
module.exports = {
	entry: {
		main: './web/index.js',
	},
	output: {
		path: __dirname + '/web/dist',
		filename: 'main.bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.js$/,
				include: [
					__dirname + '/web',
					/\/node_modules\/quill/,
				],
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'env',
								{
									targets: {
										browsers: ['last 2 versions', 'safari >= 7']
									}
								}
							],
							'react',
							'stage-2'
						],
						plugins: ['babel-plugin-transform-object-rest-spread'],
						babelrc: false
					}
				}
			}
		]
	},
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(pathsToClean),
		new HtmlWebpackPlugin({
			template: './web/template.html',
			inject: 'body',
			filename: './index.html',
			inlineSource: 'main.bundle.js',
			chunks: ['main']
 		}),
		new HtmlWebpackInlineSourcePlugin()
	]
};