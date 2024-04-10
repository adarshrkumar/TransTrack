var stopsArea = document.querySelector('.stops-area')
var stops = stopsArea.querySelector('.stops')

var directionsElement = document.querySelector('#directions')

var places = [
    // '220 Demi Lane, Redwood City CA', 
    'Milbrae BART', 
    'Fishermans Wharf', 
]

window.addEventListener('DOMContentLoaded', function(e) {
    // setTimeout(function() {
        addDirections()
    // }, 1000)
})
function addDirections() {
    // Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        // Create an instance of the directions manager.
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        
        // // Calculate a date time that is 1 hour from now.
        var date = new Date();
        // date.setMinutes(date.getHours() + 1);

        // Set Route Mode to transit.
        directionsManager.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.transit,
            time: date,
            timeType: Microsoft.Maps.Directions.TimeTypes.departure,
        });

        // Add waypoints.
        places.forEach(function(p, i) {
            var waypoint = new Microsoft.Maps.Directions.Waypoint({ address: p });
            directionsManager.addWaypoint(waypoint);
        })

        // Set the element in which the itinerary will be rendered.
        directionsManager.setRenderOptions({ itineraryContainer: directionsElement });

        // Calculate directions.
        directionsManager.calculateDirections();
    });
}

document.querySelector('.add-stop').addEventListener('click', function(e) {
    var stopsAmt = stops.querySelectorAll('.stop').length

    var stopContainer = document.createElement('div')
    stopContainer.classList.add('stop-container')

    var stopParent = document.createElement('div')
    stopParent.classList.add('stop-parent')

    var stop = document.createElement('input')
    stop.classList.add('stop')
    stop.placeholder = `Stop #${stopsAmt+1}`
    stop.title = `Stop #${stopsAmt+1}`
    stopParent.appendChild(stop)

    var closeIcon = document.createElement('img')
    closeIcon.src = '/icons/close.svg'
    closeIcon.classList.add('close')
    closeIcon.alt = 'X Icon'
    stopParent.appendChild(closeIcon)

    stopContainer.appendChild(stopParent)

    var options = document.createElement('div')
    options.classList.add('options')
    stopContainer.appendChild(options)
    
    stops.appendChild(stopContainer)
})

document.querySelectorAll('.stop').onchange = stopChange

function stopChange(e) {

}