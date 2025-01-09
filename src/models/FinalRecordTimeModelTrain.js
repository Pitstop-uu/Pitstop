const brain = require('brain.js');
const fs = require('fs');

const rawData = fs.readFileSync('trainingData/fastestLapRecordData.json');
const lapData = JSON.parse(rawData);

const latestTimes = {
    "las-vegas": 94876,
    "spain": 77115,
    "austria": 67694,
    "bahrain": 92608,
    "saudi-arabia": 91632,
    "australia": 79813,
    "japan": 93706,
    "china": 97810,
    "miami": 90634,
    "emilia-romagna": 78589,
    "monaco": 74165,
    "canada": 74856,
    "great-britain": 88293,
    "hungary": 80305,
    "belgium": 104701,
    "netherlands": 73817,
    "italy": 81432,
    "azerbaijan": 105255,
    "singapore": 94486,
    "united-states": 97330,
    "mexico": 78336,
    "brazil": 80724,
    "qatar": 82384,
    "abu-dhabi": 85637,
};

const circuitMap = lapData.reduce((acc, entry) => {
    if (!acc[entry.grand_prix_id]) {
        acc[entry.grand_prix_id] = [];
    }
    acc[entry.grand_prix_id].push(entry);
    return acc;
}, {});


const predictions = {};

Object.keys(circuitMap).forEach(circuitId => {
    //const circuitLaps = circuitMap[circuitId].sort((a, b) => a.year - b.year);
    const circuitLaps = circuitMap[circuitId]
    .filter(lap => lap.year >= 2019)
    .sort((a, b) => a.year - b.year);
    console.log(circuitLaps)
    const trainingData = circuitLaps.map(lap => lap.fastest_lap_time_millis / Math.max(...circuitLaps.map(l => l.fastest_lap_time_millis)));

    const net = new brain.recurrent.LSTMTimeStep();

    // Train the LSTM
    net.train([trainingData], {
        iterations: 3000,
        learningRate: 0.02,
        log: false,
        logPeriod: 100,
    });

    // Predict the next year's lap time
    const lastNormalizedTime = latestTimes[circuitId] / Math.max(...circuitLaps.map(l => l.fastest_lap_time_millis));
    const predictedTimeNormalized = net.run([lastNormalizedTime]);
    const predictedTime = (predictedTimeNormalized * Math.max(...circuitLaps.map(l => l.fastest_lap_time_millis))).toFixed(0);

    predictions[circuitId] = parseFloat(predictedTime);
});

console.log(predictions);