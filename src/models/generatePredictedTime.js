const fs = require('fs');
const brain = require('brain.js');


const modelData = fs.readFileSync('record_time_model.json', 'utf8');
const loadedModel = JSON.parse(modelData);


const net = new brain.NeuralNetwork();
net.fromJSON(loadedModel);

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




function predictNextLapTime(currentLapTimes, net, maxLapTime = 112416, maxYear = 2023) {
    const year = 2024; // Next year
    const predictions = {};
  
    // List of all circuits
    const circuits = [
      "las-vegas", "spain", "austria", "bahrain", "saudi-arabia", "australia", "japan", "china",
      "miami", "emilia-romagna", "monaco", "canada", "great-britain", "hungary", "belgium", "netherlands",
      "italy", "azerbaijan", "singapore", "united-states", "mexico", "brazil", "qatar", "abu-dhabi"
    ];
  
    for (const circuit of circuits) {
      const normalizedInput = {
        year: year / maxYear, // Normalize the year
        las_vegas: circuit === 'las-vegas' ? 1 : 0,
        spain: circuit === 'spain' ? 1 : 0,
        austria: circuit === 'austria' ? 1 : 0,
        bahrain: circuit === 'bahrain' ? 1 : 0,
        saudi_arabia: circuit === 'saudi-arabia' ? 1 : 0,
        australia: circuit === 'australia' ? 1 : 0,
        japan: circuit === 'japan' ? 1 : 0,
        china: circuit === 'china' ? 1 : 0,
        miami: circuit === 'miami' ? 1 : 0,
        emilia_romagna: circuit === 'emilia-romagna' ? 1 : 0,
        monaco: circuit === 'monaco' ? 1 : 0,
        canada: circuit === 'canada' ? 1 : 0,
        great_britain: circuit === 'great-britain' ? 1 : 0,
        hungary: circuit === 'hungary' ? 1 : 0,
        belgium: circuit === 'belgium' ? 1 : 0,
        netherlands: circuit === 'netherlands' ? 1 : 0,
        italy: circuit === 'italy' ? 1 : 0,
        azerbaijan: circuit === 'azerbaijan' ? 1 : 0,
        singapore: circuit === 'singapore' ? 1 : 0,
        united_states: circuit === 'united-states' ? 1 : 0,
        mexico: circuit === 'mexico' ? 1 : 0,
        brazil: circuit === 'brazil' ? 1 : 0,
        qatar: circuit === 'qatar' ? 1 : 0,
        abu_dhabi: circuit === 'abu-dhabi' ? 1 : 0,
        fastest_lap_time_millis: currentLapTimes[circuit] / maxLapTime, // Normalize current lap time
      };
  
      const normalizedPrediction = net.run(normalizedInput);
  
      // Predicted lap time for next year, denormalized
      timeprediction =  (normalizedPrediction.fastestLapNextYear * maxLapTime).toFixed(0);
  
      predictions[circuit] = parseFloat ( timeprediction)
    }
  
    return predictions;
  }


const predictedPointsForNextYear = predictNextLapTime(latestTimes, net);

console.log('Predicted Points for Next Year:', predictedPointsForNextYear);