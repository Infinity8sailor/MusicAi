import React, { useEffect, useState } from "react";
// import { startPlayer } from "./file_utils";
import { Howl } from "howler";

export default function MusicList() {
  const [files_list, setFiles] = useState({
    names: [
      {
        // name: "filename",
        title: "Title",
        // path: "filePath",
        // size: 0, // kb
      },
    ],
    files: [],
    path: "",
  });
  const [loading, setLoading] = useState(false);

  const btn = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage("dd");
    window.electron.ipcRenderer.on("take", (data) => {
      // console.log("btn",data)
      setFiles(data);
      setLoading(false);
    });
  };

  const play_song = (song) => {
    let sound = new Howl({
      src: [files_list.files[song]],
      html5: true,
      // format: ["mp3", "aac"],
      onplay: function () {
        duration = self.formatTime(Math.round(sound.duration()));
        requestAnimationFrame(self.step.bind(self));
      },
      onend: function () {
        if (shuffle) {
          self.skip("random");
        } else {
          self.skip("right");
        }
      },
      onload() {
        console.log("Sound is loaded.");
      },
      onloaderror(msg) {
        console.log("NO SOUND!!!", msg);
      },
    });
    // console.log(sound);
    sound.play();
  };
  const pause_song = () => {
    window.electron.ipcRenderer.sendMessage("pause");
  };
  useEffect(() => {
    const io_handler = async () => {
      // const files = await window.electron.GetFiles();
      // setFiles(files);
      // setLoading(true);
      window.electron.ipcRenderer.sendMessage("dd");
      window.electron.ipcRenderer.on("take", (data) => {
        setFiles(data);
        setLoading(false);
      });
    };
    io_handler();
  }, []);
  return (
    <div style={{ overflow: "scroll", height: "800px" }}>
      {loading ? (
        <div>Loading.....</div>
      ) : (
        <button onClick={() => btn()}> get data</button>
      )}
      <button onClick={() => play_song()}> play </button>
      <button onClick={() => pause_song()}> pause </button>
      <ol>
        {files_list &&
          files_list.names.length > 0 &&
          files_list.names.map((m, i) => (
            <li key={i}>
              <div onClick={() => play_song(i)}>{m.title}</div>
              {/* <div>{m.path}</div> */}
            </li>
          ))}
      </ol>
    </div>
  );
}
