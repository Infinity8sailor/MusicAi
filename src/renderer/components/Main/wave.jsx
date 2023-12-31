// import React, { useEffect, useState } from "react";
// // A super-basic example
// import WaveSurfer from "wavesurfer.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm";

// import { AutoClusteringAlgo } from "./misc";

// const options = {
//   /** HTML element or CSS selector (required) */
//   container: "body",
//   /** The height of the waveform in pixels */
//   height: 100,
//   /** Render each audio channel as a separate waveform */
//   splitChannels: false,
//   /** Stretch the waveform to the full height */
//   normalize: false,
//   /** The color of the waveform */
//   waveColor: "#ff4e00",
//   /** The color of the progress mask */
//   progressColor: "#dd5e98",
//   /** The color of the playpack cursor */
//   cursorColor: "#ddd5e9",
//   /** The cursor width */
//   cursorWidth: 2,
//   /** Render the waveform with bars like this: ▁ ▂ ▇ ▃ ▅ ▂ */
//   barWidth: 0,
//   /** Spacing between bars in pixels */
//   barGap: 0,
//   /** Rounded borders for bars */
//   barRadius: 1,
//   /** A vertical scaling factor for the waveform */
//   barHeight: 1,
//   /** Vertical bar alignment **/
//   barAlign: "",
//   /** Minimum pixels per second of audio (i.e. zoom level) */
//   minPxPerSec: 1,
//   /** Stretch the waveform to fill the container, true by default */
//   fillParent: true,
//   /** Audio URL */
//   url: "/examples/audio/audio.wav",
//   /** Whether to show default audio element controls */
//   mediaControls: true,
//   /** Play the audio on load */
//   autoplay: false,
//   /** Pass false to disable clicks on the waveform */
//   interact: true,
//   /** Hide the scrollbar */
//   hideScrollbar: false,
//   /** Audio rate */
//   audioRate: 1,
//   /** Automatically scroll the container to keep the current position in viewport */
//   autoScroll: true,
//   /** If autoScroll is enabled, keep the cursor in the center of the waveform during playback */
//   autoCenter: true,
//   /** Decoding sample rate. Doesn't affect the playback. Defaults to 8000 */
//   sampleRate: 8000,
// };

// // Give regions a random color when they are created
// const random = (min, max) => Math.random() * (max - min) + min;
// const randomColor = () =>
//   `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
// let activeRegion = null;



// export const Wave = ({ url = null, song_title = "None", on_end = null }) => {
//   const [wavesurfer, setWavesurfer] = useState(null);
//   const [wsRegions, setWsRegions] = useState(null);
//   // let wavesurfer = null;
//   const [regions, setRegions] = useState(null);
//   // var wsRegions = null;
//   const [loop, setLoop] = useState(false);

//   const add_region = ({
//     name = `Region : ${regions ? regions.length : 0}`,
//     start = 0,
//     end = 20,
//     _wsr = wsRegions,
//   }) => {
//     _wsr?.addRegion({
//       content: name,
//       start,
//       end,
//       color: randomColor(),
//       // drag: false,
//       resize: true,
//       minLength: 1,
//       // maxLength: 10,
//     });
//   };

//   const save_regions = () => {
//     const region_scheme = {
//       name: "Unknown",
//       start: 0,
//       end: 20,
//       color: "rgba(0,255,0,0.5)",
//       tags: ["None"],
//     };

//     // get_regions();
//     let raw_regions = [];

//     if (regions && regions.length > 0) {
//       raw_regions = regions.map((m) => ({
//         name: m.content ? m.content.innerText : "Unknown",
//         start: m.start,
//         end: m.end,
//         color: "rgba(0,255,0,0.5)",
//       }));
//     }
//     window.electron.save_regions({ title: song_title, regions: raw_regions });
//     // console.log(raw_regions);
//   };
//   const get_saved_regions = async ({ _wsr = null }) => {
//     await window.electron.get_saved_regions({
//       title: song_title,
//     });
//     await window.electron.ipcRenderer.on("take-saved-regions", (info) => {
//       if (!_wsr) _wsr = wsRegions;
//       if (info.regions && info.regions.length > 0)
//         info.regions.map((m) => add_region({ ...m, _wsr }));
//     });
//   };

