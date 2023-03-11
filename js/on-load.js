window.onload = function () {
  if (localStorage.getItem('xhaven-pocket-character-pageHTML') !== null) {
    // load the saved HTML from local storage and set it as the HTML of the body element
    document.documentElement.innerHTML = getLocalStorage('xhaven-pocket-character-pageHTML')
    // set the selected value for character name and level
    document.getElementById('character-name').value = getLocalStorage('xhaven-pocket-character-name')
    document.getElementById('level').value = getLocalStorage('xhaven-pocket-character-level')
    // reapply the "selected" class to elements with the class
    const selectedElementsArray = JSON.parse(getLocalStorage('xhaven-pocket-character-selectedElements'))
    for (let i = 0; i < selectedElementsArray.length; i++) {
      document.getElementById(selectedElementsArray[i]).classList.add('selected')
    }
  }

  refindImages()

  // Add event listeners for character name input and export/import buttons
  const maxCards = 0
  const exportBtn = document.querySelector('#export-btn')
  const importBtn = document.querySelector('#import-btn')
  const characterNameInput = document.getElementById('character-name')
  const levelInput = document.getElementById('level')
  const importInput = document.getElementById('import-input')
  const gridContainer = document.getElementById('grid')
  characterNameInput.addEventListener('change', resetSelected)
  characterNameInput.addEventListener('change', refindImages)
  characterNameInput.addEventListener('change', handleExportClick)
  levelInput.addEventListener('change', refindImages)
  levelInput.addEventListener('change', handleExportClick)
  importBtn.addEventListener('click', handleImportClick)
  // Add click event listener for grid images
  for (const classCode in class_data) {
    const class_info = class_data[classCode]
    const opt = document.createElement('option')
    opt.value = class_info.code
    opt.innerHTML = '[' + class_info.version + '] ' + class_info.race + ' ' + class_info.name + ' (' + class_info.icon + ')'
    opt.id =
			document.getElementById('character-name').appendChild(opt)
  }
}
