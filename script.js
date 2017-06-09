 var pcForm = document.getElementById("pcForm");
	var totalPriceText = "Общая стоимость";
	var inputElems = pcForm.getElementsByTagName('input');	
	var total;
	var calculateTotal = function(){
	total = getDisplayPrice()+getProductPrice()+getCheckboxPrice();
	var totalDiv = document.getElementById('totalPrice');
	totalDiv.innerHTML = totalPriceText +" "+ total.toFixed(2);
	};

	function validateName(){
  var re = /[A-Za-z -']$/;
	if(re.test(this.value)){
	this.style.background ='#ccffcc';
	return true;
	}else{
  this.style.background ='#e35152';
  return false; 
}
} 
for (var i = 0; i < inputElems.length; i++)
		inputElems[i].onclick = calculateTotal;
pcForm.elements["includeinscription"].onclick = function(){
	if (this.checked) pcForm.elements["theinscription"].disabled = 0 
    // В противном случае вновь блокируем кнопку
    else pcForm.elements["theinscription"].disabled = 1
	pcForm.elements["submit"].onclick = function(){
		if(pcForm.elements["includeinscription"].checked){
		var name = document.getElementById('promo').textContent;
		var value = document.querySelector("#theinscription").value;
		product_base['promocode'] = {Name: name, price: value};
		alert('Записано!\n',value);
		console.log('pole : ',value)
		}
		product_base['All_price'] = {Name: totalPriceText, price: total};
		write_firebace();
		alert('Отправленно!');
	}
	calculateTotal();
}
	
	//pcForm.elements[*].onchange = calculateTotal;
	var selects = ["cpu","motherboard","video","memory","hdd1","PS","case"];
	for (var i=0; i<selects.length; i++)
	{
		pcForm.elements[selects[i]].onchange = function(){
			GetData(this.id);
			calculateTotal();
		}
	}
	pcForm.elements["theinscription"].onclick = validateName;

	var display = [];
	display["Round18"] = {name:'ЖК монитор 18,5" - Acer', price: 2236 } ;
	display["Round19"] = {name:'ЖК монитор 19,5" - Dell', price: 4523 };
	display["Round21"] = {name:'ЖК монитор 21,5" - Philips', price: 3192 };
	display["Round24"] = {name:'ЖК монитор 24" - Samsung', price: 6215 };
	display["Round34"] = {name:'ЖК монитор 34" - LG', price: 14576};
	
	var getDisplayPrice = function(){
		var selectedDisplay = pcForm.elements["selectedpc"];
		for (var i = 0; i < selectedDisplay.length; i++)
		{
			if(selectedDisplay[i].checked)
			{
				var selectedDisplaySize = selectedDisplay[i].value;
				//<-----------Firebase------------
				var price_1 = display[selectedDisplaySize].price;
				var name_1 = display[selectedDisplaySize].name;
				product_base["display"] = {Name: name_1, price: price_1};
				//<-------------------------------
				return display[selectedDisplaySize].price;
			}
		}	
		return 0;
	};
	
	function convect_txt_to_number(text){
		var masText = text.split(',');
		return parseFloat(masText[0]+'.'+masText[1]);
	} 
	
	var product = [];
	var product_base = [];
	 function GetData(idSelect){
		// получаем индекс выбранного элемента
		var selind = document.getElementById(idSelect).options.selectedIndex;
		//<-----------Firebase------------
		var txt= document.getElementById(idSelect).options[selind].text;
		var name = txt.split('.....')[0];
		var price = txt.split('.....')[1];
		//var val= document.getElementById(idSelect).options[selind].value;
		product_base[idSelect] = {Name: name, price: price};
		//<------------------------------
		product[idSelect] = convect_txt_to_number(price);
	}  //функция вызывается при выборе и записывает значение Value и price в переменную/(по возможности в массив)
	
	var getProductPrice = function(){
		var productPrice = 0;
		for (var i in product)
		{
			productPrice += product[i];
		}
		return productPrice;
	};
	
		
	var getCheckboxPrice = function(){
		var selectedCheckbox = pcForm.elements["includecandles"];
			if(selectedCheckbox.checked)
			{
				//<-----------Firebase------------
				var txt= document.getElementById('inline').textContent;
				var name_2 = txt.split('(')[0];
				var price_2 = Number(selectedCheckbox.value);
				product_base['checkbox'] = {Name: name_2, price: price_2};
				//<-------------------------------
				return price_2;
			}else{
				return 0;
			}
		
	};

	
	//<-----------Firebase------------
	var db = firebase.database();
	function write_firebace(){
			for (var i in product_base){
			//db.ref('pc1/'+i+'/'+product_base[i].Name).set(product_base[i].price);
			db.ref('pc3/'+product_base[i].Name).set(product_base[i].price);
		}
	}
	//--------------------------------
	