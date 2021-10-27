import mongoose, { ConnectOptions } from 'mongoose'

export const connectDB = async () => {
  const uri: string = process.env.mongodbURI
  try {
    const connect = await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as ConnectOptions)
    console.log(`MongoDB connected: ${connect.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
