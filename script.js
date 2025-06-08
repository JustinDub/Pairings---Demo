const rosterA = document.querySelector("#rosterA");
const rosterB = document.querySelector("#rosterB");

let selectedListId = "";
let selectedListTitle = "";
let selectedListSrc = undefined;
let selectedListRoster = "";

const pairedList = {
	"pairedA1" : "",
	"pairedA2" : "",
	"pairedA2b" : "",
	"pairedA3" : "",
	"pairedA3b" : "",
	"pairedA4" : "",
	"pairedA5" : "",
	"pairedA6" : "",
	"pairedB1" : "",
	"pairedB1b" : "",
	"pairedB2" : "",
	"pairedB3" : "",
	"pairedB4" : "",
	"pairedB4b" : "",
	"pairedB5" : "",
	"pairedB6" : ""
};

let swapped = false;
const rostersSwapMatrice = [
	{id: "listA1", swapId: "listB1"},
	{id: "listA2", swapId: "listB2"},
	{id: "listA3", swapId: "listB3"},
	{id: "listA4", swapId: "listB4"},
	{id: "listA5", swapId: "listB5"},
	{id: "listA6", swapId: "listB6"}
];
const pairingsSwapMatrice = [
	{id: "pairedA1", swapId: "pairedB2"},
	{id: "pairedA2", swapId: "pairedB1"},
	{id: "pairedA2b", swapId: "pairedB1b"},
	{id: "pairedA3", swapId: "pairedB4"},
	{id: "pairedA3b", swapId: "pairedB4b"},
	{id: "pairedA4", swapId: "pairedB3"},
	{id: "pairedA5", swapId: "pairedB5"},
	{id: "pairedA6", swapId: "pairedB6"}
];

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
			&& pairedList[`${element.target.id}`]
			&& !selectedListId
			&& !element.target.classList.contains("denied")
		) {
			element.target.classList.add("denied")
			const selectedList = document.querySelector(`#${pairedList[`${element.target.id}`]}`);
			selectedList.classList.remove("listPaired");
		}
		else if (selectedListId != pairedList[`${element.target.id}`]) {
			element.target.classList.remove("denied")
			if(pairedList[`${element.target.id}`]){
			//Remove previous list from pairing
				const selectedList = document.querySelector(`#${pairedList[`${element.target.id}`]}`);
				selectedList.classList.remove("listPaired");
			}
			if (selectedListId) {
			//Add list to pairing
				if(element.target.parentElement.classList.contains(selectedListRoster)) {
					element.target.style=`background-image: url(${selectedListSrc})`
					const selectedList = document.querySelector(`#${selectedListId}`);
					selectedList.classList.add("listPaired");
					pairedList[`${element.target.id}`] = selectedListId;
					unselectList();
				}
			}
			else {
			//Remove list from pairing
				const className = element.target.className
				element.target.style=`background-image: url(images/assets/${className}.png)`;
				pairedList[`${element.target.id}`] = "";
			}
		}
	}
}

const rosterModalButton = document.querySelector("#displayRosterModal");
rosterModalButton.addEventListener("click", (e) => displayRosterModal());
const rosterModalWrapper = document.querySelector("#rosterModalWrapper")

function displayRosterModal() {
	//Affiche la modal de modification des rosters
	const board = document.querySelector(".board")

	rosterModalWrapper.style.display = "flex"
	let selectedFaction = {name: "", src: ""}

	function selectFaction(factionElement) {
		//Sélectionne une faction pour l'attribuer à un roster
		if(factionElement.target.tagName=="IMG") {
			if(selectedFaction.name) {
				const prevFaction = document.querySelector(`.faction [title='${selectedFaction.name}']`)
				prevFaction.parentElement.classList.remove("selected")
			}
			factionElement.target.parentElement.classList.add("selected")
			selectedFaction.name = factionElement.target.title
			selectedFaction.src = factionElement.target.src
			const rosterModal = document.querySelector("#rosterModal")
			rosterModal.addEventListener("click", (rosterElement) => {
				if(rosterElement.target.tagName=="IMG" && rosterElement.target.parentElement.classList.contains("list")) {
					//Met à jour la liste sélectionnée dans le roster
					rosterElement.target.src = factionElement.target.src
					rosterElement.target.title = factionElement.target.title
					const listElement = board.querySelector(`.roster #${rosterElement.target.parentElement.id} img`)
					listElement.src = factionElement.target.src
					listElement.title = factionElement.target.title
					const listElementTitle = board.querySelector(`.roster #${rosterElement.target.parentElement.id} p`)
					listElementTitle.textContent = factionElement.target.title
				}	
			});
		}
	}
	const factionsRoster = document.querySelector(".factionsRoster")
	factionsRoster.addEventListener("click", selectFaction)

	function validateRoster(event) {
		//Ferme la modal de modification des rosters
		//Modifie nom des Rosters
		const inputRosterA = document.querySelector("#rosterModal .rosterA input").value
		const inputRosterB = document.querySelector("#rosterModal .rosterB input").value
		board.querySelector(`#rosterA .title`).textContent = inputRosterA
		board.querySelector(`#rosterB .title`).textContent = inputRosterB

		rosterModalWrapper.style.display = "none"
        document.removeEventListener("click", validateRoster);
        document.removeEventListener("click", selectFaction);
	}
	const validateButton = document.querySelector("#validateRoster");
	validateButton.addEventListener("click", validateRoster);
}

