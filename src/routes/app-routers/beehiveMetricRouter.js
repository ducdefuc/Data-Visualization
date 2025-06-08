// src/routes/app-routers/beehiveChartRouter.js

import express from 'express'

import { BeehiveMetricController } from '../../controllers/beehiveMetricController.js'

export const router = express.Router()

const controller = new BeehiveMetricController()

router.get('/:beehiveName/:metricType', (req, res, next) => controller.fetchMetrics(req, res, next))
