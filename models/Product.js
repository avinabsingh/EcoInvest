const mongoose = require('mongoose');

const ProductEmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: {type: String, required: true},
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  emission_factor: {
    activity_id: String,
    id: String,
    source: String,
    source_dataset: String,
    year: Number,
    category: String,
    source_lca_activity: String
  },
  constituent_gases: {
    co2e_total: Number,
    co2e_other: Number,
    co2: Number
  },
  activity_data: {
    activity_value: Number,
    activity_unit: String
  }
});

module.exports = mongoose.model('ProductEmission', ProductEmissionSchema);
