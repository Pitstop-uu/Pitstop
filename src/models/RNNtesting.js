const brain = require('brain.js');

// Helper functions for normalization
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function denormalize(value, min, max) {
    return value * (max - min) + min;
}

// Original training data
const rawTrainingData = [
    { input: { points: [319, 585.5, 759, 860] }, output: [589] },
];

// Find the min and max values for normalization
const inputValues = rawTrainingData.flatMap(d => [
    ...d.input.points,
    ...d.output
]);
const minInput = Math.min(...inputValues);
const maxInput = Math.max(...inputValues);

// Normalize the training data
const trainingData = rawTrainingData.map(data => ({
    input: [
        ...data.input.points.map(value => normalize(value, minInput, maxInput)),
    ],
    output: data.output.map(value => normalize(value, minInput, maxInput)),
}));

// Initialize the LSTMTimeStep model
const config = {
    inputSize: 20,
    inputRange: 20,
    hiddenLayers: [20, 20],
    outputSize: 20,
    learningRate: 0.01,
    decayRate: 0.999,
  };

// Create a simple recurrent neural network
const net = new brain.recurrent.RNN(config);

// Train the model
net.train(trainingData);

// Normalize a sample input for prediction
const sampleInput = { points: [585.5,759,860,589] };
const normalizedSampleInput = [
    ...sampleInput.points.map(value => normalize(value, minInput, maxInput)),

];

// Run the model and get normalized output
const normalizedOutput = net.run(normalizedSampleInput);

// If needed, denormalize the output
const output = denormalize(normalizedOutput, minInput, maxInput);

console.log('Normalized Output:', normalizedOutput);
console.log('Denormalized Output:', output);