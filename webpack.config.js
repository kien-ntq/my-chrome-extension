const {join, resolve} = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const baseConfig = {
		mode: "development",
        devtool: "source-map",
        resolve: {
			alias: {
                "@": resolve(__dirname, "src/js"),
            }
        },
        module: {
			rules: [
				/* {
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ["babel-loader"]
				} */
			]
		},
    }
	const outputPath = resolve(__dirname, "dist");
    const output = {
		filename: "js/[name].js",
		path: outputPath,
		clean: true,
	};
	const buildTime = new Date().toISOString();
	const htmlOptions = (name) => ({
		template: `./src/${name}.html`,
		filename: `${name}.html`,
		chunks: [name],
		minify: false,
        // create a timestamp that's injected into an HTML comment via the plugins
		buildTime
	});
    return [
        {
            ...baseConfig,
            entry: {
				background: "./src/js/background/background.js",
				popup: "./src/js/popup/popup.js",
				content: "./src/js/content/content.js",
            },
            plugins: [
				new CopyWebpackPlugin({
					patterns: [
						{ from: "src/images/", to: "images" },
						// "src/images/",
						"src/manifest.json",
					]
				}),
				new HtmlWebpackPlugin(htmlOptions("popup")),
            ],
			output
        }
    ]
}