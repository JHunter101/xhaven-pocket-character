window.onload = function() {
	
	if (localStorage.getItem('pageHTML') !== null) {
		// load the saved HTML from local storage and set it as the HTML of the body element
		document.documentElement.innerHTML = getLocalStorage('pageHTML');
		document.getElementById("character-name").value = getLocalStorage('characterNameInput');
		document.getElementById("level").value = getLocalStorage('levelInput');
		refindImages()
	}
	
	// Add event listeners for character name input and export/import buttons
	const maxCards = 0;
	const exportBtn = document.querySelector('#export-btn');
	const importBtn = document.querySelector('#import-btn');
	const gridImages = document.querySelectorAll('.grid-item');
	const characterNameInput = document.getElementById('character-name');
	const levelInput = document.getElementById('level');
	const importInput = document.getElementById('import-input');
	const gridContainer = document.getElementById("grid");
	characterNameInput.addEventListener('change', resetSelected);
	characterNameInput.addEventListener('change', refindImages);
	levelInput.addEventListener('change', refindImages);
	exportBtn.addEventListener('click', handleExportClick);
	importBtn.addEventListener('click', handleImportClick);
	// Add click event listener for grid images
	gridImages.forEach(image => {
		image.addEventListener('click', handleImageSelection);
		image.addEventListener('click', saveProgress);
	});
	for (const classCode in class_data) {
		const class_info = class_data[classCode];
		const opt = document.createElement("option");
		opt.value = class_info.code
		opt.innerHTML = "[" + class_info.version + "] " + class_info.race + ' ' + class_info.name + " (" + class_info.icon + ")"
		opt.id =
			document.getElementById("character-name").appendChild(opt);
	}
}
// Function to handle image selection
function handleImageSelection(event) {
	const selectedImages = document.getElementsByClassName('selected').length
	if (event.target.classList.contains('selected')) {
		event.target.classList.remove('selected');
	} else {
		if (selectedImages < maxCards) {
			event.target.classList.add('selected');
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
		// Create an empty array to store ids of selected images
		const selectedImagesIds = [];
		// Iterate over all images with class 'selected'
		const selectedImages = document.getElementsByClassName('selected');
		for (let i = 0; i < selectedImages.length; i++) {
			selectedImagesIds.push(selectedImages[i].id);
		}
		// Create export string with character name, level, and selected image ids
		const exportString = JSON.stringify({
			characterName: characterNameInput.value,
			level: levelInput.value,
			selectedImagesIds: selectedImagesIds
		});
		// Prompt user to save the exportString
		importInput.value = exportString;
	}
}
// Function to handle import button click
function handleImportClick() {
	// Parse the import string to an object
	const importInput = document.getElementById('import-input');
	const importedData = JSON.parse(importInput.value);
	const characterNameInput = document.getElementById('character-name');
	const levelInput = document.getElementById('level');
	// Set character name and level inputs to imported values
	characterNameInput.value = importedData.characterName;
	levelInput.value = importedData.level;
	// Loop through the imported image ids
	refindImages()
	importedData.selectedImagesIds.forEach(imageId => {
		// Find the corresponding image element
		image = document.getElementById(imageId);
		// Add the selected class to the image
		image.classList.add('selected');
	});
	saveProgress()
}

function resetSelected() {
	// Select all elements with class 'selected'
	const characterNameInput = document.getElementById('character-name');
	const selectedImages = document.querySelectorAll('.selected');
	// Remove the 'selected' class from each element
	selectedImages.forEach(img => img.classList.remove('selected'));
	
	maxCards = class_data[characterNameInput.value]['max_cards']
	saveProgress()
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
		for (const imgData of cards) {
			const img = document.createElement("img");
			img.src = 'images/' + imgData.image;
			img.id = imgData.cardno + '_' + imgData.name;
			img.classList.add('hidden', 'grid-item');
			img.addEventListener('click', handleImageSelection);
			document.getElementById("grid").appendChild(img);
		}
		// Iterate through the cards and display or hide them based on the level input value
		cards.forEach(imgData => {
			if (parseInt(imgData.level) <= parseInt(levelInput.value)) {
				document.getElementById(imgData.cardno + '_' + imgData.name).classList.remove('hidden');
			} else {
				document.getElementById(imgData.cardno + '_' + imgData.name).classList.add('hidden');
			}
		});
	}
	saveProgress()
}