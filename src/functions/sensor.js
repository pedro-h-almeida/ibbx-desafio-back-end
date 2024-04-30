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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  }
};
