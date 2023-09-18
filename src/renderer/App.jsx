import React, { Component } from "react";
import { MusicPlayer } from "./components/Player/music_player";
import MusicList from "./components/Main/MusicList";
import { Wave } from "./components/Main/wave";
// import { MusicPlayer } from "./Components/Player";
import "./index.css";
import { UVR } from "./components/Pages/uvr";

export default class App extends Component {
  render() {
    return (
      <>
        {/* <Wave/> */}
        {/* <MusicList /> */}
        {/* <MusicPlayer /> */}
        <UVR/>
      </>
    );
  }
}
