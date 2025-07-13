document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar')
  const mainDiv = document.querySelector('.main')
  const input = form.querySelector('input')
  const ul = document.getElementById('invitedList')

  //create elements for checkbox div
  const div = document.createElement('div')
  const filterLabel = document.createElement('label')
  const filterCheckBox = document.createElement('input')

  //create content for checkbox div
  filterLabel.textContent = "Hide those who haven't responded"
  filterCheckBox.type = 'checkbox'
  div.appendChild(filterLabel)
  div.appendChild(filterCheckBox)
  mainDiv.insertBefore(div, ul)

  //filter out invitees who have not responded yet
  filterCheckBox.addEventListener('change', (e) => {
    e.preventDefault()
    const isChecked = e.target.checked
    const list = ul.children
    if (isChecked) {
      for (let i = 0; i < list.length; i++) {
        let li = list[i]
        if (li.className === 'responded') {
          li.style.display = ''
        } else {
          li.style.display = 'none'
        }
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let li = list[i]
        li.style.display = ''
      }
    }
  })

  //createLI function to make code more modular, removed from form eventListener
  const createLI = (text) => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.textContent = text
    li.appendChild(span)
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

    //almost the same process as button below - change button on both to edit/remove button ?
    const editButton = document.createElement('button')
    editButton.textContent = 'edit'
    li.appendChild(editButton)

    //almost the same process as checkbox
    const removeButton = document.createElement('button')
    removeButton.textContent = 'remove'
    li.appendChild(removeButton)

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

  //button event listener
  ul.addEventListener('click', (e) => {
    //can set to button's textContent or other parameter to differentiate
    //here, we only have one button per child in ul, so tagName suffices -> obviously this has changed
    const button = e.target
    const li = button.parentNode
    const ul = li.parentNode

    if (button.tagName === 'BUTTON') {
      if (button.textContent === 'remove') {
        ul.removeChild(li)
      } else if (button.textContent === 'edit') {
        //find the span element within this li
        const span = li.firstElementChild
        //create text element to replace invitee's name
        const input = document.createElement('input')
        input.type = 'text'
        //give input's value from previous span's text content
        input.value = span.textContent
        //insert the input before the span
        li.insertBefore(input, span)
        //remove the span
        li.removeChild(span)
        //change button's value to save
        button.textContent = 'save'
      } else if (button.textContent === 'save') {
        //undo edit to save
        //get input, save to input
        const input = li.firstElementChild
        //create span element to replace input field
        const span = document.createElement('span')
        //give span textContent
        span.textContent = input.value
        //insert span before input
        li.insertBefore(span, input)
        //remove input
        li.removeChild(input)
        //change button's value to edit
        button.textContent = 'edit'
      }
    }
  })
})
