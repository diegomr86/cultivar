require('../database')

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Group = mongoose.model('Group')

const userRoles = async () => {
  const users = await User.find()
  for (const user of users) {
    if (!user.role) {
      user.role = user.roles[0]
      await user.save()
      console.log(user.role) // eslint-disable-line
    }
  }
}

const userNetworks = async () => {
  const users = await User.find()
  for (const user of users) {
    if (user.networks.length > 0) {
      if (!user.network) {
        user.network = user.networks[0]
        await user.save()
        console.log(user.network) // eslint-disable-line
      }
    }
  }
}

const userGroups = async () => {
  const groups = await Group.find()
  for (const group of groups) {
    for (const collectorId of group.collectors) {
      const collector = await User.findOne({ _id: collectorId })
      if (!collector.group) {
        collector.group = group._id
        await collector.save()
        console.log(collector.name, collector.group) // eslint-disable-line  
      }
    }
  }
}

const fix = async () => {
  await userNetworks()
  await userRoles()
  await userGroups()
  console.log('Fix finished!') // eslint-disable-line
  process.exit()
}

fix()
