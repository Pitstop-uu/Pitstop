const brain = require('brain.js');
const fs = require('fs');
const { trainingDataConstructors } = require('./trainingData/constructorData');
const maxYear = 2023; // Maximum year 
const maxPoints = 860; // Maximum points 

const trainingData = trainingDataConstructors

    const normalizedTrainingData = trainingData.map((data) => ({
        input: {
          year: data.input.year / maxYear,
          mercedes: data.input.mercedes,
          redbull: data.input.redbull,
          mclaren: data.input.mclaren,
          alpine: data.input.alpine,
          haas: data.input.haas,
          RB: data.input.RB,
          kicksauber: data.input.kicksauber,
          ferrari: data.input.ferrari,
          williams: data.input.williams,
          astonmartin: data.input.astonmartin,

          points: data.input.points / maxPoints,
        },
        output: {
          nextYearPoints: data.output.nextYearPoints / maxPoints,
        },
      }));
  
  // Create and configure the neural network
  const net = new brain.NeuralNetwork({
    hiddenLayers: [10, 10], 
    activation: 'relu', 
  });
console.log(normalizedTrainingData)
 
  
  // Train the network
  net.train(normalizedTrainingData, {
    iterations: 3000, 
    learningRate: 0.05, 
    log: true,
    logPeriod: 100, 
  });



  const testInput = {
    year: 2023 / maxYear, 

    mercedes: 0, 
    redbull: 0,
    alpine: 0,
    haas:0,
    mclaren:1,
    RB:0,
    kicksauber:0,
    ferrari:0,
    williams:0,
    astonmartin:0,


    points: 302 / maxPoints, 
  };
  

  const normalizedPrediction = net.run(testInput);
  const predictedPoints = normalizedPrediction.nextYearPoints * maxPoints;

  

  if (predictedPoints > 0) {
    // Serialize the trained model
    const trainedModel = net.toJSON();
    
    // Save the model to a file
    const filePath = 'constructor_years_model3.json';
    fs.writeFileSync(filePath, JSON.stringify(trainedModel), 'utf8');
    
    console.log(`Model successfully trained and saved to ${filePath}`);
} else {
    console.log('Training did not succeed. Model was not exported.');
}


  
  