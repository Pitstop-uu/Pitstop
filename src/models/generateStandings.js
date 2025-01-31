const fs = require('fs');
const brain = require('brain.js');


const modelData = fs.readFileSync('constructor_years_model2.json', 'utf8');
const loadedModel = JSON.parse(modelData);


const net = new brain.NeuralNetwork();
net.fromJSON(loadedModel);

const currentPoints={
  mercedes: 468,
  redbull: 589,
  alpine: 65,
  haas: 58,
  mclaren: 666,
  RB: 46,
  kicksauber: 4,
  ferrari: 652,
  williams: 17,
  astonmartin: 94,

}

//const testInput = {
//    year: 2023 / 2022, // Normalized year
//    mercedes: 0,
//    redbull: 0,
//    alpine: 0,
//    haas: 0,
//    mclaren: 0,
//    RB: 0,
//    kicksauber: 0,
//    ferrari: 1,
//    williams: 0,
//    astonmartin: 0,
//    points: 406 / 860, // Normalized points
//  };
  
function predictNextYear(currentPoints, net, maxPoints = 860, maxYear = 2023) {
  const year = 2024; // Current year
  const predictions = {};

  for (const team in currentPoints) {
    const normalizedInput = {
      year: year / maxYear, // Normalize the year
      mercedes: team === 'mercedes' ? 1 : 0,
      redbull: team === 'redbull' ? 1 : 0,
      alpine: team === 'alpine' ? 1 : 0,
      haas: team === 'haas' ? 1 : 0,
      mclaren: team === 'mclaren' ? 1 : 0,
      RB: team === 'RB' ? 1 : 0,
      kicksauber: team === 'kicksauber' ? 1 : 0,
      ferrari: team === 'ferrari' ? 1 : 0,
      williams: team === 'williams' ? 1 : 0,
      astonmartin: team === 'astonmartin' ? 1 : 0,
      points: currentPoints[team] / maxPoints, // Normalize points
    };


    const normalizedPrediction = net.run(normalizedInput);

  
    const predictedPoints = (normalizedPrediction.nextYearPoints * maxPoints).toFixed(0);


    predictions[team] = parseFloat(predictedPoints);
  }

  return predictions;
}


const predictedPointsForNextYear = predictNextYear(currentPoints, net);

console.log('Predicted Points for Next Year:', predictedPointsForNextYear);
