alert(!!document.querySelector('[eruda], .eruda'))
if (!!document.querySelector('[eruda], .eruda')) {
  var script = document.createElement('script'); 
  script.src="//cdn.jsdelivr.net/npm/eruda"; 
  document.body.appendChild(script); 
  script.onload = function () {
    eruda.init()
  }
}