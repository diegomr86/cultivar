require('../database')

const mongoose = require('mongoose')
const Network = mongoose.model('Network')

const prepareStage = async () => {
  // eslint-disable-next-line
  console.log('Atualizando dados para o ambiente de stage...')
  const networks = await Network.find()
  for (const network of networks) {
    network.domain_name = network.domain_name.replace(
      'sementesdoxingu.org.br',
      'terrakrya.com'
    )
    // eslint-disable-next-line
    console.log('OK - ' + network.name + ': ' +  network.domain_name)
    await network.save().catch((err) => {
      // eslint-disable-next-line
      console.log(err)
    })
  }
  process.exit()
}

prepareStage()
