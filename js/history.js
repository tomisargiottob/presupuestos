window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;
const historyTable = document.getElementById('budgets');

async function populateHistoryTable() {
	const database = new Database();
	await database.connect();
	const budgets = await database.loadBudgets(true);
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
	historyTable.classList.add('column-item');
	const schoolData = document.getElementById('school-data');
	schoolData.innerHTML = "";
	Object.keys(budget).forEach((data) => {
		if(translation[data]) {
			const info = document.createElement('li');
			info.innerText = `${translation[data]}: ${budget[data]}`;
			schoolData.append(info)
		}
	});
	const budgetDetails = document.getElementById('budget-details');
	budgetDetails.innerHTML='';
	for (let i=0; i < budget.items.length ; i++) {
		let itemTotal = 0;
		const article = budget.items[i]
		const [tableData, price] = addTableData(i+1, article.name, article.amount, article.price);
		itemTotal += price
		budgetDetails.append(tableData);
		for (let j=0; j < article.additionals.length ; j++) {
			const additional = article.additionals[j];
			const [additionalData, additionalPrice] = addTableData(`${i+1}.${j+1}`, additional.name, additional.amount, additional.price);
			budgetDetails.append(additionalData);
			itemTotal += additionalPrice
		}
		const [itemAcumulated] = addTableData('','','','',itemTotal);
		budgetDetails.append(itemAcumulated);
	}
	const finalPrice = document.getElementById('final-price');
	finalPrice.innerHTML= `<strong>Total: ${budget.total}$</strong>`;
	return;
}

function createTableData(value) {
	const tableData = document.createElement('td');
	tableData.innerHTML = value;
	return tableData
}

function addBudgets(budgets) {
	const budgetTable = document.getElementById('budget-list');
	for(const budget of budgets) {
		const budgetDetails = document.createElement('tr');
		const budgetDate = createTableData(budget.date);
		const budgetSchool = createTableData(budget.school);
		// const budgetStudents = createTableData(budget.students);
		const budgetContact = createTableData(budget.contactEmail);
		const budgetTotal = createTableData(budget.total);
		const budgetActions = document.createElement('td');
		const downloadButton = document.createElement('button');
		downloadButton.classList.add('action-button');
		downloadButton.innerHTML= "<div><i class='fa-solid fa-download'></i></div>";
		downloadButton.addEventListener('click', (event) => {
			createTemplate(budget);
			downloadBudget(event);
		})
		const section = document.getElementById('budget-section');
		const [showButton, hideButton] = createShowHideButtons(section, () => createTemplate(budget), () => historyTable.classList.remove('column-item') );
		budgetActions.append(downloadButton, showButton, hideButton);
		budgetDetails.append(budgetDate, budgetSchool, budgetContact, budgetTotal, budgetActions);
		budgetTable.append(budgetDetails);
	}
}	

populateHistoryTable();