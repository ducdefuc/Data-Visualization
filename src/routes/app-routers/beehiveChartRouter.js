// src/routes/app-routers/beehiveChartRouter.js

import express from 'express'

import { BeehiveChartController } from '../../controllers/beehiveChartController.js'

export const router = express.Router()

const controller = new BeehiveChartController()

router.get('/', (req, res, next) => controller.index(req, res, next))
