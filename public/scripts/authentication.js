var authentication = getCookie('auth')

authentication = authentication ? JSON.parse(authentication) : {}

var username = authentication.username ? authentication.username : ''
var password = authentication.password ? atob(authentication.password) : ''

var isAuthenticated = false
if (username && password) isAuthenticated = true

var pathname = location.pathname
if (!isAuthenticated && !pathname.startsWith('/login')) location.href = '/login'
else if (isAuthenticated && pathname === '/') location.href = '/tracker'

function setCredentials(username, password) {
    alert(JSON.stringify({username: username, password: password}))
    authentication = JSON.stringify({
        username: username,
        password: btoa(password),
    })
    setCookie('auth', authentication, 30)
}