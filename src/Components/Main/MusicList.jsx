import React from "react";

export default function MusicList() {
  const files = ["helo", "duck", "tomato"];
  return (
    <div style={{ overflow: "scroll", height: "800px" }}>
      <ul>{files && files.map((m) => <li key={m}> {m} </li>)}</ul>
    </div>
  );
}
