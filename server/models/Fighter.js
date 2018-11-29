const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let FighterModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const FighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  health: {
    type: Number,
    min: 0,
    required: true,
  },

  // TODO: make max health, so characters have to heal over time

  damage: {
    type: Number,
    min: 0,
    required: true,
  },

  speed: {
    type: Number,
    min: 0,
    required: true,
  },

  armor: {
    type: Number,
    min: 0,
    required: true,
  },

  crit: {
    type: Number,
    min: 0,
    required: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
  },

  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// makes each fighter name unique to each account
// i.e. (can have 2 'Jayceon' fighters if they are from different accounts, but not the same one)
FighterSchema.index({ name: 1, account: 1 }, { unique: true });

FighterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  health: doc.health,
  damage: doc.damage,
  speed: doc.speed,
  armor: doc.armor,
  crit: doc.crit,
  username: doc.username,
});

FighterSchema.statics.findByAccount = (accountId, callback) => {
  const search = {
    account: convertId(accountId),
  };

  return FighterModel.find(search)
    .select('account username name health damage speed armor crit')
    .exec(callback);
};

FighterSchema.statics.findAll = (callback) => {
  const search = { };
  return FighterModel.find(search)
    .select('account username name health damage speed armor crit')
    .limit(400)
    .exec(callback);
};

FighterSchema.statics.deleteByName = (accountId, name, callback) => {
  const search = {
    account: convertId(accountId),
    name,
  };

  return FighterModel.remove(search, callback);
};

FighterModel = mongoose.model('Fighter', FighterSchema);

module.exports.FighterModel = FighterModel;
module.exports.FighterSchema = FighterSchema;
