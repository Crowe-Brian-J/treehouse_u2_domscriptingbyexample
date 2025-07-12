const form = document.getElementById('registrar')
const input = form.querySelector('input')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log(input.value)
  input.value = ''
})
