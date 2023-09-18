import React, { useEffect, useState } from "react";

import { Wave } from "./wave";
import RenderIfVisible from "react-render-if-visible";
const ESTIMATED_ITEM_HEIGHT = 20;

export default function UVRList({ setCurr = (e) => {} }) {
  const [files_list, setFiles] = useState({
    songs: [],
    path: "",
  });

  const get_songs_folders = () => {
    // setLoading(true);
    window.electron.ipcRenderer.sendMessage("get-folders");
    window.electron.ipcRenderer.on("take-folders", (data) => {
      console.log(data);
      setFiles(data);
      setCurr({ path: data.path, song: data.songs[0] });
      // setLoading(false);
    });
  };
  useEffect(() => {
    const get_data = async () => {
      await get_songs_folders();
    };
    get_data();
  }, []);
  return (
    <div
      style={{
        overflow: "scroll",
        maxHeight: "100%",
        width: "100%",
        margin: "0.25rem",
      }}
    >
      <div style={{ position: "sticky", top: "0" }}>
        <button onClick={() => get_songs_folders()}> Get UVR</button>
      </div>
      <div>
        {files_list &&
          files_list.songs.length > 0 &&
          files_list.songs.map((m, i) => (
            <RenderIfVisible
              visibleOffset={2000}
              defaultHeight={ESTIMATED_ITEM_HEIGHT}
            >
              <div
                key={i}
                onClick={() =>
                  setCurr({ path: files_list.path, song: files_list.songs[i] })
                }
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <span> {`${i + 1} .`}</span>
                <span>{m}</span>
              </div>
            </RenderIfVisible>
          ))}
      </div>
    </div>
  );
}
