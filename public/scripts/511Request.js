var apiKey = '6e4e4158-72bd-424d-85a3-2678e0a9854e'

function makeRequest(moduleName, params=[], callback) {
    if (params.length > 0) {
        params = `&${params.join('&')}`
    }
    else {
        params = ''
    }

    var url = `https://api.511.org/transit/${moduleName}?api_key=${apiKey}${params}`

    fetch(url)
        .then(response => response.text())
        .then(data => {
            if (
                (data.startsWith('{') && data.endsWith('}')) || 
                (data.startsWith('[') && data.endsWith(']'))
            ) data = JSON.parse(data)
            callback(data)
        })
        .catch(console.error);
}