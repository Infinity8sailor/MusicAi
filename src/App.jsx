import React, { Component } from "react";
import { MusicPlayer } from "./Components/Player/music_player";
import MusicList from "./Components/Main/MusicList";
// import { MusicPlayer } from "./Components/Player";

export default class App extends Component {
  render() {
    return (
      <div>
        <MusicList />
        <MusicPlayer />
      </div>
    );
  }
}
