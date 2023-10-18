import React, { useEffect, useState } from "react";
import UVRList from "../Main/uvr_list";
import { WaveMini } from "../Main/mini_wave";
import { SideBar } from "react-utility-yard";

type Props = {};

export const UVR = (props: Props) => {
  const [curr, setCurr] = useState({ path: "", song: "" });
  const streams = ["Vocals", "Bass", "Drums", "Other"];
  // useEffect(() => {}, [curr]);

  return (
    <SideBar
      sideBar_list={<UVRList setCurr={(e) => setCurr(e)} />}
      title={"Music List"}
    >
      <div
        className="flex w-full bg-slate-800  h-full"
      >
        <div className="flex flex-col overflow-y-auto w-full max-h-full">
          {curr.path !== "" && (
            <>
              <WaveMini
                url={`${curr.path}\\${curr.song}\\${curr.song}.mp3`}
                song_title={curr.song}
              />
              {streams.map((m) => (
                <WaveMini
                  url={`${curr.path}\\${curr.song}\\Demixes\\${m}.mp3`}
                  song_title={m}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </SideBar>
  );
};
