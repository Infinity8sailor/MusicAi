import React, { useEffect, useState } from "react";

import RenderIfVisible from "react-render-if-visible";
import { Button } from "react-utility-yard";
const ESTIMATED_ITEM_HEIGHT = 20;

export default function UVRList({ setCurr = (e) => {} }) {
  const [files_list, setFiles] = useState({
    songs: [],
    path: "",
  });
  // const [current_song, setCurrent_song] = useState(0);
  const [search, setSearch] = useState(false);
  const [search_input, setSearchInput] = useState(null);
  const [search_res, setSearch_res] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const on_change = (val = "") => {
    if (val === "") {
      setSearch_res(null);
      setSearchInput("");
      return;
    }
    val = val.toLowerCase();
    setSearchInput(val);
    let res = files_list.songs.map((m) => ({
      title: m,
      res: m.toLowerCase().includes(val),
    }));
    setSearch_res(res);
  };
  useEffect(() => {
    const get_data = async () => {
      await get_songs_folders();
    };
    get_data();
  }, []);
  return (
    <div className="overflow-scroll w-full max-h-full px-2 bg-slate-700">
      <div className="sticky top-0 bg-slate-600">
        <div className="sticky top-0 flex justify-center p-1">
          {search ? (
            <div className="flex gap-1 items-center">
              <input
                value={search_input}
                onChange={(e) => on_change(e.target.value)}
              />
              <Button
                text="Cancel"
                onclick={() => {
                  setSearch(false);
                  setSearch_res(null);
                }}
              ></Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Button text="Get Songs" onclick={() => get_songs()} />
              <Button text="Get UVR" onclick={() => get_songs_folders()} />
              <Button text="Search" onclick={() => setSearch((m) => !m)} />
            </div>
          )}
        </div>
      </div>
      {search_res?.length > 0 &&
        search_res.map((m, i) => (
          <>
            {m.res && (
              <RenderIfVisible
                visibleOffset={2000}
                defaultHeight={ESTIMATED_ITEM_HEIGHT}
                key={m.title}
              >
                <div
                  key={i}
                  onClick={() =>
                    setCurr({
                      path: files_list.path,
                      song: files_list.songs[i],
                    })
                  }
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
                className="whitespace-nowrap overflow-hidden text-ellipsis text-white"
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
