const path = require("path");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssNormalize = require("postcss-normalize");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const entry = "./src/_assets/main.js";
const outputPath = "./dist/assets";

const isDev = process.env.NODE_ENV !== "production";

const sassRule = {
  test: /\.s[ac]ss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["autoprefixer", postcssNormalize({ forceImport: true })],
        },
      },
    },
    {
      loader: "sass-loader",
      options: {
        sassOptions: {
          includePaths: ["./src/_assets/fonts"],
        },
      },
    },
  ],
};

const fontRule = {
  test: /\.(woff2)$/i,
  type: "asset/resource",
  generator: {
    filename: `fonts/${isDev ? "[name][ext]" : "[hash][ext][query]"}`,
  },
};

const jsRule = {
  test: /\.(js)$/,
  loader: require.resolve("swc-loader"),
  options: {
    env: {
      // swc-loader fails to read from package.json browserslist (https://github.com/swc-project/swc/issues/3365)
      targets: require("browserslist").loadConfig({
        path: path.resolve(__dirname, "."),
        env: process.env.NODE_ENV,
      }),
      mode: "entry",
      coreJs: "3.22",
    },
  },
};

module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  entry,
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: isDev ? "[name].js" : "[contenthash].js",
    publicPath: "/assets/",
  },
  module: {
    rules: [sassRule, fontRule, jsRule],
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
  ],
  stats: {
    children: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({ terserOptions: { sourceMap: true } }),
    ],
  },
};
