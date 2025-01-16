const rosterA = document.querySelector("#rosterA");
const rosterB = document.querySelector("#rosterB");

let selectedListId = "";
let selectedListTitle = "";
let selectedListSrc = undefined;
let selectedListRoster = "";

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

const swapMatrice = [
	{id: "#listA1", swapId: "#listB1"},
	{id: "#listA2", swapId: "#listB2"},
	{id: "#listA3", swapId: "#listB3"},
	{id: "#listA4", swapId: "#listB4"},
	{id: "#listA5", swapId: "#listB5"},
	{id: "#listA6", swapId: "#listB6"}
]

rosterA.addEventListener("click", (e) => selectList(e));
rosterB.addEventListener("click", (e) => selectList(e));

function selectList(element) {
	//Select roster element
	if(element.target.tagName=="IMG") {
		if(element.target.parentElement.classList.contains("listPaired")) return;
		if (selectedListId) unselectList();
		element.target.parentElement.classList.add("selected");
		selectedListId = element.target.parentElement.id;
		selectedListTitle = element.target.title;
		selectedListSrc = element.target.src;
		element.target.parentElement.classList.forEach((listClass) => {if(listClass.includes("roster")) selectedListRoster = listClass})
	}
	else if(element.target.tagName=="DIV" && element.target.className.includes("list")) {
		if(element.target.classList.contains("listPaired")) return;
		if (selectedListId) unselectList();
		element.target.classList.add("selected");
		selectedListId = element.target.id;
		selectedListTitle = element.target.firstElementChild.title;
		selectedListSrc = element.target.firstElementChild.src;
	}
}

function unselectList() {
	//Unselect roster element
	if(!selectedListId) return;
	const selectedList = document.querySelector(`#${selectedListId}`);
	selectedList.classList.remove("selected");
	selectedListId = "";
	selectedListTitle = "";
	selectedListSrc = undefined;
}

const pairingA = document.querySelector("#pairingA");
const pairingB = document.querySelector("#pairingB");

pairingA.addEventListener("click", (e) => attributePairing(e));
pairingB.addEventListener("click", (e) => attributePairing(e));

function attributePairing(element) {
	//Change pairing element content
	if(element.target.tagName=="IMG") {
		if(
			element.target.classList.contains("attacker") 
			&& pairedLists[`${element.target.id}`]
			&& !selectedListId
			&& !element.target.classList.contains("denied")
		) {
			element.target.classList.add("denied")
			const selectedList = document.querySelector(`#${pairedLists[`${element.target.id}`]}`);
			selectedList.classList.remove("listPaired");
		}
		else if (selectedListId != pairedLists[`${element.target.id}`]) {
			element.target.classList.remove("denied")
			if(pairedLists[`${element.target.id}`]){
			//Remove previous list from pairing
				const selectedList = document.querySelector(`#${pairedLists[`${element.target.id}`]}`);
				selectedList.classList.remove("listPaired");
			}
			if (selectedListId) {
			//Add list to pairing
				if(element.target.parentElement.classList.contains(selectedListRoster)) {
					element.target.style=`background-image: url(${selectedListSrc})`
					const selectedList = document.querySelector(`#${selectedListId}`);
					selectedList.classList.add("listPaired");
					pairedLists[`${element.target.id}`] = selectedListId;
					unselectList();
				}
			}
			else {
			//Remove list from pairing
				const className = element.target.className
				element.target.style=`background-image: url(images/assets/${className}.png)`;
				pairedLists[`${element.target.id}`] = "";
			}
		}
	}
}

const modalButton = document.querySelector("#modal");
modalButton.addEventListener("click", (e) => displayModal());
const modalWrapper = document.querySelector(".modal-wrapper")

