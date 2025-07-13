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

    //function to clean up process for creating elements
    const createElement = (elementName, property, value) => {
      const element = document.createElement(elementName)
      element[property] = value
      return element
    }
    //function to append child
    const appendToLI = (elementName, property, value) => {
      const element = createElement(elementName, property, value)
      li.appendChild(element)
      return element
    }

    //create and append necessary elements
    //span
    appendToLI('span', 'textContent', text)
    //label and checkbox
    appendToLI('label', 'textContent', 'Confirmed').appendChild(
      createElement('input', 'type', 'checkbox')
    )
    //edit button
    appendToLI('button', 'textContent', 'edit')
    //remove button
    appendToLI('button', 'textContent', 'remove')

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

  //possibly look into hiding when unchecked during filter
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

    const nameActions = {
      remove: () => {
        ul.removeChild(li)
      },
      edit: () => {
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
      },
      save: () => {
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

    if (button.tagName === 'BUTTON') {
      const action = button.textContent
      //the following replaces if chain statement
      //select and run action in button's name -> make sure to invoke
      nameActions[action]()
      /* if (action === 'remove') {
        nameActions.remove()
      } else if (action === 'edit') {
        nameActions.edit()
      } else if (action === 'save') {
        nameActions.save()
      } */
    }
  })
})

/*
--UPDATE ASSIGNMENTS
[ ] Validation - Alerts
  [ ] Empty Strings
  [ ] Duplicate
[ ] Checkboxes
  [ ] "Confirm" when unchecked/"Confirmed" when checked
  [ ] Text Nodes
  [ ] When hide unresponded checkbox is on, confirmed checkboxes still show up - Redundant
[ ] Add text notes
[ ] Local Storage to save state (no emptying on refresh)
*/
