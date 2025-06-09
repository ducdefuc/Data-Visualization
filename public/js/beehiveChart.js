// src/public/js/beehiveChart.js

/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', function () {
  const beehiveSelect = document.getElementById('beehiveSelect')
  setDateRange(beehiveSelect.value)

  beehiveSelect.addEventListener('change', function () {
    setDateRange(this.value)
  })

  document.getElementById('updateChartButton').addEventListener('click', async function () {
    // Sets the parameters for the fetchMetrics function based on what the user has selected
    const beehiveName = beehiveSelect.value
    const startDate = document.getElementById('startDate').value
    const endDate = document.getElementById('endDate').value
    const metrics = Array.from(document.querySelectorAll('input[name="dataType"]:checked')).map(input => input.value)

    if (metrics.length === 0) {
      document.getElementById('errorMessage').textContent = 'No metrics selected.'
      document.getElementById('errorMessage').style.display = 'block'
      Plotly.purge('chartDiv')
      return
    }

    // Show loading screen on button click
    showLoadingScreen(true)

    try {
      // use fetchMetrics function to fetch data for each metric by resolving all promises at once.
      const results = await Promise.all(metrics.map(metric => fetchMetrics(beehiveName, metric, startDate, endDate)))
      // Filter results to only include those with non-empty data arrays
      const validResults = results.filter(result => result && result.data.length > 0)
      if (validResults.length > 0) {
        // Update the chart with valid results if they exist
        updateChart(validResults)
        document.getElementById('errorMessage').style.display = 'none'
      } else {
        document.getElementById('errorMessage').textContent = 'No data for the chosen time period.'
        document.getElementById('errorMessage').style.display = 'block'
        Plotly.purge('chartDiv')
      }
    } catch (error) {
      document.getElementById('errorMessage').textContent = 'An error occurred while fetching data.'
      document.getElementById('errorMessage').style.display = 'block'
    }
    // Hide loading screen when data is fetched
    showLoadingScreen(false)
  })
})

/**
 * Fetch metric data from the server by sending a GET request to the server.
 *
 * @param {string} beehiveName - Name of the beehive
 * @param {string} metric - Name of the metric
 * @param {string} startDate - Start date for the data
 * @param {string} endDate - End date for the data
 * @returns {Promise} - Promise object represents the metric data
 */
async function fetchMetrics (beehiveName, metric, startDate, endDate) {
  try {
    const response = await fetch(`/beehive-visualization/metrics/${beehiveName}/${metric}?startDate=${startDate}&endDate=${endDate}`)
    const data = await response.json()
    return { metric, data }
  } catch (error) {
    return null
  }
}

/**
 * Set the date range for the selected beehive.
 *
 * @param {string} beehiveName - Name of the beehive to set the date range for.
 */
function setDateRange (beehiveName) {
  const dateRanges = {
    2017: { min: '2017-01-01', max: '2017-12-31' },
    Schwartau: { min: '2018-01-01', max: '2018-12-31' },
    Wurzburg: { min: '2018-01-01', max: '2018-12-31' }
  }

  const dates = dateRanges[beehiveName]
  const startDateElement = document.getElementById('startDate')
  const endDateElement = document.getElementById('endDate')
  const dateRangeMessage = document.getElementById('dateRangeMessage')

  if (dates.min && dates.max) {
    startDateElement.min = dates.min
    startDateElement.max = dates.max
    endDateElement.min = dates.min
    endDateElement.max = dates.max
    startDateElement.value = dates.min // Set the start date to display january
    endDateElement.value = dates.min // Set the end date to display january
    dateRangeMessage.textContent = `Data is available from ${dates.min} to ${dates.max} for selected beehive.`
  }
}

/**
 * Show or hide the loading screen.
 *
 * @param {boolean} showOrNot - Show or hide the loading screen
 */
function showLoadingScreen (showOrNot) {
  const loadingOverlay = document.getElementById('loadingOverlay')
  const loadingIndicator = document.getElementById('loadingIndicator')
  const chartDiv = document.getElementById('chartDiv')

  if (showOrNot) {
    loadingOverlay.style.display = 'block'
    loadingIndicator.style.display = 'block'
    chartDiv.style.display = 'none'
  } else {
    loadingOverlay.style.display = 'none'
    loadingIndicator.style.display = 'none'
    chartDiv.style.display = 'block'
  }
}

/**
 * Update plotly chart.
 *
 * @param {Array} results - Metric data.
 */
function updateChart (results) {
  const metricColors = {
    humidity: '#1f77b4',
    temperature: '#ff7f0e',
    weight: '#2ca02c',
    flow: '#d62728'
  }

  // Create traces for each metric
  const traces = results.map(result => ({
    name: result.metric,
    type: 'scatter',
    mode: 'markers',
    x: result.data.map(entry => entry.timestamp), // Use timestamp for x-axis values
    y: result.data.map(entry => entry[result.metric]), // Use metric values for y-axis
    marker: { color: metricColors[result.metric] }
  }))

  // Create layout for the chart
  const layout = {
    title: results.map(result => result.metric).join(', ') + ' Data', // Title includes all metrics
    xaxis: { title: 'Timestamp', type: 'date' },
    yaxis: { title: 'Value' },
    showlegend: true
  }

  Plotly.newPlot('chartDiv', traces, layout)
}
