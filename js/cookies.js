window.onload = function() {};
// function to save data to local storage
function saveProgress() {
	var characterNameInput = document.getElementById('character-name');
	var levelInput = document.getElementById('level');
	localStorage.setItem('pageHTML', document.documentElement.innerHTML);
	localStorage.setItem('characterNameInput', characterNameInput.value);
	localStorage.setItem('levelInput', levelInput.value);
}
// function to load data from local storage
function getLocalStorage(key) {
	return localStorage.getItem(key);
}