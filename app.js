document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'inviteList'

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

  //save current list to storage
  const saveListToStorage = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }

  //get list from local storage
  const getListFromStorage = (list) => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  //load invitees from local storage
  const loadStoredList = () => {
    const savedList = getListFromStorage()
    savedList.forEach((item) => {
      const li = createLI(item.name, item.confirmed, item.note)
      ul.appendChild(li)
    })
  }

  //createLI function to make code more modular, removed from form eventListener
  const createLI = (text, confirmed = false, note = '') => {
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
    appendToLI('span', 'textContent', text)

    //change to confirm?/confirmed
    const label = document.createElement('label')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = confirmed
    label.appendChild(checkbox)

    //textNode moved so checkbox does not move on click
    const textNode = document.createTextNode(
      confirmed ? 'Confirmed' : 'Confirm?'
    )
    label.appendChild(textNode)

    li.appendChild(label)

    if (confirmed) li.className = 'responded'

    //edit button
    appendToLI('button', 'textContent', 'edit')
    //remove button
    appendToLI('button', 'textContent', 'remove')

    //add notes box
    const notesBox = document.createElement('textarea')
    notesBox.placeholder = 'Add notes...'
    notesBox.value = note
    li.appendChild(notesBox)

    return li
  }

  //filter out invitees who have not responded yet
  filterCheckBox.addEventListener('change', (e) => {
    e.preventDefault()
    const isChecked = e.target.checked
    const list = ul.children

    for (let i = 0; i < list.length; i++) {
      const li = list[i]
      //look if this li has been affirmatively responded to
      const responded = li.classList.contains('responded')
      //find the label when it has
      const label = li.querySelector('label')

      if (isChecked) {
        //hide unconfirmed
        li.style.display = li.className === 'responded' ? '' : 'none'

        //hide individual confirmations
        if (label) {
          label.style.display = 'none'
        }
      } else {
        //show everyone
        li.style.display = ''

        //show the checkboxes again
        if (label) {
          label.style.display = ''
        }
      }
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    //set text, create list item
    const text = input.value

    //if form is invalid
    if (text === '') {
      alert('Please enter a name.')
      return
    }

    //check for duplicate names
    const savedList = getListFromStorage()
    if (
      savedList.some((item) => item.name.toLowerCase() === text.toLowerCase())
    ) {
      alert('This person is already on the list.')
      return
    }

    ul.appendChild(createLI(text))
    saveListToStorage([
      ...savedList,
      { name: text, confirmed: false, note: '' }
    ])
    input.value = ''
  })

  //possibly look into hiding when unchecked during filter
  //use ul to get to checkbox change
  ul.addEventListener('change', (e) => {
    e.preventDefault()
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      //set
      const checkbox = e.target
      const confirmed = checkbox.checked
      const listItem = checkbox.closest('li')
      const label = checkbox.parentNode

      //update label based on state
      const textNode = label.childNodes[1]
      textNode.nodeValue = confirmed ? 'Confirmed' : 'Confirm?'

      //check if confirmed
      listItem.className = checkbox.checked ? 'responded' : ''

      //update local storage
      const name = listItem.querySelector('span').textContent
      const notesValue = listItem.querySelector('textarea')?.value || ''
      const updatedList = getListFromStorage().map((item) =>
        item.name === name
          ? { ...item, confirmed: checkbox.checked, note: notesValue }
          : item
      )
      saveListToStorage(updatedList)
    }
  })

  //save notes on text area
  ul.addEventListener(
    'blur',
    (e) => {
      if (e.target.tagName === 'TEXTAREA') {
        const textArea = e.target
        const li = textArea.closest('li')
        const name = li.querySelector('span')
        const newNote = textArea.value

        const updatedList = getListFromStorage().map((item) =>
          item.name === name ? { ...item, note: newNote } : item
        )
        saveListToStorage(updatedList)
      }
    },
    true
  ) //argument to capture notes on blur

  //button event listener
  ul.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return

    //can set to button's textContent or other parameter to differentiate
    //here, we only have one button per child in ul, so tagName suffices -> obviously this has changed
    const button = e.target
    const li = button.parentNode
    const name =
      li.querySelector('span')?.textContent || li.querySelector('input')?.value

    const nameActions = {
      remove: () => {
        const updatedList = getListFromStorage().filter(
          (item) => item.name !== name
        )
        saveListToStorage(updatedList)
        ul.removeChild(li)
      },
      //Do I need to update storage here?
      edit: () => {
        //find the span element within this li
        const span = li.querySelector('span')
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
        const input = li.querySelector('input[type="text"]')
        //save input value
        const newName = input.value

        //check if edited input is blank now
        if (newName === '') {
          alert('Name cannot be empty.')
          return
        }

        const notesValue = li.querySelector('textarea')?.value || ''

        //update list
        const updatedList = getListFromStorage().map((item) =>
          item.name === name
            ? { ...item, name: newName, note: notesValue }
            : item
        )
        saveListToStorage(updatedList)

        //create span
        const span = document.createElement('span')
        span.textContent = newName
        li.insertBefore(span, input)
        li.removeChild(input)
        button.textContent = 'edit'
      }
    }
    const action = button.textContent
    nameActions[action]?.()
  })

  loadStoredList()
})

/*
--UPDATE ASSIGNMENTS
[X] Validation - Alerts
  [X] Empty Strings
  [X] Duplicates
[ ] Checkboxes
  [X] "Confirm" when unchecked/"Confirmed" when checked
  [ ] Text Nodes
  [X] When hide unresponded checkbox is on, confirmed checkboxes still show up - Redundant
[ ] Add text notes
[X] Local Storage to save state (no emptying on refresh)
*/
