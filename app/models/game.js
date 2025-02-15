// game.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, index: -1 },
  updated: { type: Date, index: -1 },
  authToken: { type: String, required: true, index: true },
  accessToken: { type: String, required: true, index: true },
  team: { type: Schema.ObjectId, index: true, ref: 'GameDevTeam' },
  slug: { type: String, required: true, index: true, lowercase: true, unique: true },
  technology: { type: String, enum: ['U3', 'H5', 'GM'], required: true, index: true },
  title: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String] },
  stats: {
    impressions: { type: Number, default: 0, required: true },
    players: { type: Number, default: 0, required: true },
    plays: { type: Number, default: 0, required: true }
  },
  images: {
    header: { type: Schema.ObjectId, ref: 'Image' },    // 1024 x 256
    card: { type: Schema.ObjectId, ref: 'Image' },      //  960 x 540
    profile: { type: Schema.ObjectId, ref: 'Image' },   //  256 x 256
    icon: { type: Schema.ObjectId, ref: 'Image' }       //   32 x  32
  },
  unity3d: {
    engineFile: { type: String },
    configFile: { type: String }
  }
});

GameSchema.index({
  title: 'text',
  headline: 'text',
  description: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    headline: 5,
    tags: 3,
    description: 2
  },
  name: 'game_text_search'
});

mongoose.model('Game', GameSchema);