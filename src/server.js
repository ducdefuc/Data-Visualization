// src/server.js

import dotenv from 'dotenv'
import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './routes/mainRouter.js'
import morgan from 'morgan'
import helmet from 'helmet'

dotenv.config()

try {
  const app = express()
  const PORT = process.env.PORT || 8000
  const BASE_URL = process.env.BASE_URL || '/WT2'

  const directoryFullName = dirname(fileURLToPath(import.meta.url))
  app.use(BASE_URL, express.static(join(directoryFullName, '..', 'public')))

  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.plot.ly']
      }
    }
  }))
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan('dev'))
  app.use(BASE_URL, router)

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${BASE_URL}`)
  })
} catch (error) {
  console.error('Error:', error)
}
