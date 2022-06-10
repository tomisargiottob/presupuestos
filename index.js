// declaración de constantes con datos, esto debería pedirse a la base de datos en un futuro.
const clothing = [{ name: 'Seleccionar', price: 0 },{ name: 'campera', price: 100 },{ name: 'buzo', price: 200 },{ name: 'remera', price: 300 },{ name: 'chomba', price: 400 },{ name: 'babucha', price: 500 },{ name: '2do buzo', price: 600 },{ name: '2da remera', price: 700 },{ name: '2da chomba', price: 800 },{ name: '2da babucha', price: 900 }];

const variables =[{'name':'Seleccionar','price':0},{'name':'CANTIDAD DE CORTES','price':0},{'name':'CANTIDAD DE VIVOS','price':100},{'name':'CORDERO EN CAPUCHA','price':200},{'name':'SUBLIMADO COMPLETO','price':300},{'name':'SUBLIMADO PARCIAL','price':400},{'name':'SUBLIMADO CAPUCHA/APLIQUE','price':500},{'name':'BORDADO APLIQUE XL','price':600},{'name':'BORDADO APLIQUE GRANDE','price':700},{'name':'BORDADO APLIQUE MEDIANO','price':800},{'name':'BORDADO HILO XL','price':900},{'name':'BORDADO HILO GRANDE','price':1000},{'name':'BORDADO HILO MEDIANO','price':1100},{'name':'BORDADO HILO CHICO','price':1200},{'name':'ESTAMPADO XXL','price':1300},{'name':'ESTAMPADO GRANDE','price':1400},{'name':'ESTAMPADO MEDIANO','price':1500}];

const itemsTitles = ['Prenda', 'Cantidad', 'Precio', 'Adicionales']

// transformo las opciones en HTML
function createOptions(options) {
	const selectOptions = options.reduce((accOptions, option)=> {
		accOptions.push(`<option value='${option.name.toLowerCase()}'>${option.name}</option>`)
		return accOptions;
	},[])
	return selectOptions
}

function createDeleteButton(callback) {
	const button = document.createElement('button');
	button.innerHTML= '<div class="delete-icon"><i class="fa-solid fa-trash-can"></i></div>';
	button.className='remove-item';
	button.addEventListener('click', callback)
	return button
}

function findPrice(options, price, select) {
	itemPrice = options.find((option) => option.name.toLowerCase() === select.value);
	price.value = itemPrice.price
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
	const item = document.createElement('div');
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
	setAttributes(selectClothing, { name: `item${itemList.children.length}`, form: 'item-form'})
	
	// input para introducir la cantidad de prendas
	const ammount = document.createElement('input');
	setAttributes(ammount, { type: 'name', id: `item${itemList.children.length}Ammount`})

	// input para incorporar el precio, se trae automaticamente del select pero es modificable
	const price = document.createElement('input');
	setAttributes(price, { type: 'number', id: `item${itemList.children.length}Price` })
	selectClothing.addEventListener('change', () => findPrice(clothing, price, selectClothing))

	const counter = document.createElement('span');
	counter.textContent=0;
	// cada prenda es personalizable, esta sección se encarga del listado de adicionales de una prenda, cada prenda tiene sus adicionales
	const additionals = document.createElement('div');
	additionals.className='additionals-list hidden';
	const addAditional = document.createElement('button');
	const additionalsList = document.createElement('ol');
	addAditional.className = 'add-additionals';
	addAditional.innerHTML = "<div class='add-icon'><i class='fa-solid fa-plus'></i> Adicional</div>";
	addAditional.addEventListener('click', ()=> createAditional(additionalsList, counter));
	additionals.append(additionalsList, addAditional);

	// boton de mostrar y ocultar adicionales para que a medida que se van creando prendas se puedan personalizar
	const showAdditionals = document.createElement('button');
	showAdditionals.innerHTML= "<div class='add-icon'><i class='fa-solid fa-eye'></i></div>";
	showAdditionals.className='show-additionals';
	
	const hideAdditionals = document.createElement('button');
	hideAdditionals.className='show-additionals';
	hideAdditionals.classList.add('hidden');
	hideAdditionals.innerHTML= "<div class='add-icon'><i class='fa-solid fa-eye-slash'></i></div>";

	showAdditionals.addEventListener('click', () => {
		additionals.classList.remove('hidden');
		item.classList.remove('hidden');
		hideAdditionals.classList.remove('hidden');
		showAdditionals.classList.add('hidden');
	})
	hideAdditionals.addEventListener('click', ()=>{
		hideAdditionals.classList.add('hidden');
		showAdditionals.classList.remove('hidden');
		additionals.classList.add('hidden');
	})

	// agregamos todos los elementos al item y el item al listado de items
	item.append(removeItemButton, selectClothing, ammount, price, counter, showAdditionals, hideAdditionals);
	itemDetails.append(item,additionals);

	itemList.append(itemDetails);
}

function createAditional(additionals, counter) {
	event.preventDefault();
	const additional = document.createElement('li');
	counter.textContent = Number(counter.textContent) + 1;
	const removeAdditional = () => {
		additionals.removeChild(additional);
		counter.textContent = Number(counter.textContent) - 1;
	};
	const removeAdditionalButton = createDeleteButton(removeAdditional);
	const selectAditional = document.createElement('select');
	selectAditional.innerHTML = createOptions(variables);
	// input para introducir la cantidad de prendas
	const additionalAmmount = document.createElement('input');
	setAttributes(additionalAmmount, { type: 'name', id: `additional${additionals.children.length}Ammount`})

	// input para incorporar el precio, se trae automaticamente del select pero es modificable
	const additionalPrice = document.createElement('input');
	setAttributes(additionalPrice, { type: 'number', id: `additional${additionals.children.length}Price` })
	selectAditional.addEventListener('change', () => findPrice(variables, additionalPrice, selectAditional))

	additional.append(removeAdditionalButton, selectAditional, additionalAmmount, additionalPrice);
	additionals.append(additional);
}

// funcion que se encarga de crear la vista previa del formulario. guardarse en base de datos
function createPreview(event) {
	event.preventDefault();
	const formData = new FormData(document.getElementById('school-form'));
	const schoolData = document.getElementById('school-data');
	schoolData.innerHTML='';
	for (var pair of formData.entries()) {
		if (pair[1]){
			const item = document.createElement('li');
			item.innerText = `${pair[0]} : ${pair[1]}`
			schoolData.append(item)
		}
	}
	let total = 0;
	const itemFormData = new FormData(document.getElementById('item-form'))
	const finalPrice = document.getElementById('final-price');
	for (var pair of itemFormData.entries()) {
		if(pair[1] !== 'seleccionar'){
			const itemAmmount = document.getElementById(`${pair[0]}Ammount`).value;	
			const itemPrice = document.getElementById(`${pair[0]}Price`).value;
			if (itemPrice && itemAmmount) {
				total += itemPrice * itemAmmount;
			}
		}
	}
	finalPrice.textContent= `Total: ${total}$`;
}

// La idea es que pueda imprimirse como PDF 
function downloadBudget (event) {
	event.preventDefault();
	console.log('descargando presupuesto');
}

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

const addItemButton = document.getElementById('add-item');
addItemButton.addEventListener('click', addItem);

const downloadFile = document.getElementById('download-budget');
downloadFile.addEventListener('click', downloadBudget);