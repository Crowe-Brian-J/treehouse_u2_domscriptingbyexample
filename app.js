const form = document.getElementById('registrar')
const input = form.querySelector('input')
const ul = document.getElementById('invitedList')

//createLI function to make code more modular, removed from form eventListener
const createLI = (text) => {
  const li = document.createElement('li')
  li.textContent = text
  //create label to keep track of confirmed guests
  const label = document.createElement('label')
  label.textContent = 'Confirmed'
  //create checkbox to tick confirmation
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  //append checkbox to label
  label.appendChild(checkbox)
  //append label to list item
  li.appendChild(label)

  //almost the same process as checkbox
  const button = document.createElement('button')
  button.textContent = 'remove'
  li.appendChild(button)

  return li
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  //set text, create list item
  const text = input.value
  const li = createLI(text)

  //append list item to unordered list
  ul.appendChild(li)
  //clear input value
  input.value = ''
})

//use ul to get to checkbox change
ul.addEventListener('change', (e) => {
  e.preventDefault()
  //set
  const checkbox = e.target
  const checked = checkbox.checked
  //checkbox's parent is label -> label's parent is li
  const listItem = checkbox.parentNode.parentNode

  //if/else to change styling (based in css)
  if (checked) {
    listItem.className = 'responded'
  } else {
    listItem.className = ''
  }
})

ul.addEventListener('click', (e) => {
  //can set to button's textContent or other parameter to differentiate
  //here, we only have one button per child in ul, so tagName suffices
  if (e.target.tagName === 'BUTTON') {
    const li = e.target.parentNode
    const ul = li.parentNode
    ul.removeChild(li)
  }
})
