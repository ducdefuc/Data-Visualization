import { BeehiveService } from '../services/beehiveService.js'

/**
 * Controller for the Beehive Metric page.
 */
export class BeehiveMetricController {
  #beehiveService

  /**
   * Constructor for the BeehiveMetricController class.
   */
  constructor () {
    this.#beehiveService = new BeehiveService()
  }

  /**
   * Fetch metrics for a beehive.
   *
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @param {Function} next - Express NextFunction object.
   */
  async fetchMetrics (req, res, next) {
    // this extracts the beehiveName, metricType and date ranges from the request parameters
    const { beehiveName, metricType } = req.params
    const { startDate, endDate } = req.query
    try {
      // Uses the BeehiveService to fetch the metrics
      const metrics = await this.#beehiveService.fetchMetrics(beehiveName, metricType, startDate, endDate)
      res.json(metrics)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      res.status(500).send('Error fetching metrics')
    }
  }
}
