window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

async function populateHistoryTable() {
	const database = new Database();
	await database.connect();
	const budgets = await database.loadBudgets(true);
	console.log(budgets);
	addBudgets(budgets);
}

function downloadBudget (event) {
	event.preventDefault();

	const doc = new jsPDF('p', 'pt', 'a4');
	const section = document.getElementById('budget-section');
	var getContent = "<div style='font-size:11px; padding: 05px 25px; width:540px;'><div style=' padding: 05px 25px; width:300px; margin= 0 auto;'><img style='width:100%;' src='./assets/logoMashipa.png' alt='Logo'></div>"+section.innerHTML+"</div>";

	doc.setFont("helvetica");
	doc.setFontSize(1);
	doc.html(getContent,{
		callback: function(doc) {
			doc.save("presupuestoMashipa.pdf");
		},
	});
}

function createTemplate(budget) {
	const budgetDetails = document.getElementById('budget-details');
	return;
}

function addBudgets(budgets) {
	const budgetTable = document.getElementById('budget-details');
	for(const budget of budgets) {
		const budgetDetails = document.createElement('tr');
		const budgetDate = document.createElement('td');
		budgetDate.innerText = budget.date;
		const budgetSchool = document.createElement('td');
		budgetSchool.innerText = budget.school;
		const budgetContact = document.createElement('td');
		budgetContact.innerText = budget.contactEmail;
		const budgetTotal = document.createElement('td');
		budgetTotal.innerText = budget.total; 
		const budgetActions = document.createElement('td');
		const downloadButton = document.createElement('button');
		downloadButton.classList.add('add-icon');
		downloadButton.innerHTML= "<div><i class='fa-solid fa-download'></i></div>";
		downloadButton.addEventListener('click', (event) => {
			createTemplate(budget);
			downloadBudget(event);
		})
		const showDetails = document.createElement('button');
		showDetails.classList.add('add-icon');
		showDetails.innerHTML= "<div><i class='fa-solid fa-eye'></i></div>";
		budgetActions.append(downloadButton, showDetails);
		budgetDetails.append(budgetDate, budgetSchool, budgetContact, budgetTotal, budgetActions);
		budgetTable.append(budgetDetails);
	}
}	

populateHistoryTable();