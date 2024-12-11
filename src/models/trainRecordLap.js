const brain = require('brain.js');
const fs = require('fs');

const rawData = fs.readFileSync('trainingData/fastestLapRecordData.json');
const lapData = JSON.parse(rawData);








const circuitMap = lapData.reduce((acc, entry) => {
    if (!acc[entry.grand_prix_id]) {
        acc[entry.grand_prix_id] = [];
    }
    acc[entry.grand_prix_id].push(entry);
    return acc;
}, {});


let maxLapTime = 0;
lapData.forEach(entry => {
    if (entry.fastest_lap_time_millis > maxLapTime) {
        maxLapTime = entry.fastest_lap_time_millis;
    }
});


console.log(maxLapTime)
const trainingData = [];


Object.keys(circuitMap).forEach(circuitId => {
    const circuitLaps = circuitMap[circuitId].sort((a, b) => a.year - b.year); 
    
    for (let i = 0; i < circuitLaps.length - 1; i++) {
        const currentLap = circuitLaps[i];
        const nextLap = circuitLaps[i + 1];
        if (currentLap.year < 2019) continue;
        // Encode all 25 circuits
        const circuitEncoding = encodeCircuitId(currentLap.grand_prix_id);
        
        trainingData.push({
            input: {
                las_vegas: circuitEncoding[0], 
                spain: circuitEncoding[1], 
                austria: circuitEncoding[2],
            
                bahrain: circuitEncoding[3], 
                saudi_arabia: circuitEncoding[4],
                australia: circuitEncoding[5],
                japan: circuitEncoding[6],
                china: circuitEncoding[7],
                miami: circuitEncoding[8],
                emilia_romagna: circuitEncoding[9],
                monaco: circuitEncoding[10],
                canada: circuitEncoding[11],
                great_britain: circuitEncoding[12],
                hungary: circuitEncoding[13],
                belgium: circuitEncoding[14],
                netherlands: circuitEncoding[15],
                italy: circuitEncoding[16],
                azerbaijan: circuitEncoding[17],
                singapore: circuitEncoding[18],
                united_states: circuitEncoding[19],
                mexico: circuitEncoding[20],
                brazil: circuitEncoding[21],
                qatar: circuitEncoding[22],
                abu_dhabi: circuitEncoding[23],
                year: currentLap.year / 2023, // Normalize the year
                fastest_lap_time_millis: currentLap.fastest_lap_time_millis / maxLapTime, // Normalize lap time
            },
            output: {
                fastestLapNextYear: nextLap.fastest_lap_time_millis / maxLapTime, // Normalize next year's lap time
            }
        });
    }
});

console.log(trainingData)


function encodeCircuitId(circuitId) {
    const circuitIds = [
        'las-vegas', 'spain', 'austria', 'bahrain', 'saudi-arabia', 'australia', 'japan', 'china',
        'miami', 'emilia-romagna', 'monaco', 'canada', 'great-britain', 'hungary', 'belgium', 'netherlands', 'italy',
        'azerbaijan', 'singapore', 'united-states', 'mexico', 'brazil', 'qatar', 'abu-dhabi'
    ];


    

    const encoded = Array(circuitIds.length).fill(0);
    const index = circuitIds.indexOf(circuitId);
    if (index !== -1) encoded[index] = 1; // One-hot encoding
    return encoded;
}


// Initialize the neural network
const net = new brain.NeuralNetwork();
//const net = new brain.recurrent.LSTM()


// Train the network
net.train(trainingData, {
    iterations: 3000, 
    learningRate: 0.02, 
    log: true,
    logPeriod: 100, 
  });

// Test the network for a specific year and circuit_id


const output = net.run({
    las_vegas: 0,
    spain: 1,
    austria: 0, // One-hot encoded circuit_id for the current circuit (Spain)
    sakhir: 0,
    bahrain: 0,
    saudi_arabia: 0,
    australia: 0,
    japan: 0,
    china: 0,
    miami: 0,
    emilia_romagna: 0,
    monaco: 0,
    canada: 0,
    great_britain: 0,
    hungary: 0,
    belgium: 0,
    netherlands: 0,
    italy: 0,
    azerbaijan: 0,
    singapore: 0,
    united_states: 0,
    mexico: 0,
    brazil: 0,
    qatar: 0,
    abu_dhabi: 0,
    
    year: 2024 / 2023, // Normalize the input year
    fastest_lap_time_millis: 77115 / maxLapTime, // Normalize lap time
});
predictedtime = output.fastestLapNextYear * maxLapTime
console.log(maxLapTime)
if (predictedtime > 0) {
    // Serialize the trained model
    const trainedModel = net.toJSON();
    
    // Save the model to a file
    const filePath = 'record_time_model.json';
    fs.writeFileSync(filePath, JSON.stringify(trainedModel), 'utf8');
    
    console.log(`Model successfully trained and saved to ${filePath}`);
} else {
    console.log('Training did not succeed. Model was not exported.');
}


