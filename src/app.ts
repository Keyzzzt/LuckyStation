import dotenv from 'dotenv'
import { connectDB } from './config/db'
import { StatisticModel } from './models/statistic.model'
import { createServer } from './server'

dotenv.config()

const PORT = Number(process.env.port)

const app = createServer()

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
    const statisticModel = await StatisticModel.findOne({ name: 'Statistic' })
    if (!statisticModel) {
      const doc = new StatisticModel()
      doc.save()
    }
  } catch (error) {
    console.log(error)
  }
}

start()
