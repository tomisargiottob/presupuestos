const clothingTable = document.getElementById('clothing-items');
const variablesTable = document.getElementById('aditional-items');
const createClothing = document.getElementById('create-item');
const itemCreation = document.getElementById('item-creation'); 
const cancelItemCreation = document.getElementById('cancel-create-item'); 
const addAditional = document.getElementById('create-aditional');
const aditionalCreation = document.getElementById('aditional-creation'); 
const cancelAditionalCreation = document.getElementById('cancel-create-aditional'); 

function clearForm(form){
	form.name.value="";
	form.price.value=0;
}

function loadTable(table, elements, type, database) {
	table.innerHTML="";
	for (const element of elements) {
		if(element.name.toLowerCase() !== 'seleccionar') {
			const tableData = document.createElement('tr');
			const name = document.createElement('td');
			const nameEdition = document.createElement('input');
			nameEdition.value = element.name;
			name.append(nameEdition);
			const price = document.createElement('td');
			const priceEdition = document.createElement('input');
			priceEdition.value = element.price;
			price.append(priceEdition);
			tableData.addEventListener('change', async () => {
				if(confirm('Estas seguro que deseas actualizar este elemento?')) {
					remainingElements = await updateItem(type, {id:element.id, name: nameEdition.value, price: priceEdition.value})
					loadTable(table, remainingElements, type, database);
				}
			})
			const remove = document.createElement('td');
			removeButton = document.createElement('button');
			removeButton.classList.add('remove-item')
			removeButton.innerHTML="<i class='fa-solid fa-trash-can'></i>"
			removeButton.addEventListener('click', async () => {
				if(confirm('Estas seguro que deseas eliminar este elemento?')) {
					remainingElements = await database.removeItem(type, element)
					loadTable(table, remainingElements, type, database);
				}
			});
			remove.append(removeButton);
	
			tableData.append(name, price, remove);
			table.append(tableData)
		}
	}
}

async function displayVariables() {
	const database = new Database();
	await database.connect();
	await database.loadElements()
	loadTable(clothingTable, clothing, 'clothing', database)
	loadTable(variablesTable, variables, 'variables', database)
	createClothing.addEventListener('click', () => {
		itemCreation.classList.remove('hidden');
	})
	
	addAditional.addEventListener('click', () => {
		aditionalCreation.classList.remove('hidden');
	})
	
	itemCreation.addEventListener('submit', async (event) => {
		event.preventDefault();
		const clothingUpdated = await database.addItem('clothing', {name: event.target.name.value, price: event.target.price.value})
		clearForm(itemCreation);
		itemCreation.classList.add('hidden');
		loadTable(clothingTable, clothingUpdated, 'clothing');
	})
	
	aditionalCreation.addEventListener('submit', async (event) => {
		event.preventDefault();
		const variablesUpdated = await database.addItem('variables', {name: event.target.name.value, price: event.target.price.value})
		clearForm(aditionalCreation);
		aditionalCreation.classList.add('hidden');
		loadTable(variablesTable, variablesUpdated, 'variables');
	})
	
	cancelItemCreation.addEventListener('click', () => {
		event.preventDefault();
		clearForm(itemCreation);
		itemCreation.classList.add('hidden');
	})
	
	cancelAditionalCreation.addEventListener('click', () => {
		event.preventDefault();
		clearForm(aditionalCreation);
		aditionalCreation.classList.add('hidden');
	})
}

displayVariables();

