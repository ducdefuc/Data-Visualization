// src/routes/mainRouter.js

import express from 'express'

import { router as baseRouter } from './app-routers/baseRouter.js'

export const router = express.Router()

router.use('/', baseRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
