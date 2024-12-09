const brain = require('brain.js');
const { trainingDataConstructors } = require('./trainingData/constructorData');
const maxYear = 2023; // Maximum year 
const maxPoints = 860; // Maximum points 

const trainingData = trainingDataConstructors

    const normalizedTrainingData = trainingData.map((data) => ({
        input: {
          year: data.input.year / maxYear,
          mercedes: data.input.mercedes,
          redbull: data.input.redbull,
          points: data.input.points / maxPoints,
        },
        output: {
          nextYearPoints: data.output.nextYearPoints / maxPoints,
        },
      }));
  
  // Create an

modles = [];
numModels =5;

for (let i = 0; i < numModels; i++) {
    const net = new brain.NeuralNetwork({
        hiddenLayers: [10, 10], 
        activation: 'relu', 
      });
    let trainingStatus;
    do {
        trainingStatus = net.train(normalizedTrainingData, {
            iterations: 3000, 
            learningRate: 0.05, 
            log: false,
            logPeriod: 100, 
          });
    } while (trainingStatus.error > 0.05); // Re-train until error is below 0.05

    models.push(net);
    console.log(`Model ${i + 1} successfully trained with error: ${trainingStatus.error}`);
}

