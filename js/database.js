
let clothing = [{ name: 'Seleccionar', price: 0 }];
let variables = [{ name: 'Seleccionar', price: 0 }];
const baseSelect = [{ name: 'Seleccionar', price: 0 }];
// para hacer la consulta a base de datos

class Database{
	constructor() {
		this.firebaseConfig = {
		};
	}

	async connect() {
		await firebase.initializeApp(this.firebaseConfig);
		this.db = await firebase.firestore();	
	}

	async loadClothing(initial) {
		try {
			if (initial) {
				clothing = JSON.parse(sessionStorage.getItem('clothing'));
				if (clothing){
					return clothing
				}
			}
			const querySnapshot = await this.db.collection("clothing").get()
			clothing = [...baseSelect]
			querySnapshot.forEach((doc) => {
				clothing.push({id: doc.id, ...doc.data()});
			})
			sessionStorage.setItem('clothing',JSON.stringify(clothing))
			return clothing;
		} catch (error) {
			console.error("Error fetching clothing: ", error);
		}
	}

	async loadVariables(initial) {	
		try {
			if (initial) {
				variables = JSON.parse(sessionStorage.getItem('variables'));
				if (variables){
					return variables
				}
			}
			const querySnapshot = await this.db.collection("variables").get()
			variables = [...baseSelect]
			querySnapshot.forEach((doc) => {
				variables.push({id: doc.id, ...doc.data()});
			});
			sessionStorage.setItem('variables', JSON.stringify(variables))
			return variables
		} catch (error) {
			console.error("Error fetching variables: ", error);
		}
	}
	async loadElements() {	
		const first = this.loadClothing(true);
		const second = this.loadVariables(true);
		await Promise.all([first, second])
	}
	async saveBudget (budget) {
		if (!this.db) {
			showAlert('Could not connect to database please try again later','error');
			return;
		}
		if(!budget.date || budget.school || budget.total) {
			showAlert('No date, school or total price indicated for budget, please try again','error');
			return;
		}
		try {
			await this.db.collection('budgets').add(budget)
			const budgets = JSON.parse(sessionStorage.getItem('budgets'));
			if (budgets) {
				budgets.push(budget);
				sessionStorage.setItem('budgets',JSON.stringify(budgets))
			}
			showAlert('budget succesfully saved in database','success');
		} catch (err) {
			console.error("Error adding document: ", err);
		}
	}
	
	async loadBudgets(initial, from, to) {
		if (!this.db) {
			showAlert('Could not connect to database please try again later','error');
			return;
		}
		try {
			if (initial) {
				const memoryBudgets = JSON.parse(sessionStorage.getItem('budgets'));
				if (memoryBudgets) {
					return memoryBudgets
				}
			}
			const budgets = [];
			const querySnapshot = await this.db.collection('budgets').get();
			querySnapshot.forEach((doc) => {
				budgets.push({id: doc.id, ...doc.data()});
			});
			sessionStorage.setItem('budgets',JSON.stringify(budgets))
			return budgets;
		} catch (err) {
			showAlert('Error searching for budgets','error');


		}
	}

	async removeItem (type, item) {
		if (!this.db) {
			showAlert('Could not connect to database please try again later','error');
			if (type ==="clothing") {
				clothing = clothing.filter((element) => element.name !== item.name)
				return clothing;
			}
			if (type ==="variables") {
				variables = variables.filter((element) => element.name !== item.name)
				return variables;
			}
		}
		try{
			await this.db.collection(type).doc(item.id).delete(item)
			showAlert(`${type} succesfully removed from database`,'success');
			if(type==="variables"){
				return this.loadVariables();
			} else if (type==="clothing"){
				return this.loadClothing();
			}
		} catch (error) {
			showAlert(`Error removing ${type}: ${error}`,'error');
		}	  
	}
	async addItem (type, item) {
		if (!this.db) {
			showAlert('Could not connect to database please try again later','error');
			if (type ==="clothing") {
				clothing.push(item)
			}else if (type ==="variables") {
				variables.push(item)
			}
			return;
		}
		try {
			await this.db.collection(type).add(item)
			showAlert(`${type} succesfully added to database`,'success');
			if(type==="variables"){
				return this.loadVariables();
			} else if (type==="clothing"){
				return this.loadClothing();
			}	  
		} catch(error) {
			showAlert(`Error adding ${type}: ${error}`,'error');
		}
	}
	
	async updateItem (type, item) {
		if (!db) {
			showAlert('Could not connect to database please try again later','error');
			if (type ==="clothing") {
				clothes = clothing.find((element) => element.name === item.name);
				clothes.price = item.price;
				clothes.name = item.name;
				return clothing;
			}
			if (type ==="variables") {
				aditional = variables.find((element) => element.name === item.name);
				aditional.price = item.price;
				aditional.name = item.name;
				return variables;
			}
		}
		var element = db.collection(type).doc(item.id);
		try {
			await element.update(item);
			showAlert(`${type} succesfully added to database`,'success');
			if(type==="variables"){
				return loadVariables();
			} else if (type==="clothing"){
				return this.loadClothing();
			}
		} catch (error) {
			showAlert(`Error updating ${type}: ${error}`,'success');
		}	  
	}
}

// Initialize Firebase








// funciona de manera local
// let clothing = [{ name: 'Seleccionar', price: 0 },{ name: 'campera', price: 100 },{ name: 'buzo', price: 200 },{ name: 'remera', price: 300 },{ name: 'chomba', price: 400 },{ name: 'babucha', price: 500 },{ name: '2do buzo', price: 600 },{ name: '2da remera', price: 700 },{ name: '2da chomba', price: 800 },{ name: '2da babucha', price: 900 }];

// let variables =[{'name':'Seleccionar','price':0},{'name':'CANTIDAD DE CORTES','price':0},{'name':'CANTIDAD DE VIVOS','price':100},{'name':'CORDERO EN CAPUCHA','price':200},{'name':'SUBLIMADO COMPLETO','price':300},{'name':'SUBLIMADO PARCIAL','price':400},{'name':'SUBLIMADO CAPUCHA/APLIQUE','price':500},{'name':'BORDADO APLIQUE XL','price':600},{'name':'BORDADO APLIQUE GRANDE','price':700},{'name':'BORDADO APLIQUE MEDIANO','price':800},{'name':'BORDADO HILO XL','price':900},{'name':'BORDADO HILO GRANDE','price':1000},{'name':'BORDADO HILO MEDIANO','price':1100},{'name':'BORDADO HILO CHICO','price':1200},{'name':'ESTAMPADO XXL','price':1300},{'name':'ESTAMPADO GRANDE','price':1400},{'name':'ESTAMPADO MEDIANO','price':1500}];

