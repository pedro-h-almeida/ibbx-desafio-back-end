const connectDatabase = require('../db');
const { Asset } = require('../models');

module.exports.createAsset = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { nome } = JSON.parse(event.body)

    const assetObj = await Asset.create({ nome })

    return {
      statusCode: 201,
      body: JSON.stringify(assetObj),
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
    }
  }
};

module.exports.getAssets = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const assetsList = await Asset.find().select('-__v')

    return {
      statusCode: 200,
      body: JSON.stringify(assetsList),
    }

  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.messasge }),
    }
  }
};

module.exports.deleteAsset = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDatabase();

    const { assetId } = event.pathParameters;

    const doc = await Asset.findOne({ _id: assetId })
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
