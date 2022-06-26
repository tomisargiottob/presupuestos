window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

const itemsTitles = ['Prenda', 'Cantidad', 'Precio', 'Adicionales'];

let budgetGenerated = {};

// transformo las opciones en HTML
function createOptions(options) {
	const selectOptions = options.reduce((accOptions, option)=> {
		accOptions.push(`<option value='${option.name.toLowerCase()}'>${option.name}</option>`);
		return accOptions;
	},[])
	return selectOptions
}

//funcion para evitar repetir el codigo de los botones de eliminar
function createDeleteButton(callback) {
	const button = document.createElement('button');
	button.innerHTML= '<div class="delete-icon"><i class="fa-solid fa-trash-can"></i></div>';
	button.className='remove-item';
	button.addEventListener('click', callback);
	return button
}

//funcion para buscar precios cuando se usa el select
function findPrice(options, price, select) {
	const itemPrice = options.find((option) => option.name.toLowerCase() === select.value);
	price.value = itemPrice.price;
}

function setAttributes(element, attributes) {
	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key,value);
	}
}

// funcion de agregar prendas al presupuesto
function addItem (event){
	event.preventDefault();
	const itemList = document.getElementById('items');

	// si es el primer elemento, le agregamos los titulos a la sección
	if (itemList.children.length === 0) {
		const titles = itemsTitles.map((title,idx) => `<p class='items-title title${idx}'>${title}</p>`).join('');
		itemList.innerHTML= `<div class='titles'>${titles}</div>`;
	}
	const itemDetails = document.createElement('li');
	const item = document.createElement('form');
	item.setAttribute('id',`item${itemList.children.length}Form`) ;
	item.className = 'listItem';

	// boton de eliminar el elemento, se encarga de eliminar los titulos si no quedan elementos
	const removeItem = () => {
		itemList.removeChild(itemDetails);
		if (itemList.children.length === 1) {
			itemList.innerHTML = '';
		}
	}

	const removeItemButton = createDeleteButton(removeItem);

	// desplegable de las prendas
	const selectClothing = document.createElement('select');
	selectClothing.innerHTML = createOptions(clothing);

	const itemNumber = itemList.children.length;
	setAttributes(selectClothing, { name: 'item', form: `item${itemNumber}Form`});
	
	// input para introducir la cantidad de prendas
	const amount = document.createElement('input');
	const studentsAmount = document.getElementById('school-students');
	amount.value = studentsAmount.value || 1
	setAttributes(amount, { type: 'text', name:'amount', form: `item${itemNumber}Form`});

	// input para incorporar el precio, se trae automaticamente del select pero es modificable
	const price = document.createElement('input');
	setAttributes(price, { type: 'text', name:'price',  form: `item${itemNumber}Form`});
	selectClothing.addEventListener('change', () => findPrice(clothing, price, selectClothing));

	const counter = document.createElement('span');
	counter.textContent=0;
	// cada prenda es personalizable, cada prenda tiene sus adicionales
	const additionals = document.createElement('div');
	additionals.className='additionals-list hidden';

	const addAditional = document.createElement('button');
	const additionalsList = document.createElement('ol');
	additionalsList.setAttribute('id',`item${itemNumber}Additionals`);

	addAditional.className = 'add-additionals';
	addAditional.innerHTML = "<div class='add-icon'><i class='fa-solid fa-plus'></i> Adicional</div>";
	addAditional.addEventListener('click', ()=> createAditional(additionalsList, counter, itemNumber));
	additionals.append(additionalsList, addAditional);

	// boton de mostrar y ocultar adicionales para que a medida que se van creando prendas se puedan personalizar
	const [showAdditionals, hideAdditionals] = createShowHideButtons(additionals);

	// agregamos todos los elementos al item y el item al listado de items
	item.append(removeItemButton, selectClothing, amount, price, counter, showAdditionals, hideAdditionals);
	itemDetails.append(item,additionals);

	itemList.append(itemDetails);
}

