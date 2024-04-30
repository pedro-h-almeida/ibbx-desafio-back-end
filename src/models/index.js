const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssetSchema = new Schema({
  nome: String,
});

const SensorSchema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
  nome: String,
});

const SensorDataSchema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
  sensorId: { type: Schema.Types.ObjectId, ref: 'Sensor' },
  data: Date,
  valor: Number,
});


AssetSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const assetId = this._id;

  // Delete documents from Sensor collection referencing the Asset
  await mongoose.model('Sensor').deleteMany({ assetId: assetId }).exec();

  // Delete documents from SensorData collection referencing the Asset
  await mongoose.model('SensorData').deleteMany({ assetId: assetId }).exec();
});

SensorSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const sensorId = this._id;

  // Delete documents from SensorData collection referencing the Asset
  await mongoose.model('SensorData').deleteMany({ sensorId: sensorId }).exec();
});

SensorSchema.pre('deleteMany', { document: true, query: false }, async function() {
  const sensorId = this._id;

  // Delete documents from SensorData collection referencing the Asset
  await mongoose.model('SensorData').deleteMany({ sensorId: sensorId }).exec();
});


const Asset = mongoose.model('Asset', AssetSchema);
const Sensor = mongoose.model('Sensor', SensorSchema);
const SensorData = mongoose.model('SensorData', SensorDataSchema);


module.exports = {
  Asset,
  Sensor,
  SensorData
}