const swapButton = document.querySelector("#swap");
swapButton.addEventListener("click", (e) => swapRosters());

function swapRosters() {
	//Swap rosters titles
	const titleA = document.querySelector("#rosterA .title");
	const titleB = document.querySelector("#rosterB .title");
	const prevTitleA = titleA.textContent;
	titleA.textContent = titleB.textContent;
	titleB.textContent = prevTitleA;

	//Swap roster lists sides
	rostersSwapMatrice.forEach((elementA) => {
		const previousA = document.querySelector(`#${elementA.id}`)
		const previousB = document.querySelector(`#${elementA.swapId}`)
		let src, title;
		if (previousA.firstElementChild != null){
			src = previousA.firstElementChild.src;
			title = previousA.firstElementChild.title;
			previousA.firstElementChild.src = previousB.firstElementChild.src;
			previousA.firstElementChild.title = previousB.firstElementChild.title;
			previousA.lastElementChild.textContent = previousB.firstElementChild.title;
			previousB.firstElementChild.src = src;
			previousB.firstElementChild.title = title;
			previousB.lastElementChild.textContent = title;
			//handle paired/not paired
			if(previousB.classList.contains("listPaired") && !previousA.classList.contains("listPaired")) {
				previousA.classList.add("listPaired")
				previousB.classList.remove("listPaired")
			}
			else if(previousA.classList.contains("listPaired") && !previousB.classList.contains("listPaired")) {
				previousB.classList.add("listPaired")
				previousA.classList.remove("listPaired")
			}
		}
	})
	//Swap paired lists
	pairingsSwapMatrice.forEach((elementA) => {
		const previousA = document.querySelector(`#${elementA.id}`)
		const previousB = document.querySelector(`#${elementA.swapId}`)
		let src, title;
		if (previousA != null){
			src = previousA.style.backgroundImage;
			// title = previousA.title;
			previousA.style.backgroundImage = previousB.style.backgroundImage;
			// previousA.title = previousB.title;
			previousB.style.backgroundImage = src;
			// previousB.title = title;
		// Handle paired/not paired
			if(previousB.classList.contains("denied") && !previousA.classList.contains("denied")) {
				previousA.classList.add("denied")
				previousB.classList.remove("denied")
			}
			else if(previousA.classList.contains("denied") && !previousB.classList.contains("denied")) {
				previousB.classList.add("denied")
				previousA.classList.remove("denied")
			}
		}
		// Update the pairedList
		const list = pairedList[elementA.id];
		if (swapped) {
			pairedList[elementA.id] = pairedList[elementA.swapId] ? rostersSwapMatrice.find((e) => e.swapId == pairedList[elementA.swapId]).id : "";
			pairedList[elementA.swapId] = list ? rostersSwapMatrice.find((e) => e.id == list).swapId : "";
		}
		else {
			pairedList[elementA.id] = pairedList[elementA.swapId] ? rostersSwapMatrice.find((e) => e.swapId == pairedList[elementA.swapId]).id : "";
			pairedList[elementA.swapId] = list ? rostersSwapMatrice.find((e) => e.id == list)?.swapId : "";
		}
	})
	swapped = !swapped
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
clearButton.addEventListener("click", (e) => openClearConfirmModal());
const confirmModalWrapper = document.querySelector("#confirmModalWrapper");

function closeClearConfirmModal() {
	confirmModalWrapper.style.display = "none"
    document.removeEventListener("click", clearAll);
    document.removeEventListener("click", closeClearConfirmModal);
	document.querySelectorAll("button").forEach(element => element.disabled=false);
}

function clearAll() {
	closeClearConfirmModal();
	//Réinitialise la page
	document.querySelectorAll(".paired img").forEach((pairedElement) => {
		const className = pairedElement.className;
		pairedElement.style=`background-image: url(images/assets/${className}.png)`;
	})

	const lists = document.querySelectorAll(".list");
	lists.forEach((listElement) => listElement.classList.remove("listPaired"));

	// reset pairedList
	Object.keys(pairedList).forEach((key, index) => pairedList[key]="");

	const attackers = document.querySelectorAll(".attacker");
	attackers.forEach((attacker) => attacker.classList.remove("denied"))
}
	
function openClearConfirmModal() {
	document.querySelectorAll("button").forEach(element => element.disabled=true);
	confirmModalWrapper.style.display = "flex";
	const cancelConfirmButton = document.querySelector("#cancelConfirm");
	cancelConfirmButton.disabled = false;
	cancelConfirmButton.addEventListener("click", closeClearConfirmModal);
	const validateConfirmButton = document.querySelector("#validateConfirm");
	validateConfirmButton.disabled  = false;
	validateConfirmButton.addEventListener("click", clearAll);
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
