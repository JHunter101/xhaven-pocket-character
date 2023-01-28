window.onload = function() {};
// function to save data to local storage
function saveProgress() {
	var characterNameInput = document.getElementById('character-name');
	var levelInput = document.getElementById('level');
	var selectedElements = document.getElementsByClassName('selected');
	var selectedElementsArray = [];
	for (var i = 0; i < selectedElements.length; i++) {
		selectedElementsArray.push(selectedElements[i].id);
	}
	localStorage.setItem('xhaven-pocket-character-name', characterNameInput.value);
	localStorage.setItem('xhaven-pocket-character-level', levelInput.value);
	localStorage.setItem('xhaven-pocket-character-pageHTML', document.documentElement.innerHTML);
	localStorage.setItem('xhaven-pocket-character-selectedElements', JSON.stringify(selectedElementsArray));
}