const connectDatabase = require('../db');
const { SensorData } = require('../models');
const mongoose = require('mongoose');
const { Schema } = mongoose;


module.exports.getAssetsChart = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    let option;
    const xAxisData = [];
    const seriesData = [];

    const chartData = await SensorData.aggregate([
      {
        $group: {
          _id: '$assetId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'assets',
          localField: '_id',
          foreignField: '_id',
          as: 'asset'
        }
      },
      {
        $unwind: '$asset'
      },
      {
        $project: {
          assetName: '$asset.nome',
          count: 1
        }
      }
    ]);

    if (chartData.length === 0) {
      option = null;
    } else {

      for (let index = 0; index < chartData.length; index++) {
        const element = chartData[index];
        xAxisData.push(element.assetName);
        seriesData.push(element.count)
      }

      option = {
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ option }),
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

module.exports.getSensorsChart = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId } = event.pathParameters;

    let option;
    const xAxisData = [];
    const seriesData = [];

    const chartData = await SensorData.aggregate([
      {
        $match: { assetId: new mongoose.Types.ObjectId(assetId) }
      },
      {
        $group: {
          _id: '$sensorId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'sensors',
          localField: '_id',
          foreignField: '_id',
          as: 'sensor'
        }
      },
      {
        $unwind: '$sensor'
      },
      {
        $project: {
          sensorName: '$sensor.nome',
          count: 1
        }
      }
    ]);

    if (chartData.length === 0) {
      option = null;
    } else {

      for (let index = 0; index < chartData.length; index++) {
        const element = chartData[index];
        xAxisData.push(element.sensorName);
        seriesData.push(element.count)
      }

      option = {
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ option }),
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

module.exports.getSensorDataChart = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { sensorId } = event.pathParameters;

    let option;
    const xAxisData = [];
    const seriesData = [];

    const chartData = await SensorData.find({ sensorId })

    if (chartData.length === 0) {
      option = null;
    } else {
      for (let index = 0; index < chartData.length; index++) {
        const element = chartData[index];

        const newDate = new Date(element.data);
        const dia = ("0" + newDate.getUTCDate()).slice(-2);
        const mes = ("0" + (newDate.getUTCMonth() + 1)).slice(-2);
        const ano = newDate.getUTCFullYear();

        xAxisData.push(`${dia}/${mes}/${ano}`);
        seriesData.push(element.valor)
      }

      option = {
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
      }
    }


    return {
      statusCode: 200,
      body: JSON.stringify({ option }),
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
