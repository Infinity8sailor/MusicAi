// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { Titlebar, TitlebarColor } from "custom-electron-titlebar";
const path = require("path");

const options = {
  backgroundColor: TitlebarColor.fromHex("#3b2a5a"),
  icon: path.resolve("assets/music.png"),
};
window.addEventListener("DOMContentLoaded", () => {
  // Title bar implementation
  new Titlebar(options);
});

export type Channels = "ipc-example" | "get-files";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  GetFiles: () => ipcRenderer.invoke("get-files"),
  GetFolders: () => ipcRenderer.send("get-folders"),
  GetFilesData: () => ipcRenderer.send("dd"),
  save_regions: (data: { title: string; regions: any[] }) =>
    ipcRenderer.send("save-regions", data),
  get_saved_regions: (info: { title: string }) =>
    ipcRenderer.send("get-saved-regions", info),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
