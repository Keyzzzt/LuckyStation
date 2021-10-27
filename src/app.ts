import express, { Application } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'

dotenv.config()
connectDB()

const app: Application = express()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
