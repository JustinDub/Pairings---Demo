const rosterA = document.querySelector("#rosterA");
const rosterB = document.querySelector("#rosterB");

let selectedListId = "";
let selectedListSrc = undefined;
const pairedLists = {
	"pairedA1" : "",
	"pairedA2" : "",
	"pairedA2b" : "",
	"pairedA3" : "",
	"pairedA4" : "",
	"pairedA4b" : "",
	"pairedA5" : "",
	"pairedA6" : "",
	"pairedB1" : "",
	"pairedB1b" : "",
	"pairedB2" : "",
	"pairedB3" : "",
	"pairedB3b" : "",
	"pairedB4" : "",
	"pairedB5" : "",
	"pairedB6" : ""
}

rosterA.addEventListener("click", (e) => selectList(e));
rosterB.addEventListener("click", (e) => selectList(e));

function selectList(element) {
	if(element.target.tagName=="IMG") {
		if(element.target.parentElement.classList.contains("listPaired")) return
		if (selectedListId) unselectList();
		element.target.parentElement.classList.add("selected");
		selectedListId = element.target.parentElement.id;
		selectedListSrc = element.target.src;
	}
	else if(element.target.tagName=="DIV" && element.target.className.includes("list")) {
		if(element.target.classList.contains("listPaired")) return
		if (selectedListId) unselectList();
		element.target.classList.add("selected");
		selectedListId = element.target.id;
		selectedListSrc = element.target.firstElementChild.src;
	}
}

function unselectList() {
	if(!selectedListId) return;
	const selectedList = document.querySelector(`#${selectedListId}`);
	selectedList.classList.remove("selected");
	selectedListId = "";
	selectedListSrc = undefined;
}

const pairingA = document.querySelector("#pairingA");
const pairingB = document.querySelector("#pairingB");

pairingA.addEventListener("click", (e) => attributePairing(e));
pairingB.addEventListener("click", (e) => attributePairing(e));

function attributePairing(element) {
	if(element.target.tagName=="IMG") {
		if(
			element.target.classList.contains("attacker") 
			&& (!selectedListId || selectedListId == pairedLists[`${element.target.id}`])
			&& !element.target.classList.contains("denied")
		) {
			element.target.classList.add("denied")
			const selectedList = document.querySelector(`#${pairedLists[`${element.target.id}`]}`);
			selectedList.classList.remove("listPaired");
		}
		else if (selectedListId != pairedLists[`${element.target.id}`]) {
			element.target.classList.remove("denied")
			//remove previous list from pairing
			if(pairedLists[`${element.target.id}`]){
				const selectedList = document.querySelector(`#${pairedLists[`${element.target.id}`]}`);
				selectedList.classList.remove("listPaired");
			}
			//add list to pairing
			if (selectedListId) {
				element.target.style=`background-image: url(${selectedListSrc})`
				const selectedList = document.querySelector(`#${selectedListId}`);
				selectedList.classList.add("listPaired");
				pairedLists[`${element.target.id}`] = selectedListId;
				unselectList();
			}
			//remove list from pairing
			else {
				const className = element.target.className
				element.target.style=`background-image: url(images/${className}.png)`;
				pairedLists[`${element.target.id}`] = "";
			}
		}
	}
}

const eraserButton = document.querySelector("#eraser");
eraserButton.addEventListener("click", (e) => unselectList());

const clearButton = document.querySelector("#clearAll");
clearButton.addEventListener("click", (e) => clearAll());

function clearAll() {
	const pairedList = document.querySelectorAll(".paired img");
	pairedList.forEach((pairedElement) => {
		const className = pairedElement.className;
		pairedElement.style=`background-image: url(images/${className}.png)`;
	})

	const lists = document.querySelectorAll(".list");
	lists.forEach((listElement) => listElement.classList.remove("listPaired"));

	// reset pairedLists
	Object.keys(pairedLists).forEach((key, index) => pairedLists[key]="");
}