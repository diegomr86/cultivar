require('../database')

const mongoose = require('mongoose')
const slugify = require('slugify')
const XLSX = require('xlsx')
const axios = require('axios')
const Specie = mongoose.model('Specie')
const Author = mongoose.model('Author')
const Seed = mongoose.model('Seed')

const refloraDistributions = require('../../uploads/to-import/distribution.json')
const refloraSpecieProfiles = require('../../uploads/to-import/speciesprofile.json')
const PLANILHA_GERAL =
  'Planilha_GERAL_Encontro_dados_especies_Semeadura_Direta.xlsx'
const PLANILHA_CORRECOES =
  'Rede_de_Sementes_Nomes_científicos_das_sementes_corrigidos.xlsx'

const getNames = (scientificName, qtdWords = 2) => {
  return scientificName

    .replace('(', ' ')
    .replace(')', ' ')
    .replace('.', ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(' cf.', '')
    .replace(' sp.', '')
    .replace('2019', '')
    .replace('.', ' ')
    .replace('-', ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, qtdWords)
    .join(' ')
}

const generateSlug = (scientificName, qtdWords = 2) => {
  return slugify(getNames(scientificName, qtdWords)).toLowerCase()
}

const fixSeedNames = async () => {
  const xls = XLSX.readFile('uploads/to-import/' + PLANILHA_CORRECOES)
  const sheet = xls.Sheets.Sheet1
  let i = 1
  while (i < Object.keys(sheet).length) {
    if (sheet['A' + i] && sheet['B' + i] && sheet['B' + i].v !== '(Excluir)') {
      const seeds = await Seed.find({ scientific_name: sheet['A' + i].v })
      for (const seed of seeds) {
        console.log('Updating ' + i + ': ' + seed.scientific_name + ' - ' + sheet['B' + i].v) // eslint-disable-line
        seed.scientific_name = sheet['B' + i].v
        await seed.save()
      }
    }
    i++
  }
}

const importAuthors = async () => {
  // eslint-disable-next-line
  console.log('Excluindo autores atuais do banco de dados...')
  await Author.deleteMany({})
  // eslint-disable-next-line
  console.log('Iniciando importação dos autores da ' + PLANILHA_GERAL)
  const xls = XLSX.readFile('uploads/to-import/' + PLANILHA_GERAL)
  const sheet = xls.Sheets.Autoria
  const authors = []
  let i = 4
  while (i < 100) {
    if (sheet['A' + i] && sheet['B' + i]) {
      const author = new Author()

      author.code = sheet['A' + i].v
      author.name = sheet['B' + i].v
      if (sheet['C' + i]) {
        author.description = sheet['C' + i].v
      }
      if (sheet['D' + i]) {
        author.quote = sheet['D' + i].v
      }
      if (sheet['E' + i]) {
        author.information_type = sheet['E' + i].v
      }
      if (sheet['F' + i]) {
        author.published_data = sheet['F' + i].v && sheet['F' + i].v === 'SIM'
      }
      if (sheet['G' + i]) {
        author.publication_link = sheet['G' + i].v
      }
      await author.save()
      authors.push(author)
      i++
    } else {
      break
    }
  }
  // eslint-disable-next-line
  console.log('Importação dos autores finalizada!')
}

const importSpecies = async () => {
  // eslint-disable-next-line
  console.log('Excluíndo espécies atuais do banco de dados...')
  await Specie.deleteMany({})
  // eslint-disable-next-line
  console.log('Iniciando importação da planilha ' + PLANILHA_GERAL + ' ...')
  const authorList = await Author.find()
  const xls = XLSX.readFile('uploads/to-import/' + PLANILHA_GERAL)
  const sheet = xls.Sheets['Lista principal']
  const species = []
  let i = 4
  while (i < 1000) {
    if (sheet['A' + i] && sheet['A' + i].v) {
      const specie = new Specie()
      const scientificName = sheet['C' + i].v
      specie.slug = generateSlug(scientificName)

      specie.code = sheet['A' + i].v.trim()
      specie.scientific_name = sheet['C' + i].v.trim()
      if (sheet['B' + i]) {
        specie.local_name = sheet['B' + i].v.split(',').map((i) => i.trim())
      }
      if (sheet['E' + i]) {
        specie.family = sheet['E' + i].v
      }
      specie.biomes = []
      if (sheet['F' + i] && sheet['F' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Amazônia')
      }
      if (sheet['G' + i] && sheet['G' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Cerrado')
      }
      if (sheet['H' + i] && sheet['H' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Mata Atlântica')
      }
      if (sheet['I' + i] && sheet['I' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Caatinga')
      }
      if (sheet['J' + i] && sheet['J' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Pantanal')
      }
      if (sheet['K' + i] && sheet['K' + i].v.toLowerCase() === 'x') {
        specie.biomes.push('Pampa')
      }

      if (sheet['L' + i]) {
        if (sheet['L' + i].v.includes('/')) {
          specie.vegetation_types = sheet['L' + i].v
            .split('/')
            .map((i) => i.trim())
        } else {
          specie.vegetation_types = sheet['L' + i].v
            .split(',')
            .map((i) => i.trim())
        }
      }
      if (sheet['M' + i]) {
        specie.presence = sheet['M' + i].v.split('/').map((i) => i.trim())
      }

      if (sheet['P' + i]) {
        specie.habit = sheet['P' + i].v.trim()
      }
      if (sheet['Q' + i]) {
        specie.origin = sheet['Q' + i].v.trim()
      }
      if (sheet['R' + i]) {
        specie.cycle = sheet['R' + i].v.trim()
      }
      if (sheet['T' + i]) {
        specie.occupation_strategy = sheet['T' + i].v.trim()
      }

      if (sheet['AL' + i] && sheet['AL' + i].v !== 'Sem informação') {
        const viabilityRate = {}
        const vArr = sheet['AL' + i].v.split('%')
        const tax = vArr[0]
        if (tax.includes('<')) {
          viabilityRate.from = 0
          viabilityRate.to = Number(tax.replace('<', ''))
        } else if (tax.includes('>')) {
          viabilityRate.from = Number(tax.replace('>', ''))
          viabilityRate.to = 100
        } else if (tax.includes(' a ')) {
          const taxArr = tax.split(' a ')
          viabilityRate.from = Number(taxArr[0])
          viabilityRate.to = Number(taxArr[1])
        }
        if (vArr[1]) {
          viabilityRate.description = vArr[1]
            .replace('(', '')
            .replace(')', '')
            .trim()
        }
        specie.viability_rate = viabilityRate
      }

      if (sheet['BB' + i]) {
        const seedsPerKg = sheet['BB' + i].v
        if (typeof seedsPerKg === 'string') {
          if (seedsPerKg.includes(' a ')) {
            specie.seeds_per_kg = seedsPerKg.split(' a ')[0]
          } else if (seedsPerKg.includes('/')) {
            specie.seeds_per_kg = seedsPerKg.split('/')[0]
          } else if (seedsPerKg.includes(';')) {
            specie.seeds_per_kg = seedsPerKg.split(';')[0]
          }
        }
        if (!specie.seeds_per_kg) {
          specie.seeds_per_kg = sheet['BB' + i].v
        }
      }

      if (sheet['BJ' + i]) {
        const natureOfSeedsTypes = {
          R: 'Recalcitrante',
          O: 'Ortodoxa',
          I: 'Intermediária',
        }
        const naturesOfSeeds = sheet['BJ' + i].v.split('/').map((i) => i.trim())
        specie.seed_conservations = []
        naturesOfSeeds.forEach((natureOfSeeds, index) => {
          const seedConservation = {
            nature_of_seeds: natureOfSeedsTypes[natureOfSeeds],
          }
          if (sheet['BK' + i] && sheet['BK' + i].w) {
            const authors = sheet['BK' + i].w.split('/').map((i) => i.trim())
            if (authors[index]) {
              seedConservation.author = authorList.find(
                (author) => author.code === authors[index]
              )._id
            }
          }
          specie.seed_conservations.push(seedConservation)
        })
      }

      if (sheet['DJ' + i]) {
        const tips = sheet['DJ' + i].v.split('/').map((i) => i.trim())
        specie.seed_processings = []
        tips.forEach((tip, index) => {
          const seedProcessing = {
            tip,
          }
          if (sheet['DO' + i] && sheet['DO' + i].w) {
            const authors = sheet['DO' + i].w
              .split('/')
              .map((i) => i.replace('_', '').trim())
            if (authors[index]) {
              seedProcessing.author = authorList.find(
                (author) => author.code === authors[index]
              )._id
            }
          }
          specie.seed_processings.push(seedProcessing)
        })
      }

      if (sheet['DP' + i]) {
        const tips = sheet['DP' + i].v.split('/').map((i) => i.trim())
        specie.seed_storages = []
        tips.forEach((tip, index) => {
          const seedStorage = {
            tip,
          }
          if (sheet['DX' + i] && sheet['DX' + i].w) {
            const authors = sheet['DX' + i].w
              .split('/')
              .map((i) => i.replace('_', '').trim())
            if (authors[index]) {
              seedStorage.author = authorList.find(
                (author) => author.code === authors[index]
              )._id
            }
          }
          specie.seed_storages.push(seedStorage)
        })
      }

      if (sheet['DY' + i]) {
        const tips = sheet['DY' + i].v.split('/').map((i) => i.trim())
        specie.seed_collectings = []
        tips.forEach((tip, index) => {
          const seedCollecting = {
            tip,
          }
          if (sheet['DZ' + i] && sheet['DZ' + i].w) {
            const authors = sheet['DZ' + i].w
              .split('/')
              .map((i) => i.replace('_', '').trim())
            if (authors[index]) {
              seedCollecting.author = authorList.find(
                (author) => author.code === authors[index]
              )._id
            }
          }
          specie.seed_collectings.push(seedCollecting)
        })
      }

      if (sheet['EC' + i]) {
        specie.planting_tips = sheet['EC' + i].v
      }

      specie.systematically_quantified_data =
        sheet['ED' + i] && sheet['ED' + i].v && sheet['ED' + i].v === 'SIM'
      specie.already_tested_in_direct_seedin =
        sheet['EG' + i] && sheet['EG' + i].v && sheet['EG' + i].v === 'SIM'
      specie.mapa_standard_established =
        sheet['EH' + i] && sheet['EH' + i].v && sheet['EH' + i].v === 'SIM'

      if (sheet['EI' + i]) {
        specie.lot_limit = sheet['EI' + i].v
      }
      await specie.save().catch(async (e) => {
        if (e.errors.slug) {
          specie.slug = generateSlug(scientificName, 3)
          await specie.save()
        } else {
          // eslint-disable-next-line
          console.log(e.errors)
        }
      })
      species.push(specie)
      i++
    } else {
      break
    }
  }
  // eslint-disable-next-line
  console.log('Importação da planilha finalizada!')
  // eslint-disable-next-line
  console.log('Espécies cadastradas: ' + species.length)
}

const importReflora = async () => {
  // eslint-disable-next-line
  console.log('Iniciando importação do REFLORA...')
  const errors = []
  let species = await Specie.find()
  species = species.sort(function (a, b) {
    return a.scientific_name.localeCompare(b.scientific_name)
  })
  for (const specie of species) {
    const apiResponse = await axios.get(
      encodeURI(
        'http://servicos.jbrj.gov.br/flora/taxon/' +
          getNames(specie.scientific_name)
      )
    )
    if (apiResponse.data.result && apiResponse.data.result.length) {
      let refloraItem = apiResponse.data.result.find(
        (item) => item.scientificname === specie.scientific_name
      )
      if (!refloraItem) {
        refloraItem = apiResponse.data.result[0]
      }
      if (refloraItem) {
        const newData = {}

        const distributions = refloraDistributions.distribution.filter(
          (distribution) => {
            return distribution.id.toString() === refloraItem.taxonid.toString()
          }
        )

        const presence = distributions
          .map((distribution) => {
            if (
              distribution.locationID &&
              distribution.locationID.startsWith('BR-')
            ) {
              return distribution.locationID.replace('BR-', '')
            }
            return null
          })
          .filter((distribution) => distribution)

        newData.biomes = []
        distributions.forEach((distribution) => {
          if (distribution.occurrenceRemarks) {
            const remarks = JSON.parse(distribution.occurrenceRemarks)
            if (remarks.phytogeographicDomain) {
              remarks.phytogeographicDomain.forEach((biome) => {
                if (!newData.biomes.includes(biome)) {
                  newData.biomes.push(biome)
                }
              })
            }
          }
        })

        const specieProfile = refloraSpecieProfiles.find((specieProfile) => {
          return specieProfile.id.toString() === refloraItem.taxonid.toString()
        })

        newData.vegetation_types = []
        if (specieProfile && specieProfile.lifeForm) {
          const lifeForm = JSON.parse(specieProfile.lifeForm)
          if (lifeForm) {
            if (lifeForm.vegetationType) {
              newData.vegetation_types = lifeForm.vegetationType
            }
            if (lifeForm.lifeForm) {
              newData.habit = lifeForm.lifeForm[0]
            }
          }
        }

        newData.synonyms = []
        if (refloraItem.SINONIMO) {
          refloraItem.SINONIMO.forEach((sinonimo) => {
            const slug = generateSlug(sinonimo.scientificname)
            const synonymSpecie = species.find((s) => {
              return slug === generateSlug(s.scientific_name)
            })
            if (
              synonymSpecie &&
              !newData.synonyms.includes(synonymSpecie._id)
            ) {
              newData.synonyms.push(synonymSpecie._id)
            }
          })
        }

        newData.presence = presence
        newData.family = refloraItem.family
        newData.scientific_name_authorship =
          refloraItem.scientificnameauthorship

        Object.keys(newData).forEach((k) => {
          specie[k] = newData[k]
        })

        await specie.save()
        // eslint-disable-next-line
        console.log('OK: ' + specie.scientific_name)
      } else {
        // eslint-disable-next-line
        console.error('ERRO - ESPÉCIE NÃO ENCONTRADA NA BASE REFLORA: ' + specie.scientific_name)
        errors.push(specie.scientific_name)
      }
    } else {
      // eslint-disable-next-line
      console.error('ERRO - ESPÉCIE NÃO ENCONTRADA NA BASE REFLORA: ' + specie.scientific_name)
      errors.push(specie.scientific_name)
    }
  }
  // eslint-disable-next-line
  console.log('Importação do REFLORA finalizada!')
  if (errors && errors.length) {
    // eslint-disable-next-line
    console.log("ERRO - AS SEGUINTES ESPÉCIES NÃO FORAM ENCONTRADAS NA BASE REFLORA: ", errors)
  }
}

const relateSeedSpecie = async () => {
  // eslint-disable-next-line
  console.log("Iniciando Relacionamento sementes/espécies...")
  const errors = []
  const species = await Specie.find({})
  const seeds = await Seed.find({})
  for (const seed of seeds) {
    const seedSlug = generateSlug(seed.scientific_name)
    const specie = species.find((s) => s.slug.startsWith(seedSlug))
    if (specie) {
      seed.specie = specie._id
      await seed.save()
      // eslint-disable-next-line
      console.log('OK: ' + seedSlug + ' - ' + seed.scientific_name)
    } else {
      // eslint-disable-next-line
      console.error('ERRO - ESPÉCIE NÃO ENCONTRADA ' + seed.scientific_name)
      errors.push(seed.scientific_name)
    }
  }
  // eslint-disable-next-line
  console.log('Relacionamento semente/especie finalizado')
  if (errors && errors.length) {
    // eslint-disable-next-line
    console.log("ERRO - NÃO FOI POSSÍVEL RELACIONAR AS SEGUINTES ESPÉCIES: ", errors)
  }
}

const executeImportSpecies = async () => {
  await fixSeedNames()
  await importAuthors()
  await importSpecies()
  await importReflora()
  await relateSeedSpecie()
  process.exit()
}

executeImportSpecies()
