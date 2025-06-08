import { ElasticSearch } from '../utils/ElasticSearch.js'

const esClient = new ElasticSearch()

/**
 * Service class for Beehive fetch operations in Elasticsearch.
 */
export class BeehiveService {
  /**
   * Fetch beehive names from Elasticsearch.
   *
   * @returns {Promise} - Promise object represents the beehive names
   */
  async fetchBeehiveNames () {
    const client = esClient.connectToElasticsearch()
    const searchParams = {
      index: 'processed_beehiveapi.beehives',
      size: 0,
      body: {
        aggs: {
          beehiveNames: {
            terms: {
              field: 'name.keyword',
              size: 100
            }
          }
        }
      }
    }

    try {
      const response = await client.search(searchParams)
      const beehiveNames = response.aggregations.beehiveNames.buckets.map(bucket => bucket.key)
      return beehiveNames
    } catch (error) {
      console.error('Something went wrong fetching beehive names from Elasticsearch:', error)
      throw error
    }
  }

  /**
   * Fetch metrics for a beehive from Elasticsearch.
   *
   * @param {string} beehiveName - Name of the beehive
   * @param {string} metricType - Type of metric to fetch
   * @param {string} startDate - Start date for the data
   * @param {string} endDate - End date for the data
   * @returns {Promise} - Promise of objects representing the metrics.
   */
  async fetchMetrics (beehiveName, metricType, startDate, endDate) {
    const client = esClient.connectToElasticsearch()
    const indexName = `processed_beehiveapi.${metricType}_${beehiveName.toLowerCase()}`
    const searchParams = {
      index: indexName,
      body: {
        query: {
          // filters documents between the timestamp range
          range: {
            timestamp: {
              gte: startDate,
              lte: endDate,
              format: 'yyyy-MM-dd'
            }
          }
        },
        size: 10000
      }
    }

    try {
      const response = await client.search(searchParams)
      if (response && response.hits && response.hits.hits && response.hits.hits.length > 0) {
        return response.hits.hits.map(hit => hit._source)
      } else {
        console.error('No data found or invalid response structure:')
        return []
      }
    } catch (error) {
      console.error('Something went wrong fetching metrics from Elasticsearch:', error)
      throw error
    }
  }
}
