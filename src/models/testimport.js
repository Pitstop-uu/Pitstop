const fs = require('fs');
const brain = require('brain.js');


const modelData = fs.readFileSync('constructor_years_model.json', 'utf8');
const loadedModel = JSON.parse(modelData);


const net = new brain.NeuralNetwork();
net.fromJSON(loadedModel);


const testInput = {
    year: 2023 / 2022, // Normalized year
    mercedes: 0,
    redbull: 0,
    alpine: 0,
    haas: 0,
    mclaren: 0,
    RB: 0,
    kicksauber: 0,
    ferrari: 1,
    williams: 0,
    astonmartin: 0,
    points: 406 / 860, // Normalized points
  };
  
  // Run the model with the test input
  const normalizedPrediction = net.run(testInput);
  const predictedPoints = normalizedPrediction.nextYearPoints * 860; // De-normalize prediction
  
  console.log('Predicted Next Year Points:', predictedPoints);