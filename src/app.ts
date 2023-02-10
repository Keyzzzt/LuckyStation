/* eslint-disable prettier/prettier,no-underscore-dangle */
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { connectDB } from './config/db'
import { AppConfigModel } from './models/appConfig.model'
import { StatisticModel } from './models/statistic.model'
import { createServer } from './server'

dotenv.config()
const PORT = Number(process.env.PORT)
const app = createServer()

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve()
  app.use(express.static(path.join(__dirname, '/client/public/uploads')))
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
