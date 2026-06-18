const mongoose = require('mongoose')

// Create Schema
const trameSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: false,
      description: 'logged in user or public user',
      trim: true,
    },
    port: {
      type: Number,
      required: true,
      unique: true,
      description: 'unique port number of the trame app server',
    },
    app: {
      type: String,
      required: true,
      description: 'trame app name',
      trim: true,
    },
    data: {
      type: String,
      required: true,
      description: 'trame app input data',
      trim: true,
    },
    pid: {
      type: Number,
      required: true,
      unique: true,
      description: 'unique port number of the trame app process id',
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created', // Use `created` to store the created date
      updatedAt: 'updated', // and `updated` to store the last updated date
    },
  },
)

module.exports = mongoose.model('trame', trameSchema)
