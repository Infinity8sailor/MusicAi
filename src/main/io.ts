import { BrowserWindow } from "electron";

const path = require("path");
const fs = require("fs-extra");
const os = require("os");
const _open = require("open");
const chokidar = require("chokidar");

// local dependencies
const notification = require("./notification");

// get application directory
const appDir = path.resolve(os.homedir());

interface file {
  name: string;
  path: string;
}

/****************************/

// get the list of files
export const getFiles = () => {
  const appDir = "E:\\Music\\Songs";
  const files = fs.readdirSync(appDir);

  return files.map((filename: string) => {
    const filePath = path.resolve(appDir, filename);
    const fileStats = fs.statSync(filePath);

    return {
      name: filename,
      path: filePath,
      size: Number(fileStats.size / 1000).toFixed(1), // kb
    };
  });
};

// get the list of folders
export const getFolders = () => {
  const appDir = "E:\\Music\\UVR_DEMO";
  const files = fs.readdirSync(appDir).filter(function (file: string) {
    return (
      fs.statSync(appDir + "/" + file).isDirectory() &&
      file !== "source" &&
      file !== "Demixes"
    );
  });
  return { songs: files, path: appDir };
};

/****************************/

// add files
exports.addFiles = (files = []) => {
  // ensure `appDir` exists
  fs.ensureDirSync(appDir);

  // copy `files` recursively (ignore duplicate file names)
  files.forEach((file: file) => {
    const filePath = path.resolve(appDir, file.name);

    if (!fs.existsSync(filePath)) {
      fs.copyFileSync(file.path, filePath);
    }
  });

  // display notification
  notification.filesAdded(files.length);
};

// delete a file
exports.deleteFile = (filename: string) => {
  const filePath = path.resolve(appDir, filename);

  // remove file from the file system
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
};

// open a file
exports.openFile = (filename: string) => {
  const filePath = path.resolve(appDir, filename);

  // open a file using default application
  if (fs.existsSync(filePath)) {
    _open(filePath);
  }
};

/*-----*/
// watch files from the application's storage directory
export const watchFiles = (win: BrowserWindow) => {
  chokidar.watch(appDir).on("unlink", (filepath: string) => {
    win.webContents.send("app:delete-file", path.parse(filepath).base);
  });
};
