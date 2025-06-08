import { BeehiveService } from '../services/beehiveService.js'

/**
 * Controller for the Beehive Chart page.
 */
export class BeehiveChartController {
  #beehiveService

  /**
   * Constructor for the BeehiveChartController class.
   */
  constructor () {
    this.#beehiveService = new BeehiveService()
  }

  /**
   * Render the beehive chart page.
   *
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @param {Function} next - Express NextFunction object.
   */
  async index (req, res, next) {
    try {
      const beehiveNames = await this.#beehiveService.fetchBeehiveNames()
      res.render('visuals/beehiveChart', { beehiveNames })
    } catch (error) {
      console.error('Failed to fetch beehive names:', error)
      res.status(500).send('Error fetching beehive data')
    }
  }
}
