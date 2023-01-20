/* eslint-disable no-undef */
import path from 'path';

import react from '@vitejs/plugin-react';
import { getThemeVariables } from 'antd/dist/theme';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';

export default defineConfig({
	plugins: [
		react(),
		vitePluginImp({
			libList: [
				{
					libName: 'antd',
					style: name => `antd/es/${name}/style`
				}
			]
		})
	],
	resolve: {
		alias: [
			{ find: '@', replacement: path.resolve(__dirname, './src') },
			// { '@': path.resolve(__dirname, './src') },
			// { find: '@', replacement: path.resolve(__dirname, 'src') },
			// fix less import by: @import ~
			// https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
			{ find: /^~/, replacement: '' }
		]
	},
	// build: {
	// 	minify: true
	// },
	css: {
		postcss: {
			plugins: [
				require('tailwindcss'),
				require('autoprefixer'),
				{
					postcssPlugin: 'internal:charset-removal',
					AtRule: {
						charset: atRule => {
							if (atRule.name === 'charset') {
								atRule.remove();
							}
						}
					}
				}
			]
		},
		preprocessorOptions: {
			less: {
				modifyVars: {
					// ...getThemeVariables({
					// 	dark: true
					// 	// compact: true
					// })
					'primary-color': '#384ad7',
					'font-family': '"krub", sans-serif'
				},
				javascriptEnabled: true
			}
		}
	}
});
