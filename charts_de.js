var mapbox_Token =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

var csv_url =
  'https://raw.githubusercontent.com/covid19-eu-zh/covid19-eu-data/master/dataset/covid-19-de.csv'
var region_type = 'state'
var geojson_url =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/germany.geojson'
var geojson_key = 'properties.name'

var de_state_zh = {
  "Baden-Württemberg": "巴登-符腾堡",
  "Bayern": "巴伐利亚",
  "Berlin": "柏林",
  "Brandenburg": "勃兰登堡",
  "Bremen": "不来梅州",
  "Hamburg": "汉堡",
  "Hessen": "黑森",
  "Mecklenburg-Vorpommern": "梅克伦堡-前波美拉尼亚",
  "Niedersachsen": "下萨克森",
  "Nordrhein-Westfalen": "北莱茵-威斯特法伦",
  "Rheinland-Pfalz": "莱茵兰-普法尔茨",
  "Saarland": "萨尔兰",
  "Sachsen": "萨克森",
  "Schleswig-Holstein": "石勒苏益格-荷尔斯泰因",
  "Thüringen": "图林根",
}
Plotly.d3.csv(csv_url, function(err, rows) {
  function unpack(rows) {
    var daily_by_region = { regions: [] }
    rows.map(function(row) {
      if (daily_by_region[row[region_type]]) {
        daily_by_region[row[region_type]]['daily_cases'].push(row['cases'])
        daily_by_region[row[region_type]]['datetime'].push(row['datetime'])
      } else {
        daily_by_region[row[region_type]] = {}
        daily_by_region[row[region_type]]['daily_cases'] = [row['cases']]
        daily_by_region[row[region_type]]['datetime'] = [row['datetime']]
        daily_by_region.regions.push(row[region_type])
      }
    })
    return daily_by_region
  }
  
  daily_by_region = unpack(rows)
  // console.log(daily_by_region)
  var data = [
    {
      type: 'choropleth',
      locationmode: 'geojson-id',
      locations: daily_by_region.regions,
      z: daily_by_region.regions.map(function(reg) {
        return daily_by_region[reg].daily_cases[daily_by_region[reg].daily_cases.length - 1]
      }),
      text: daily_by_region.regions.map(function(state) {return de_state_zh[state]}),
      autocolorscale: true,

      zmin: 1,
      zmax: 500,
      geojson: geojson_url,
      featureidkey: geojson_key
    }
  ]

  var layout = {
    title: '德国各州确诊病例',
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
    title: '德国总确诊病例'
  }

  Plotly.newPlot('time_serie', ts_data, ts_layout)
  // console.log(daily_by_region, layout)
})
