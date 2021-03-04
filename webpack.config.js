const path = require("path")
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


module.exports = {
    entry: "./webpack-src/app.js",
    output: {
        path: path.join(__dirname, "src"),
        filename: "app.js"
    },
    watch: true,
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new NodePolyfillPlugin()
    ],
}