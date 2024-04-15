var agencies = []

makeRequest('gtfsoperators', [], function(res) {
    res.forEach(function(agency, i) {
        makeRequest('VehicleMonitoring', [`agency=${agency.Id}`], function(vehicleData) {
            vehicleData = vehicleData.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity

            if (!vehicleData) vehicleData = []
            console.log(vehicleData)

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

function addVehicles(data) {
    data.vehicles.forEach(function(vehicle, i) {
        var vehicleActivity = vehicle.MonitoredVehicleJourney
        vehicleLocation = vehicleActivity.VehicleLocation

        console.log(vehicleActivity)

        var pin = new Microsoft.Maps.Pushpin(center, {
            // title: 'Microsoft',
            // subTitle: 'City Center',
            text: vehicleActivity.LineRef
        });

    })
}