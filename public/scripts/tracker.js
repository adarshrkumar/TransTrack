var map, infobox, watchId, Microsoft, positionInterval = null
var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'

var agencyIds = []
var agencies = {}
var allPins = []

var colors = ['#0000FF','#FFA500','#6A4A3A','#800080','#800000','#40E0D0','#FF00FF','#000035','#FF6347','#FA8072','#808000','#7F00FF','#73BF00','#CD7F32','#8A2BE2','#3CB371','#2E8B57','#D2691E','#4682B4','#FF4500','#8B008B','#556B2F', '#8B4513', '#00CED1', '#483D8B', '#8B0000', '#9932CC', '#556B2F', '#2E8B57', '#6B8E23', '#9932CC', '#FF6347', '#20B2AA']


function onMapLoad() {
    makeRequest('gtfsoperators', [], function(res) {
        res.forEach(function(agency, i) {
            var cI = i
            if (cI >= colors.length) cI = cI - colors.length
            var color = colors[cI]

            agencyIds.push(agency)

            makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
                var vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
                if (!vehicleData || typeof vehicleData !== 'object') vehicleData = []
                
                var aObj = agencies[agency.Id]
                if (!aObj) {
                    aObj = {
                        id: agency.Id, 
                        name: agency.Name, 
                        vehicles: {
                            data: vehicleData, 
                            pins: {}, 
                        }
                    }
                }
                else {
                    aObj.vehicles.data = vehicleData
                }
                
                var goodPins = []
                
                vehicleData.forEach(function(vehicle) {
                    var vehicleRef = vehicle.MonitoredVehicleJourney.VehicleRef
                    if (aObj.vehicles.pins[vehicleRef]) {
                        goodPins.push({
                            name: vehicleRef, 
                            content: aObj.vehicles.pins[vehicleRef]
                        })
                    }
                })
                aObj.vehicles.pins = {}
                goodPins.forEach(function(pin) {
                    aObj.vehicles.pins[pin.name] = pin.content
                })
                
                vehicleData.forEach(function(vehicle, vI) {
                    var vehicleActivity = vehicle.MonitoredVehicleJourney
                    vehicleActivity.agency = agency.Name
                    vehicleActivity.aId = agency.Id
                    vehicleActivity.i = vI
                    var vehicleRef = vehicleActivity.VehicleRef
                    var vehicleLocation = vehicleActivity.VehicleLocation
                    vehicleLocation = {
                        longitude: vehicleLocation.Longitude, 
                        latitude: vehicleLocation.Latitude, 
                        // altitude: 0, 
                        // altitudeReference: -1,
                    }
                    
                    switch (vehicleActivity.OperatorRef) {
                        case 'SF': 
                            var publishedLineName = vehicleActivity.PublishedLineName
                            if (publishedLineName) {
                                if (publishedLineName.includes(' ')) publishedLineName = publishedLineName.split(' ')
                                else publishedLineName = [publishedLineName]
                            
                                publishedLineName.forEach(function(p, i) {
                                    publishedLineName[i] = `${p[0]}${p.substring(1).toLowerCase()}`
                                })
                                
                                publishedLineName = publishedLineName.join(' ')
                                vehicleActivity.PublishedLineName = publishedLineName
                            }
                    }

                    var route = vehicleActivity.LineRef
                    if (route) {
                        var width = 30
                        if (route.length > 3) {
                            var exces = route.length-3
                            for (let i3 = 0; i3 < exces; i3++) {
                                width += 5
                            }
                        }
                        
                        if (color.toString().startsWith('#') && Microsoft.Maps.Color) {
                            if (Microsoft.Maps.Color.fromHex) color = Microsoft.Maps.Color.fromHex(color)
                            else color = 'red'
                        }
                        // Add the pushpin to the map
                        var pin = aObj.vehicles.pins[vehicleRef]
                        if (pin) {
                            pin.setLocation(vehicleLocation);
                        }
                        else {
                            vehicleActivity.infoboxOpen = false
                            pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
                                text: route,
                                color: color, 
                                // icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20"><rect x="0" y="0" width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="${width-5}" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
                            });
                            pin.metadata = vehicleActivity;
                            
                            var events = ['click']
                            events.forEach(function(ev) {
                                Microsoft.Maps.Events.addHandler(pin, ev, showVehicleInfo);
                            })
                            
                            map.entities.push(pin);
                        }
                        aObj.vehicles.pins[vehicleRef] = pin
                    }
                })

                agencies[agency.Id] = aObj
            })
        })
    })
}

GetMap()
function GetMap() {
    if (document.getElementById('myMap') && Microsoft) {
        map = new Microsoft.Maps.Map('#myMap');
        infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });

        //Assign the infobox to a map instance.
        infobox.setMap(map);
        if (onMapLoad) onMapLoad()
        positionInterval = setInterval(onMapLoad, 60000)
    }
    else {
        window.addEventListener('DOMContentLoaded', GetMap)
    }
}


function showVehicleInfo(e) {
        //Make sure the infobox has metadata to display.
        var data = e.target.metadata
        if (data) {
            // agencyIds.forEach(function(id, i) {
            //     if (agencies[id]) {
            //         agencies[id].vehicles.pins.forEach(function(p, pI) {
            //             agencies[id].vehicles.pins[pI].metadata.infoboxOpen = false
            //         })
            //     }
            // })
            
            // Set the infobox options with the metadata of the pushpin.
            var isSmallScreen = window.matchMedia('(max-width: 915px)').matches
            if (isSmallScreen) {
                
            }
            
            // agencies[data.aId].vehicles.pins[data.i].metadata.infoboxOpen = true

            console.log(data)

            data.LineName = data.PublishedLineName
            if (data.LineName.includes(' - ')) data.LineName = data.LineName.split(' - ').join(' / ')
            if (data.LineName.includes('\\')) data.LineName = data.LineName.split('\\').join('/')
            if (data.LineName.includes('/')) data.LineName = data.LineName.split('/').join(' / ')
            if (data.LineName.includes('  ')) data.LineName = data.LineName.split('  ').join(' ')

            var options = {
                title: [
                    `${data.agency}`, 
                    `${data.LineRef}: ${data.LineName}`
                ], 
                description: [
                    // `Agency: ${data.agency}`,
                    `Origin: ${data.OriginName ? data.OriginName : 'No Origin or Unknown'}`,
                    `Destination: ${data.DestinationName ? data.DestinationName : 'No Destination or Unknown'}`,
                    `Congestion: ${data.InCongestion ? 'Congested' : 'Not Congested or Unknown'}`,
                    `Occupancy: ${data.Occupancy ? data.Occupancy : 'Unknown'}`,
                    `Vehicle ID: ${data.VehicleRef ? data.VehicleRef : 'Unknown'}`
                ]
            }
            
            infobox.setOptions({
                location: e.target.getLocation(),
                title: options.title,
                htmlContent: `<div class="infobox"><span class="title">${options.title.join('<br>')}</span><br><span>${options.description.join('</span><br><span>')}</span></div>`,
                visible: true
            });
        }
}