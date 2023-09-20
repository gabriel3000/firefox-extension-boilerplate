import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
    entry: {
        content_scripts: './src/content_scripts/index.ts',
        browser_action: './src/browser_action/popup/index.ts',
        popup: './src/browser_action/popup/popup.scss',
    },
    output: {
        path: path.resolve(__dirname, 'extension'),
    },
    mode: 'production', // Extensions do not like development mode.
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/browser_action/popup/popup.html', to: 'popup.html' },
                { from: 'src/images', to: 'images' },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new RemoveEmptyScriptsPlugin(), // Scss entries create empty js files. Remove with this plugin.
        new WebExtPlugin({
            sourceDir: path.resolve(__dirname, 'extension'), // Source directory of your extension.
            startUrl: "www.mozilla.org",
            browserConsole: false, // true: open browser console for extension.
            devtools: false,  // true: open devtools for extension.
        }),
    ],
};