//   const get_regions = (_wsRegions = wsRegions) => {
//     if (!_wsRegions) return;
//     let re = _wsRegions.getRegions();
//     setRegions([...re]);
//     return [...re];
//   };

//   useEffect(() => {
//     console.log("wave");
//     AutoClusteringAlgo(url);
//     options.container = document.getElementById("wave");
//     options.url = url;

//     let _wavesurfer = WaveSurfer.create(options);
//     setWavesurfer(_wavesurfer);

//     // Initialize the Regions plugin
//     let _wsRegions = _wavesurfer.registerPlugin(RegionsPlugin.create());
//     setWsRegions(_wsRegions);

//     // Create some regions at specific time ranges
//     _wavesurfer.on("decode", () => {
//       get_saved_regions({ _wsr: _wsRegions });
//     });

//     _wsRegions.enableDragSelection({
//       color: "rgba(255, 0, 0, 0.1)",
//     });

//     _wsRegions.on("region-updated", (region) => {
//       // console.log("Updated region", region);
//       // get_regions();
//     });

//     // Loop a region on click
//     // let loop = true;
//     {
//       _wsRegions.on("region-in", (region) => {
//         activeRegion = region;
//       });
//       _wsRegions.on("region-out", (region) => {
//         if (activeRegion === region) {
//           if (loop) {
//             region.play();
//           } else {
//             activeRegion = null;
//           }
//         }
//       });
//       _wsRegions.on("region-clicked", (region, e) => {
//         e.stopPropagation(); // prevent triggering a click on the waveform
//         activeRegion = region;
//         region.play();
//         region.setOptions({ color: randomColor() });
//       });
//       // Reset the active region when the user clicks anywhere in the waveform
//       _wavesurfer.on("interaction", () => {
//         activeRegion = null;
//       });
//     }

//     _wavesurfer.on("ready", () => {
//       _wavesurfer.setTime(0);
//       _wavesurfer.play();
//       // get_regions();
//     });
//     _wavesurfer.on("finish", () => {
//       on_end();
//     });

//     _wsRegions.on("region-created", (region, e) => {
//       // setWsRegions(_wsRegions);
//       console.log("region Created");
//       get_regions(_wsRegions);
//     });

//     return () => {
//       document.getElementById("wave").replaceChildren("");
//       _wavesurfer.destroy();
//       setRegions(null);
//     };
//   }, [url]);

//   return (
//     <div id="wave-wrapper" style={{ width: "inherit" }}>
//       <div> {song_title}</div>
//       <div id="wave"></div>
//       <button onClick={add_region}>Add Region</button>
//       {/* <button onClick={() => get_regions()}>Get Regions</button> */}
//       {/* <button onClick={() => get_saved_regions()}>Get saved Regions</button> */}
//       <button onClick={() => save_regions()}>Save Regions</button>
//       <label for="loop">loop</label>
//       <input
//         type="checkbox"
//         id="loop"
//         name="loop"
//         value={loop}
//         onChange={() => setLoop((m) => !m)}
//       />
//       <button onClick={() => on_end()}>Next</button>
//       <ol>
//         {regions &&
//           regions.length > 0 &&
//           regions.map((m) => (
//             <li key={m.id}>
//               <span>{m.content?.innerText}</span>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevent triggering a click on the waveform
//                   activeRegion = m;
//                   m.play();
//                   m.setOptions({ color: randomColor() });
//                 }}
//               >
//                 play
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevent triggering a click on the waveform
//                   m.remove();
//                   get_regions();
//                   if (activeRegion === m) {
//                     wavesurfer.stop();
//                     activeRegion = null;
//                   }
//                 }}
//               >
//                 delete
//               </button>
//             </li>
//           ))}
//       </ol>
//     </div>
//   );
// };
