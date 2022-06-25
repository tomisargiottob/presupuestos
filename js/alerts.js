function showAlert(message, type){
	const alertMessage = document.createElement('div');
	alertMessage.classList.add('alert-message');
	let icon;
	if(type === 'success') {
		alertMessage.classList.add('success-message');
		icon = "fa-solid fa-circle-check"
	} else if (type === 'error') {
		alertMessage.classList.add('error-message');
		icon = "fa-solid fa-circle-exclamation"
	}	
	alertMessage.innerHTML=`<p><i class='${icon}'></i>${message}</p>`
	const [documentBody] = document.getElementsByTagName('body');
	alertMessage.style.animation = 'fadeIn 0.3s linear';
	documentBody.appendChild(alertMessage);
	setTimeout(() => {
		alertMessage.style.animation = 'fadeOut 0.3s linear';
		documentBody.removeChild(alertMessage);
	}, 3000)
}