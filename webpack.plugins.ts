import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
const path = require("path");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  // new CopyPlugin({
  //   patterns: [
  //     {
  //       from: path.resolve(__dirname, "assets/"),
  //       to: path.resolve(__dirname, "out/musicai-win32-x64/assets"),
  //     },
  //   ],
  // }),
];
