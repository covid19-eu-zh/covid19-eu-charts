var mapbox_Token =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

var csv_url =
  'https://raw.githubusercontent.com/covid19-eu-zh/covid19-eu-data/master/dataset/covid-19-de.csv'
var region_type = 'state'
var geojson_url =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/germany.geojson'
var geojson_key = 'properties.name'

Plotly.d3.csv(csv_url, function(err, rows) {
  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key]
    })
  }
  var daily_by_region = { regions: [] }
  var region = unpack(rows, region_type)
  var cases = unpack(rows, 'cases')
  var datetime = unpack(rows, 'datetime')
  var datalength = rows.length
  for (i = 0; i < datalength; i++) {
    if (daily_by_region[region[i]]) {
      daily_by_region[region[i]]['daily_cases'].push(cases[i])
      daily_by_region[region[i]]['datetime'].push(datetime[i])
    } else {
      daily_by_region[region[i]] = {}
      daily_by_region[region[i]]['daily_cases'] = [cases[i]]
      daily_by_region[region[i]]['datetime'] = [datetime[i]]
      daily_by_region.regions.push(region[i])
    }
  }
  var data = [
    {
      type: 'choropleth',
      locationmode: 'geojson-id',
      locations: daily_by_region.regions,
      z: daily_by_region.regions.map(function(reg) {
        return daily_by_region[reg].daily_cases[daily_by_region[reg].daily_cases.length - 1]
      }),
      text: unpack(rows, region_type),
      autocolorscale: true,

      zmin: 1,
      zmax: 500,
      geojson: geojson_url,
      featureidkey: geojson_key
    }
  ]

  var layout = {
    title: 'cases of COVID-19 by state',
    width: 1000,
    height: 1000,
    geo: {
      scope: 'europe',
      resolution: 50,
      showrivers: true,
      rivercolor: '#fff',
      showlakes: true,
      lakecolor: '#fff',
      showland: true,
      landcolor: '#EAEAAE',
      countrycolor: '#d3d3d3',
      countrywidth: 1.5,
      subunitcolor: '#d3d3d3',
      lonaxis: {
        range: [5, 16]
      },
      lataxis: {
        range: [46, 56]
      }
    }
  }

  Plotly.setPlotConfig({ mapboxAccessToken: mapbox_Token })
  Plotly.newPlot('map', data, layout)

  var ts_data = [
    {
      type: 'scatter',
      y: daily_by_region.sum.daily_cases,
      x: daily_by_region.sum.datetime
    }
  ]
  var ts_layout = {
    title: 'Total cases in Germany'
  }

  Plotly.newPlot('time_serie', ts_data, ts_layout)
  console.log(daily_by_region, layout)
})
