// src/routes/app-routers/baseRouter.js

import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as beehiveChartRouter } from './beehiveChartRouter.js'
import { router as beehiveMetricRouter } from './beehiveMetricRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/beehiveChart', beehiveChartRouter)
router.use('/metrics', beehiveMetricRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
