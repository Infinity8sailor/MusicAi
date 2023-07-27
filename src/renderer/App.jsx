import React, { Component } from "react";
import { MusicPlayer } from "./components/Player/music_player";
import MusicList from "./components/Main/MusicList";
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
