import 'dotenv/config'

export const env = {
  // Cấu hình môi trường và server
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_HOST: process.env.APP_HOST || 'localhost',
  APP_PORT: process.env.APP_PORT || 8017,
  
  // Cấu hình database
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME || 'english-learning',
  
  // Cấu hình JWT Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d' // Token hết hạn sau 7 ngày
}