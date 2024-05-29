var settingEles = document.querySelectorAll('setting-option')
var selectEles = document.querySelectorAll('setting-option select')

addEventListener('DOMContentLoaded', function() {
    if (location.pathname.startsWith('/settings')) {
        settingEles.forEach(function(s, i) {
            s.querySelector('select').onchange = function(e) {
                setSetting(s.getAttribute('module-name'), e.target.value)
            }
        })    
    }
})

var setTheme = function(t) {
    document.documentElement.setAttribute('data-theme', t || 'system')
}
var settingsKey = 'settings'

var settingFunctions = {
    theme: function(theme) {
        setTheme(theme)
    }
}
applySettings()

function getSettings() {
    var settings = localStorage.getItem(settingsKey) || '[]'
    settings = JSON.parse(settings)
    return settings
}

function applySettings() {
    var settings = getSettings()
    settings.forEach(function(s, i) {
        settingFunctions[s.name](s.content)()
    })

    if (location.pathname.startsWith('/settings') && settings.length > 0) {
        settingEles.forEach(function(s, i) {
            var setting = settings.filter(filterCheck)[0].content
            s.querySelector('select').value = setting
        })    
    }
}

function filterCheck(setting) {
    return setting.name === 'theme'
}

function setSetting(name, value, type, key) {
    var settings = getSettings()
    console.log(settings)

    var item = ''
    if (settings.length > 0) {
        item = settings.filter(filterCheck)[0]
    }

    var index = settings.indexOf(item)

    if (index < 0 || settings.length < 1) {
        var settingsLength = settings.length
        settings.push({name: name})
        index = settingsLength
    }

    var setting = settings[index]
    var content = setting.content
    if (!!content === false) {
        switch(type) {
            case 'object': 
                content = {}
                break
            case 'list': 
                content = []
                break
            default: 
                content = ''
                break
        }
    }

    switch(type) {
        case 'object': 
            content[key] = value
            break
        case 'list': 
            content.push(value)
            break
        default: 
            content = value
            break
    }

    setting.content = content
    settings[index] = setting
    settings = JSON.stringify(settings)
    localStorage.setItem(settingsKey, settings)
}