const mongoose = require("mongoose");

const ShoesDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
});

const ShoesDataModel = mongoose.model(
  "ShoesData",
  ShoesDataSchema,
  "shoesData"
);
module.exports = ShoesDataModel;
