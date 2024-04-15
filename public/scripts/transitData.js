var agencies = []

makeRequest('gtfsoperators', [], function(res) {
    res.forEach(function(agency, i) {
        makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
            vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity

            if (!vehicleData) vehicleData = []
            console.log(vehicleData, i)

            addVehicles({
                id: agency.id, 
                name: agency.name, 
                vehicles: vehicleData
            })

            agencies[i] = {
                id: agency.Id, 
                name: agency.name, 
                vehicles: vehicleData
            }
        })
    })
})

function addVehicles(data, i) {
    agencies[i].vehiclePins = []
    data.vehicles.forEach(function(vehicle) {
        var vehicleActivity = vehicle.MonitoredVehicleJourney
        vehicleLocation = vehicleActivity.VehicleLocation

        var color = ''

        
        pin = new Microsoft.Maps.Pushpin(vehicleLocation, {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect x="0" y="0" width="40" height="30" fill="${color ? color : 'black'}" /><text x="50%" y="50%" dy="2" textLength="35" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${vehicleActivity.LineRef}</text></svg>`,
            // title: 'Microsoft',
            // subTitle: 'City Center',
            // text: vehicleActivity.LineRef
        });
        
        //Add the pushpin to the map
        map.entities.push(pin);
        console.log(pin)
        agencies[i].vehiclePins.push(pin)
    })
}