function createAditional(additionals, counter, itemNumber) {
	event.preventDefault();
	const additional = document.createElement('li');
	counter.textContent = Number(counter.textContent) + 1;
	const removeAdditional = () => {
		additionals.removeChild(additional);
		counter.textContent = Number(counter.textContent) - 1;
	};
	const additionalForm = document.createElement('form');
	const additionalFormId = `item${itemNumber}additional${additionals.children.length}`;
	additionalForm.setAttribute('id', additionalFormId);
	additionalForm.classList.add('additional-form');

	const removeAdditionalButton = createDeleteButton(removeAdditional);
	const selectAditional = document.createElement('select');
	setAttributes(selectAditional, { form: additionalFormId, name: 'name'} );
	selectAditional.innerHTML = createOptions(variables);

	// input para introducir la cantidad de prendas
	const additionalAmount = document.createElement('input');
	const studentsAmount = document.getElementById('school-students');
	additionalAmount.value = studentsAmount.value || 1
	setAttributes(additionalAmount, { type: 'text', name:'amount', form: additionalFormId });

	// input para incorporar el precio, se trae automaticamente del select pero es modificable
	const additionalPrice = document.createElement('input');
	setAttributes(additionalPrice, { type: 'text',  name: 'price', form: additionalFormId });
	selectAditional.addEventListener('change', () => findPrice(variables, additionalPrice, selectAditional));

	additionalForm.append(removeAdditionalButton, selectAditional, additionalAmount, additionalPrice);
	additional.append(additionalForm);
	additionals.append(additional);
}

// funcion que se encarga de crear la vista previa del formulario. guardarse en base de datos
function createPreview(event) {
	event.preventDefault();
	const detailsTable = document.getElementById('budget-table');
	const formData = new FormData(document.getElementById('school-form'));
	const schoolData = document.getElementById('school-data');
	const budgetDetails = document.getElementById('budget-details');
	budgetDetails.innerHTML='';
	schoolData.innerHTML=''; //elimino lo anterior si se vuelve a crear
	budgetGenerated = {items: []};
	
	for (var pair of formData.entries()) {
		if (pair[1]){
			const budgetData = document.createElement('li');
			budgetData.innerText = `${translation[pair[0]]} : ${pair[1]}`;
			budgetGenerated[pair[0]] = pair[1];
			schoolData.append(budgetData);
		}
	}
	let total = 0;
	
	const itemList = document.getElementById('items');
	for (let i = 1; i<=itemList.children.length - 1; i++) {
		detailsTable.classList.remove('hidden');
		const itemFormData = new FormData(document.getElementById(`item${i}Form`));
		const itemData = Object.fromEntries(itemFormData);
		if(itemData.item !== 'seleccionar') {
			let itemTotal = 0;
	
			const [tableData, price] = addTableData(i, itemData.item, itemData.amount, itemData.price);
			budgetGenerated.items.push({ name: itemData.item, amount: itemData.amount, price: itemData.price, additionals: [] })
			itemTotal += price;
	
			const itemAdditionals = document.getElementById(`item${i}Additionals`);
			budgetDetails.append(tableData);
	
			for (let j = 0; j < itemAdditionals.children.length; j++) {
				const additionalFormData = new FormData(document.getElementById(`item${i}additional${j}`));
				const additionalData = Object.fromEntries(additionalFormData);
				if(additionalData.name !== 'seleccionar') {
					budgetGenerated.items[i-1].additionals.push({ name: additionalData.name, amount: additionalData.amount, price: additionalData.price });
					const [tableData, price] = addTableData(`${i}.${j+1}`, additionalData.name, additionalData.amount, additionalData.price);
					budgetDetails.append(tableData);
					itemTotal += price;
				}
			}
			const [itemAcumulated] = addTableData('','','','',itemTotal);
			budgetDetails.append(itemAcumulated);
			total += itemTotal;
		}
	}
	budgetGenerated.total = total;
	const finalPrice = document.getElementById('final-price');
	finalPrice.innerHTML= `<strong>Total: ${total}$</strong>`;
}


// Descargar presupuesto como PDF
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

async function startBudgetCreation() {
	const database = new Database();
	await database.connect();
	await database.loadElements()

	// El formulario puede borrarse todo y si se confirma tambien se eliminan los items
	const resetForm = document.getElementById('reset-form');
	resetForm.addEventListener('click', () => {
		const deleteAll = confirm('¿Desea eliminar todas las prendas agregadas?');
		if (deleteAll) {
			const itemList = document.getElementById('items');
			itemList.innerHTML = '';
		}
	});
	
	const previewButton = document.getElementById('school-form');
	previewButton.addEventListener('submit', createPreview);
	previewButton.addEventListener('keypress', (event) => {
		if (event.key==='Enter') {
			createPreview(event);
		}
	});
	
	const addItemButton = document.getElementById('add-item');
	addItemButton.addEventListener('click', addItem);
	addItemButton.addEventListener('keypress', (event) => {
		if (event.key==='+') {
			addItem(event);
		}
	});
	
	const downloadFile = document.getElementById('download-budget');
	downloadFile.addEventListener('click', downloadBudget);
	
	const saveBudgetButton = document.getElementById('save-budget');
	saveBudgetButton.addEventListener('click', (event) => { 
		event.preventDefault();
		database.saveBudget(budgetGenerated);
	});
}

startBudgetCreation();

