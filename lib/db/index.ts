import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

/**
 * Connects to the MongoDB database using the provided MONGODB_URI or
 * process.env.MONGODB_URI.
 *
 * If the connection is already established, it returns the cached connection.
 *
 * @param {string} [MONGODB_URI] - The MongoDB URI to connect to.
 *
 * @returns {Promise<mongoose.Connection>} - The MongoDB connection.
 *
 * @throws {Error} - MONGODB_URI is missing.
 */
export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI)

  cached.conn = await cached.promise

  return cached.conn
}