function displayModal() {
	//Affiche la modal de modification des rosters
	const board = document.querySelector(".board")

	modalWrapper.style.display = "flex"
	let selectedFaction = {name: "", src: ""}

	function selectFaction(factionElement) {
		//Sélectionne une faction pour l'attribuer à un roster
		if(factionElement.target.tagName=="IMG") {
			if(selectedFaction.name) {
				const prevFaction = document.querySelector(`.faction [title=${selectedFaction.name}]`)
				prevFaction.parentElement.classList.remove("selected")
			}
			factionElement.target.parentElement.classList.add("selected")
			selectedFaction.name = factionElement.target.title
			selectedFaction.src = factionElement.target.src
			const modal = document.querySelector(".modal")
			modal.addEventListener("click", (rosterElement) => {
				if(rosterElement.target.tagName=="IMG" && rosterElement.target.parentElement.classList.contains("list")) {
					//Met à jour la liste sélectionnée dans le roster
					rosterElement.target.src = factionElement.target.src
					const listElement = board.querySelector(`.roster #${rosterElement.target.parentElement.id} img`)
					listElement.src = factionElement.target.src
				}	
			});
		}
	}
	const factionsRoster = document.querySelector(".factionsRoster")
	factionsRoster.addEventListener("click", selectFaction)

	function validateRoster(event) {
		//Ferme la modal de modification des rosters
		if(selectedFaction.name) {
			const prevFaction = document.querySelector(`.faction [title=${selectedFaction.name}]`)
			prevFaction.parentElement.classList.remove("selected")
		}
		//Modifie nom des Rosters
		const inputRosterA = document.querySelector(".modal .rosterA input").value
		const inputRosterB = document.querySelector(".modal .rosterB input").value
		board.querySelector(`#rosterA .title`).textContent = inputRosterA
		board.querySelector(`#rosterB .title`).textContent = inputRosterB

		modalWrapper.style.display = "none"
        document.removeEventListener("click", validateRoster);
        document.removeEventListener("click", selectFaction);
	}
	const validateButton = document.querySelector("#validateRoster");
	validateButton.addEventListener("click", validateRoster);
}

const swapButton = document.querySelector("#swap");
swapButton.addEventListener("click", (e) => swapRosters());

function swapRosters() {
	swapMatrice.forEach((elementA) => {
		//element.target.src for pairings, element.target.firstElementChild.src for list
		const previousA = document.querySelector(elementA.id)
		const previousB = document.querySelector(elementA.swapId)
		let src, title;
		if (previousA.firstElementChild != null){
			src = previousA.firstElementChild.src;
			title = previousA.firstElementChild.title;
			previousA.firstElementChild.src = previousB.firstElementChild.src;
			previousA.firstElementChild.title = previousB.firstElementChild.title;
			previousB.firstElementChild.src = src;
			previousB.firstElementChild.title = title;
		}
	})
}

const infosButton = document.querySelector("#infos");
infosButton.addEventListener("click", (e) => handleInfosDisplay());
let infosDisplay = true;

function handleInfosDisplay() {
	if(infosDisplay) {
		document.querySelector(".infos").style.display = 'none';
		infosButton.textContent = "Afficher Infos";
		infosDisplay = false;
	}
	else {
		document.querySelector(".infos").style.display = 'flex'
		infosButton.textContent = "Masquer Infos";
		infosDisplay = true
	}
}

const clearButton = document.querySelector("#clearAll");
clearButton.addEventListener("click", (e) => clearAll());

function clearAll() {
	//Réinitialise la page
	const pairedList = document.querySelectorAll(".paired img");
	pairedList.forEach((pairedElement) => {
		const className = pairedElement.className;
		pairedElement.style=`background-image: url(images/assets/${className}.png)`;
	})

	const lists = document.querySelectorAll(".list");
	lists.forEach((listElement) => listElement.classList.remove("listPaired"));

	// reset pairedLists
	Object.keys(pairedLists).forEach((key, index) => pairedLists[key]="");

	const attackers = document.querySelectorAll(".attacker");
	attackers.forEach((attacker) => attacker.classList.remove("denied"))
}

//Handle Infos EstimateFile Change
const estimInput = document.querySelector("#estimInput")
estimInput.addEventListener("change", (e) => updateEstimImg());

function updateEstimImg() {
	estimFile = estimInput.files[0]
	const fileTypes = [
	  "image/apng",
	  "image/bmp",
	  "image/gif",
	  "image/jpeg",
	  "image/pjpeg",
	  "image/png",
	  "image/svg+xml",
	  "image/tiff",
	  "image/webp",
	  "image/x-icon",
	];
	if(estimFile && fileTypes.includes(estimFile.type)) {
		const estimImg = document.querySelector("#estimImg")
		estimImg.src = URL.createObjectURL(estimFile)
	}
}
