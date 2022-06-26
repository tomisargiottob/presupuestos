// Añadir a la tabla un elemento mas
function addTableData(number, name, amount, price, total) {
	const itemDetails = document.createElement('tr');
	const itemNumber = document.createElement('td');
	itemNumber.textContent = number;
	itemNumber.classList.add('item-number');

	const itemName = document.createElement('td');
	itemName.textContent = name;
	itemName.classList.add('item-name');

	const itemAmount = document.createElement('td');
	itemAmount.textContent = amount;
	itemAmount.classList.add('item-amount');

	const itemPrice = document.createElement('td');
	itemPrice.textContent = price;
	itemPrice.classList.add('item-price');

	const rowPrice = total ? `<strong>${total}</strong>` : +price * +amount

	const totalItemPrice = document.createElement('td');
	totalItemPrice.classList.add('item-total');
	totalItemPrice.innerHTML = rowPrice;
	itemDetails.append(itemNumber, itemName, itemAmount, itemPrice, totalItemPrice);

	return [itemDetails, +rowPrice]
}

function createShowHideButtons(element, callback) {
	const showButton = document.createElement('button');
	showButton.innerHTML= "<div class='add-icon'><i class='fa-solid fa-eye'></i></div>";
	showButton.className='action-button';
	
	const hideButton = document.createElement('button');
	hideButton.className='action-button';
	hideButton.classList.add('hidden');
	hideButton.innerHTML= "<div class='add-icon'><i class='fa-solid fa-eye-slash'></i></div>";

	showButton.addEventListener('click', (event) => {
		event.preventDefault();
		if(callback) {
			callback();
		}
		element.classList.remove('hidden');
		hideButton.classList.remove('hidden');
		showButton.classList.add('hidden');
	})
	hideButton.addEventListener('click', (event) => {
		event.preventDefault();
		hideButton.classList.add('hidden');
		showButton.classList.remove('hidden');
		element.classList.add('hidden');
	})
	return [showButton,hideButton];
}

const translation = {
	date: 'Fecha:',
	school: 'Colegio',
	contactName: 'Delegado',
	students: 'Numero de alumnos',
	contactEmail: 'Email del delegado',
}
