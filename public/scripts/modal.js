var modal = document.querySelector('.modal')

function showModal(title, content) {
  modal.querySelector('.title').textContent = title
  modal.querySelector('.message').innerHTML = content
  modal.showModal();
}

modal.addEventListener('click', function(e) {
  var isOutside = checkIfOuterModal(e)
  if (isOutside) {
    modal.close()
  }
})
modal.querySelector('.btn').addEventListener('click', function(e) {
  modal.close()
})

function checkIfOuterModal(e) {
    const dimensions = modal.getBoundingClientRect()
    if (
        e.clientX < dimensions.left || 
        e.clientX > dimensions.right || 
        e.clientY < dimensions.top || 
        e.clientY > dimensions.bottom
    ) return true
    else return false
}
