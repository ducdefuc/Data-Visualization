// src/utils/elasticSearch.js

import { Client } from '@elastic/elasticsearch'

/**
 * Utility class for Elasticsearch connection.
 */
export class ElasticSearch {
  /**
   * Connect to Elasticsearch.
   *
   * @returns {Client} - Elasticsearch client object.
   */
  connectToElasticsearch = () => {
    const client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD
      },
      ssl: { rejectUnauthorized: false },
      tls: { rejectUnauthorized: false }
    })
    return client
  }
}
