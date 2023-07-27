import React, { useEffect, useState } from "react";

export default function MusicList() {
  const [files_list, setFiles] = useState([
    {
      name: "filename",
      path: "filePath",
      size: 0, // kb
    },
  ]);
  useEffect(() => {
    const io_handler = async () => {
      const files = await window.electron.GetFiles();
      setFiles(files);
    };
    io_handler();
  }, []);
  return (
    <div style={{ overflow: "scroll", height: "800px" }}>
      <ul>
        {files_list &&
          files_list.length > 0 &&
          files_list.map((m, i) => (
            <li key={i}>
              <div>{m.name}</div>
              {/* <div>{m.path}</div> */}
            </li>
          ))}
      </ul>
    </div>
  );
}
