var notifications = [
  {
    type: 'alert', 
    icon: 'warning', 
    title: 'Your stop has moved.',
    content: 'Please proceed to the <link>temporary location</link> for <link>your bus stop</link>.'
  }, 
  {
    type: 'reminder', 
    icon: 'notification', 
    title: 'Get ready to start walking!', 
    content: 'Get ready to start walking to <link>your bus stop</link>!'
  }, 
]

var nGroup = document.querySelector('.notifications')
notifications.forEach(function(n, i) {
  var nIcon = n.icon
  var nTitle = n.title
  var nContent = n.content

  var nEle = document.createElement('item')

  var nEleIcon = document.createElement('img')
  nEleIcon.classList.add('icon')
  nEleIcon.src = `/icons/${nIcon}.svg`
  nEle.appendChild(nEleIcon)
  
  var nEleContent = document.createElement('item-content')
  nEleContent.textContent = nTitle
  nEle.appendChild(nEleContent)
  
  nGroup.appendChild(nEle)

  nEle.onclick = function(e) {
    if (!!nContent) {
      parent.showModal(nTitle, nContent)
    }
  }
})