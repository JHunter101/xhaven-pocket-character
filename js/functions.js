// Function to clear local storage and reset the selected images
function clearLocalStorage() {
	clearAndReset();
	localStorage.clear();
}
// Function to retrieve data from local storage
function getLocalStorage(key) {
	return localStorage.getItem(key);
}

// Function to handle image selection
function handleImageSelection(event) {
  const selectedImages = document.querySelectorAll('.selected');
  const target = event.target;
  if (target.classList.contains('selected')) {
    target.classList.remove('selected');
  } else {
    var levels = [...selectedImages].map(img => img.id.substring(3, 4));
    const targetLevel = target.id.substring(3, 4);
    if (levels.length < maxCards && !levels.includes(targetLevel) || targetLevel === '1') {
      target.classList.add('selected');
    }
  }
}


// Function to handle export button click
function handleExportClick() {
	const characterNameInput = document.getElementById('character-name');
	const levelInput = document.getElementById('level');
	const importInput = document.getElementById('import-input');
	// Check that character name and level inputs have a value
	if (characterNameInput.value && levelInput.value) {
		document.getElementById("images").classList.remove('hidden');
		// Create an empty array to store ids of selected images
		const selectedImagesIds = [...document.querySelectorAll('.selected')].map(img => img.id);
		// Create export string with character name, level, and selected image ids
		const exportString = JSON.stringify({
			characterName: characterNameInput.value,
			level: levelInput.value,
			selectedImagesIds: selectedImagesIds
		});
		// Prompt user to save the exportString
		importInput.value = exportString;
	} else {
		// Prompt user to save the exportString
		importInput.value = "";
		document.getElementById("images").classList.add('hidden');
	}
}
// Function to handle import button click
function handleImportClick() {
	const importInput = document.getElementById('import-input');
	// Parse the import string to an object
	if (importInput.value) {
		const importedData = JSON.parse(importInput.value);
		const characterNameInput = document.getElementById('character-name');
		const levelInput = document.getElementById('level');
		// Set character name and level inputs to imported values
		characterNameInput.value = importedData.characterName;
		levelInput.value = importedData.level;
		refindImages();
		// Loop through the imported image ids
		importedData.selectedImagesIds.forEach(imageId => {
			// Find the corresponding image element
			const image = document.getElementById(imageId);
			// Add the selected class to the image
			if (image) image.classList.add('selected');
		});
		saveProgress();
	}
}

function resetSelected() {
	// Remove 'selected' class from all elements with class 'selected'
	document.querySelectorAll('.selected').forEach(img => img.classList.remove('selected'));
	saveProgress();
}

function refindImages() {
	// Get input elements
	const characterNameInput = document.getElementById('character-name');
	const levelInput = document.getElementById('level');
	// Get all grid items that are not hidden
	const gridItems = document.querySelectorAll('.grid-item:not(.hidden)');
	// Add the 'hidden' class to each grid item
	gridItems.forEach(item => item.classList.add('hidden'));
	// Check if both input fields have a value
	if (characterNameInput.value && levelInput.value) {
		// Get the cards data for the selected character name
		const cards = imageIds[characterNameInput.value];
		// Create new image elements for each card
		cards.forEach(imgData => {
			const img = document.createElement("img");
			img.src = 'images/' + imgData.image;
			img.id = characterNameInput.value + '-' + imgData.level + '-' + imgData.cardno + '-' + imgData.name;
			img.classList.add('hidden', 'grid-item');
			document.getElementById("grid").appendChild(img);
		});
		// Iterate through the cards and display or hide them based on the level input value
		cards.forEach(imgData => {
			if (parseInt(imgData.level) <= parseInt(levelInput.value)) {
				document.getElementById(characterNameInput.value + '-' + imgData.level + '-' + imgData.cardno + '-' + imgData.name).classList.remove('hidden');
			} else {
				document.getElementById(characterNameInput.value + '-' + imgData.level + '-' + imgData.cardno + '-' + imgData.name).classList.add('hidden');
			}
		});
	}
	if (characterNameInput.value) {
		maxCards = class_data[characterNameInput.value]['max_cards'];
	}
	// Add event listeners to all grid items
	document.querySelectorAll('.grid-item').forEach(image => {
		image.addEventListener('click', handleImageSelection);
		image.addEventListener('click', saveProgress);
		image.addEventListener('click', handleExportClick);
	});
	handleExportClick()
	saveProgress();
}
// Clear input fields and grid
function clearAndReset() {
	document.getElementById('character-name').value = "";
	document.getElementById('level').value = "";
	document.getElementById('grid').innerHTML = "";
	resetSelected();
	refindImages();
}