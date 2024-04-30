const connectDatabase = require('../db');
const { Sensor } = require('../models');

module.exports.createSensor = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId } = event.pathParameters;
    const { nome } = JSON.parse(event.body)

    const sensorObj = await Sensor.create({ nome, assetId })

    return {
      statusCode: 201,
      body: JSON.stringify(sensorObj),
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
    }
  }
};

module.exports.getSensors = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId } = event.pathParameters;

    const sensorsList = await Sensor.find({ assetId })

    return {
      statusCode: 200,
      body: JSON.stringify(sensorsList),
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
    }
  }
};

module.exports.deleteSensor = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId, sensorId } = event.pathParameters;

    const doc = await Sensor.findOne({ _id: sensorId, assetId  })
    await doc.deleteOne()

    return {
      statusCode: 204,
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
    }
  }
};
