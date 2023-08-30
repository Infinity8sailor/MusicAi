import React, { useEffect, useState } from "react";

import { Wave } from "./wave";
import RenderIfVisible from "react-render-if-visible";
const ESTIMATED_ITEM_HEIGHT = 20;

export default function MusicList() {
  const [current_song, setCurrent_song] = useState(0);
  const [search, setSearch] = useState(false);
  const [search_input, setSearchInput] = useState(null);
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
  const [search_res, setSearch_res] = useState(null);
  const [loading, setLoading] = useState(false);

  const get_songs = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage("dd");
    window.electron.ipcRenderer.on("take", (data) => {
      // console.log("btn",data)
      setFiles(data);
      setLoading(false);
    });
  };
  const get_songs_folders = () => {
    // setLoading(true);
    window.electron.ipcRenderer.sendMessage("get-folders");
    window.electron.ipcRenderer.on("take-folders", (data) => {
      console.log(data);
      // setLoading(false);
    });
  };
  const on_change = (val = "") => {
    val = val.toLowerCase();
    setSearchInput(val);
    // let res = files_list.names.filter((m) => m.title.toLowerCase().includes(val));
    let res = files_list.names.map((m) => ({
      title: m.title,
      res: m.title.toLowerCase().includes(val),
    }));
    setSearch_res(res);
  };
  const play_next = () =>
    setCurrent_song(Math.round(Math.random() * files_list.names.length));

  useEffect(() => {
    const io_handler = async () => {
      window.electron.ipcRenderer.sendMessage("get-saved-data");
      window.electron.ipcRenderer.on("take", (data) => {
        setFiles(data);
        setLoading(false);
      });
    };
    io_handler();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div style={{ overflow: "scroll", height: "90vh", width: "30%" }}>
        <div style={{ position: "sticky", top: "0" }}>
          {loading ? (
            <div>Loading.....</div>
          ) : (
            <>
              {search ? (
                <>
                  <input
                    value={search_input}
                    onChange={(e) => on_change(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setSearch(false);
                      setSearch_res(null);
                    }}
                  >
                    {" "}
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => get_songs()}> Get Songs</button>
                  <button onClick={() => get_songs_folders()}> Get UVR</button>
                  <button onClick={() => setSearch((m) => !m)}> Search</button>
                </>
              )}
            </>
          )}
        </div>
        {search_res?.length > 0 &&
          search_res.map((m, i) => (
            <>
              {m.res && (
                <RenderIfVisible
                  visibleOffset={2000}
                  defaultHeight={ESTIMATED_ITEM_HEIGHT}
                >
                  <div
                    key={i}
                    onClick={() => setCurrent_song(i)}
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color: "red",
                    }}
                  >
                    <span> {`${i + 1} .`}</span>
                    <span>{m.title}</span>
                  </div>
                </RenderIfVisible>
              )}
            </>
          ))}
        <div>
          {files_list &&
            files_list.names.length > 0 &&
            files_list.names.map((m, i) => (
              <RenderIfVisible
                visibleOffset={2000}
                defaultHeight={ESTIMATED_ITEM_HEIGHT}
              >
                <div
                  key={i}
                  onClick={() => setCurrent_song(i)}
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span> {`${i + 1} .`}</span>
                  <span>{m.title}</span>
                </div>
              </RenderIfVisible>
            ))}
        </div>
      </div>
      <Wave
        url={files_list ? files_list.files[current_song] : null}
        song_title={files_list.names[current_song].title}
        on_end={play_next}
      />
      {/* <WaveMini /> */}
    </div>
  );
}
