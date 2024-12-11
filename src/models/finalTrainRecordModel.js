const brain = require('brain.js');
const fs = require('fs');

const rawData = fs.readFileSync('trainingData/fastestLapRecordData.json');
const lapData = JSON.parse(rawData);



latestTimes = {
    "las-vegas": 94876,
    "spain": 77115 ,
    "austria": 67694 ,  
    "bahrain": 92608 ,  
    "saudi-arabia": 91632 ,  
    "australia": 79813 ,  
    "japan": 93706 ,  
    "china": 97810 ,  
    "miami": 90634 ,  
    "emilia-romagna": 78589 ,  
    "monaco":74165 ,  
    "canada": 74856,  
    "great-britain": 88293 ,  
    "hungary":80305 ,  
    "belgium": 104701,  
    "netherlands":73817 ,  
    "italy":81432 ,  
    "azerbaijan":105255 ,  
    "singapore":94486 ,  
    "united-states":97330 ,  
    "mexico": 78336,  
    "brazil":80724,  
    "qatar": 82384,  
    "abu-dhabi":85637 ,  
}




const circuitMap = lapData.reduce((acc, entry) => {
    if (!acc[entry.grand_prix_id]) {
        acc[entry.grand_prix_id] = [];
    }
    acc[entry.grand_prix_id].push(entry);
    return acc;
}, {});



maxYear = 2023;
currentYear = 2024;

predictions = {}
Object.keys(circuitMap).forEach(circuitId => {
    const circuitLaps = circuitMap[circuitId].sort((a, b) => a.year - b.year);
    trainingData = []
    let maxLapTime = 0;
 
    
    circuitLaps.forEach(entry => {
    if (entry.fastest_lap_time_millis > maxLapTime) {
        maxLapTime = entry.fastest_lap_time_millis;
    }
    });

    for (let i = 0; i < circuitLaps.length - 1; i++) {
        const currentLap = circuitLaps[i];
        const nextLap = circuitLaps[i + 1];
        if (currentLap.year < 2019) continue;

        trainingData.push({
            input: {
                year: currentLap.year / 2023, // Normalize the year
                fastest_lap_time_millis: currentLap.fastest_lap_time_millis / maxLapTime, // Normalize lap time
            },
            output: {
                fastestLapNextYear: nextLap.fastest_lap_time_millis / maxLapTime, // Normalize next year's lap time
            }
        });
    }
    const net = new brain.NeuralNetwork();



// Train the network
  
    net.train(trainingData, {
    iterations: 3000, 
    learningRate: 0.02, 
    log: false,
    logPeriod: 100, 
    });
    normalizedInput = {year: currentYear/maxYear ,fastest_lap_time_millis: latestTimes[circuitId] / maxLapTime }

    results = net.run(normalizedInput)
    timeprediction =  (results.fastestLapNextYear * maxLapTime).toFixed(0);
  
    predictions[circuitId] = parseFloat ( timeprediction)



});

console.log(predictions)

