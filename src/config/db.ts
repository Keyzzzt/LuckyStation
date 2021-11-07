import mongoose from 'mongoose'

export async function connectDB() {
  const uri: string = process.env.mongodbURI
  try {
    const connect = await mongoose.connect(uri)
    console.log(`MongoDB connected: ${connect.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
