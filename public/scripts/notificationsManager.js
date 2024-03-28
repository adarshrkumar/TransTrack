function addNotification(module, name, icon, content, attatchmentInfo) {
    var notificationList = localStorage.getItem('notifications')
    if (!!notificationList === false) notificationList = '[]'
    notificationList = JSON.parse(notificationList)

    var package = packageNotification(module, name, icon, content, attatchmentInfo)

    localStorage.setItem(`NOTIFICATIONS://${module}|${name}`, JSON.stringify(package))
    
    notificationList.push(`${module}|${name}`)
    notificationList = JSON.stringify(notificationList)
    localStorage.setItem('notifications', notificationList)
}

function packageNotification(module, name, icon, content, attatchmentInfo) {
    var res = {}

    if (module) res.module = module
    if (name) res.name = name
    if (icon) res.icon = icon
    if (content) res.content = content
    if (attatchmentInfo) res.attatchmentInfo = attatchmentInfo

    return res
}