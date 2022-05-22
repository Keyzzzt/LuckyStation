import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { connectDB } from './config/db'
import { AppConfigModel } from './models/appConfig.model'
import { StatisticModel } from './models/statistic.model'
import { createServer } from './server'

dotenv.config()
const PORT = Number(process.env.port)
const app = createServer()

// Serve static assets if in production mode
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
    const statisticModel = await StatisticModel.findOne({ name: 'Statistic' })
    const configModel = await AppConfigModel.findOne({ name: 'Config' })
    if (!statisticModel) {
      const doc = new StatisticModel()
      doc.save()
    }
    if (!configModel) {
      const doc = new AppConfigModel()
      doc.save()
    }
  } catch (error) {
    console.log(error)
  }
}

start()
