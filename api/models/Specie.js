const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const ViabilityRateSchema = require('./specie/ViabilityRate')
const SeedConservationSchema = require('./specie/SeedConservation')
const SeedProcessingSchema = require('./specie/SeedProcessing')
const SeedStorageSchema = require('./specie/SeedStorage')
const SeedCollectingSchema = require('./specie/SeedCollecting')
const ObjectId = mongoose.Schema.Types.ObjectId

const SpecieSchema = mongoose.Schema(
  {
    // Identificação
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      index: true,
    },
    scientific_name: {
      type: String,
      required: true,
      index: true,
    },
    scientific_name_authorship: {
      type: String,
      index: true,
    },
    local_name: {
      type: [String],
      index: true,
    },
    description: String,
    family: String,

    // Ocorrência / Indicação para plantio
    biomes: [String],
    vegetation_types: [String],
    presence: [String],

    // Classe de Sucessão
    habit: String,
    origin: String,
    cycle: String,
    occupation_strategy: String,

    // Plantio das sementes
    viability_rate: ViabilityRateSchema,
    seeds_per_kg: Number,
    seed_conservations: [SeedConservationSchema],

    // Produção das sementes
    seed_processings: [SeedProcessingSchema],
    seed_storages: [SeedStorageSchema],
    seed_collectings: [SeedCollectingSchema],
    planting_tips: String,

    // Informações gerais
    systematically_quantified_data: Boolean,
    already_tested_in_direct_seedin: Boolean,
    mapa_standard_established: Boolean,
    lot_limit: Number,

    synonyms: [
      {
        type: ObjectId,
        ref: 'Specie',
      },
    ],

    images: [Object],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

SpecieSchema.plugin(uniqueValidator, {
  message: 'Já existe uma espécie cadastrada com este nome científico',
})
SpecieSchema.virtual('seeds', {
  ref: 'Seed',
  localField: '_id',
  foreignField: 'specie',
})

mongoose.model('Specie', SpecieSchema)
