export const AutoClusteringAlgo = (src) => {
  //   var source;
  console.log("Reading Source : ", src);
  const audioCtx = new AudioContext();
  return fetch(src)
    .then((response) => response.arrayBuffer())
    .then((buffer) =>
      audioCtx
        .decodeAudioData(buffer)
        .then((audioBuffer) => filterData(audioBuffer))
    );
};

const filterData = (audioBuffer) => {
  //   console.log(audioBuffer);
  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  const samples = audioBuffer.duration; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
  const filteredData = [];

  let cluster = [];
  var start = null;
  var peak = 0;

  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    peak = peak < sum / blockSize ? sum / blockSize : peak;
    filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  }
  //   console.log(peak);
  peak = peak / 4;

  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; // the location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
    }
    if (sum / blockSize > peak) {
      if (!start) start = i;
    } else {
      if (start) {
        cluster.push([start, i]);
        start = null;
      }
    }
  }
  cluster = cluster.sort((a, b) => b[1] - b[0] - (a[1] - a[0])).slice(0, 10);
  return cluster;
};
