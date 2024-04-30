const connectDatabase = require('../db');
const { SensorData } = require('../models');

module.exports.createSensorData = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId, sensorId } = event.pathParameters;

    const { data, valor } = JSON.parse(event.body)

    const sensorDataObj = await SensorData.create({ data, valor, sensorId, assetId })

    return {
      statusCode: 201,
      body: JSON.stringify(sensorDataObj),
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

module.exports.getSensorData = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId, sensorId } = event.pathParameters;

    const sensorsList = await SensorData.find({ assetId, sensorId })
    const formatedSensorList = [];

    for (let index = 0; index < sensorsList.length; index++) {
      const element = sensorsList[index];

      const newDate = new Date(element.data);
      const dia = ("0" + newDate.getUTCDate()).slice(-2);
      const mes = ("0" + (newDate.getUTCMonth() + 1)).slice(-2);
      const ano = newDate.getUTCFullYear();

      formatedSensorList.push({
        _id: element._id,
        assetId: element.assetId,
        sensorId: element.sensorId,
        valor: element.valor,
        data: `${dia}/${mes}/${ano}`,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(formatedSensorList),
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

module.exports.deleteSensorData = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId, sensorId, sensorDataId } = event.pathParameters;

    const doc = await SensorData.findOne({ _id: sensorDataId, assetId, sensorId })
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
