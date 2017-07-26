
var doc = document;


/* HTMLDocument *******************************************************************************************************/

HTMLDocument = Document || HTMLDocument;

HTMLDocument.prototype.width = self.innerWidth || doc.documentElement.clientWidth;
HTMLDocument.prototype.height = self.innerHeight || doc.documentElement.clientHeight;

HTMLDocument.prototype.onready=function(handler){
	 window.addEventListener('load', handler);
}
HTMLDocument.prototype.selector = HTMLElement.prototype.selector=function(selector, All){
	if(All){
		var nodes = this.querySelectorAll(selector);
		return Array.prototype.slice.call(nodes);
	}else var nodes = this.querySelector(selector);
	return (nodes || null);
}
HTMLDocument.prototype.getScrollTop=function(){
	return  window.pageYOffset || document.documentElement.scrollTop;
}
HTMLDocument.prototype.getScrollLeft=function(){
	return  window.pageXOffset || document.documentElement.scrollLeft;
}
HTMLDocument.prototype.create=function(tagName, attributes, content){
	var obj = this.createElement(tagName);
	if(content){
		if(typeof(content)=="string"){
			obj.innerHTML=content;
		}else if(typeof(content)==="object"){
			if(content.nodeType in {"1":null, "3":null, "11":null}){
				obj.appendChild(content);
			}else if(content.constructor == Array){
				obj.appendChilds(content);
			}
		}
	}
	for(var key in attributes){
		if(attributes.hasOwnProperty(key)){
			obj.setAttribute(key, attributes[key]);
		}
	}
       return obj;
   }
HTMLDocument.prototype.fragment=function(content){
	if(content){
		if(typeof(content)=="string"){
			var temp = document.createElement("template");
				temp.innerHTML = content;
			var obj = temp.content;
		}else if(typeof(content)=="object" && content.nodeType in {1:null, 3:null, 11:null}){
			var obj = this.createDocumentFragment();
			obj.appendChilds(content);
		}
	}return obj;
}
HTMLDocument.prototype.build=function(list){
	var fragment = document.createDocumentFragment();
	for(var i=0; i<list.length; i++){
		for(var tag in list[i]){
			var node = document.createElement(tag);
			for(var key in list[i][tag]){
				if(list[i][tag][key].constructor == Array){
					node.appendChild(document.build(list[i][tag][key]));
				}else if(list[i][tag][key].constructor == Object){
					for(var subkey in list[i][tag][key]){
						node[key][subkey] = list[i][tag][key][subkey];
					}
				}else node[key] = list[i][tag][key];
			}
			fragment.appendChild(node);
		}
	}
	return fragment;
}

/* HTMLElement *******************************************************************************************************/
	
DocumentFragment.prototype.first=HTMLElement.prototype.first=function(){
       var node=this.firstChild;
       while(node && node.nodeType!=1){
		node=node.nextSibling;
	}
       return node || null;
   }
DocumentFragment.prototype.last=HTMLElement.prototype.last=function(){
       var node=this.lastChild;
       while(node && node.nodeType!=1){
		node=node.previousSibling;
	}
       return node || null;
   }
HTMLElement.prototype.next=function(){
	var node=this.nextSibling;
	while(node && node.nodeType!=1){
		node = node.nextSibling;
	}
	return node || null;
   }
HTMLElement.prototype.previous=function(){
	var node=this.previousSibling;
	while(node && node.nodeType!=1){
		node = node.previousSibling;
	}
	return node || null;
   }
HTMLElement.prototype.parent=function(level){
	level=level || 1;
	var node=this;
	for(; level--;){
		if(node){ node=node.parentNode; }
	}
	return node;
   }
HTMLElement.prototype.ancestor=function(tagName){
	if(tagName){
		tagName=tagName.toUpperCase();
		var node=this.parentNode;
		while(node && node.nodeName!=tagName){
			node=node.parentNode;
		}
		return node || null;
	}else return false;
   }
HTMLElement.prototype.insertToBegin=function(node){
	if(node){
		var first;
		if(first=this.firstChild){
			first = this.insertBefore(node, first);
		}else{
			first = this.appendChild(node);
		}
		return first;
	}else return false;
   }
HTMLElement.prototype.insertBeforeNode=function(node){
	if(typeof node==="string"){
		this.insertAdjacentHTML("afterBegin", node);
	}else if(typeof node==="object"){
		this.insertAdjacentElement("afterBegin", node)
	}else return false;
   }
HTMLElement.prototype.insertAfter=function(node){
	if(typeof node==="string"){
		this.insertAdjacentHTML("afterEnd", node);
	}else if(typeof node==="object"){
		this.insertAdjacentElement("afterEnd", node)
	}else return false;
   }
HTMLElement.prototype.childElements=function(){
	var children = this.childNodes;
	var childrenList = [];
	if(children.length){
		for(var i=0; i<children.length; i++){
			if(children[i].nodeType==1){
				childrenList.push(children[i]);
			}
		}
	}
	return childrenList;
   }
HTMLElement.prototype.appendChilds = DocumentFragment.prototype.appendChilds = function(nodeList){
	for(var i=0; i<nodeList.length; i++){
		this.appendChild(nodeList[i]);
	}
	return i;
}
HTMLElement.prototype.build=function(list, clean){
	if(clean) this.innerHTML = "";
	var fragment = document.build(list);
	this.appendChild(fragment);
	return fragment;
}
HTMLElement.prototype.getCss=function(rule){
	var obj = window.getComputedStyle(this, "");
	return obj.getPropertyValue(rule);
}
HTMLElement.prototype.fullScrollTop=function(){
	var srl = 0;
	var obj = this;
	while(obj.nodeType==1){
		srl += obj.scrollTop;
		obj = obj.parentNode;
	}
	return srl;
}
HTMLElement.prototype.fullScrollLeft=function(){
	var srl = 0;
	var obj = this;
	while(obj.nodeType==1){
		srl += obj.scrollLeft;
		obj = obj.parentNode;
	}
	return srl;
}
	
/* NodeList **********************************************************************************************************/
	
NodeList.prototype.on = function(e, handler){
	for(var i=this.length; i--;){
		this[i].addEventListener(e, handler);
	}
}
NodeList.prototype.set = function(property, value){
	for(var i=this.length; i--;){
		this[i][property] = value;
	}
}


/* Ajax **************************************************************************************************************/

if(window.XMLHttpRequest){
	XMLHttpRequest.prototype.ready = true;
	XMLHttpRequest.prototype.stack = [];
	XMLHttpRequest.prototype.defaults = {
		"body":'{}',
		"async":true,
		"protect":true,
		"method":"POST",
		"timeout":15000,
		"Cache-Control":"no-cache",
		"onsuccess":function(response){ return true },
		"onerror":function(response){ console.log(response); },
		"Content-Type":"application/json"	//	"text/plain", "text/xml", "text/html", "application/octet-stream", "multipart/form-data", "application/x-www-form-urlencoded";
	};
	XMLHttpRequest.prototype.push = function(request){
		if(request['addressee']){
			for(var key in XHR.defaults){
				if(XHR.defaults.hasOwnProperty(key)){
					request[key] = request[key] || XHR.defaults[key];
				}	
			}
			XHR.stack.push(request);
			XHR.execute();
		}else console.log("XHR ERROR: Not specified addressee");
	};
	XMLHttpRequest.prototype.execute = function(){
		if(XHR.ready){
			var request = XHR.stack.shift();
			XHR.ready=false;
			
			XHR.open(request.method, request.addressee, request.async);
			XHR.timeout = request.timeout;
			XHR.setRequestHeader("Content-Type", request['Content-Type']);
			
			var indicator = doc.create("div", {id:"loading-indicator", style:"opacity:1.0"});
			doc.body.appendChild(indicator);
			XHR.onreadystatechange=function(){
				if(XHR.readyState==4){
					XHR.ready=true;
					doc.body.removeChild(indicator);
					(XHR.status==200) ? request.onsuccess(XHR.response) : request.onerror(XHR.statusText);
					if(XHR.stack.length) XHR.execute();
				}
			}
			if(request.protect) reauth();
			XHR.send(request.body);
		}
	}
	var XHR = new XMLHttpRequest();
}

/* Box *******************************************************************************************/

var ContextMenu = new function(){
	var box = this;
	var menu = null;
	this.create = function(event, builder){
		event.preventDefault();
		var offset = [];
		var obj = event.target;

		if(event.clientY > (doc.height / 2)){
			offset = ["bottom:"+(doc.height - event.clientY - 16)+"px"];
		}else offset = ["top:"+(event.clientY - 16)+"px"];

		if(event.clientX > (doc.width / 2)){
			offset.push("right:"+(doc.width - event.clientX - 16)+"px");
		}else offset.push("left:"+(event.clientX - 16)+"px");

		menu = menu || doc.create("div",{id:"contextMenu"});
		menu.style.cssText = offset.join(";");

		menu.build( builder(obj), true );
		doc.body.appendChild(menu);

		doc.addEventListener("click", this.drop);
		menu.onclick = function(event){
			event.cancelBubble = true;
			box.drop();
		}
	}
	this.drop = function(){
		doc.removeEventListener("click", box.drop);
		doc.body.removeChild(menu);
		menu = null;
	}
}
var Box = function(params, source){
	var box = this;
	XHR.push({
		"body":params,
		"addressee":"/"+source,
		"reauth":protect || false,
		"onsuccess":function(response){
			var substrate = document.fragment(response);

			box.substrate = substrate.first();
			box.handle = box.substrate.querySelector(".handle");
			box.window = box.substrate.querySelector(".box");
			box.body = box.substrate.querySelector(".box>.box-body");

			document[box.substrate.dataset.target].appendChild(box.substrate);
			
			var scripts = box.substrate.querySelectorAll("script");
			for(var i=0; i<scripts.length; i++){
				var script = document.createElement("script");
				if(scripts[i].src){
					script.src = scripts[i].src;
				}else script.innerHTML = scripts[i].innerHTML;
				scripts[i].parentNode.replaceChild(script, scripts[i]);
			}
			
			supervisor.add(box);

			box.handle.onchange=function(){
				if(this.checked){
					supervisor.setFocus(this.id);
				}else{
					this.classList.toggle("active");
					if(this.classList.contains("active")){
						this.checked = true;
						supervisor.setFocus(this.id);
					}else supervisor.setFocus(false);
				}
			}

			if(typeof box.onopen==="function") box.onopen();
			if(typeof box.onsubmit==="function"){
				box.window.onsubmit = function(event){
					event.preventDefault();
					box.onsubmit(this)
				}
			}
		}
	});
}

var supervisor = {
	add(box){
		this.stack[box.handle.id] = box;
		this.setFocus(box);
		this.onadded();
	},
	drop(box){
		box = box || this.active;
		box.substrate.parentNode.removeChild(box.substrate);
		this.ondrop(box.handle.id);
		if(typeof box.ondrop==="function") box.ondrop();
		delete this.stack[box.handle.id];
		delete window[box.handle.id];
		delete this.active;
		delete box;
		this.setFocus(Object.keys(this.stack)[0]);
	},
	setFocus(obj){
		var handle = (typeof obj==="object") ? obj.handle.id : obj;
		if(handle){
			if(Object.keys(supervisor.stack).length){
				if(supervisor.active && supervisor.active.handle && (supervisor.active.handle.id)===handle) return true;
				for(var key in this.stack){
					this.stack[key].handle.classList.toggle("active", false);
				}
				taskbar.selector("label", true).forEach(function(item){
					if(item.htmlFor===handle){
						item.classList.toggle("active", true);
					}else item.classList.toggle("active", false);
				});
				this.active = this.stack[handle] || null;
			
				this.active.handle.classList.toggle("active", true);
				location.hash = "h"+this.active.handle.value;
			}else history.pushState('', document.title, window.location.pathname);

			if(typeof this.active.onfocus==="function") this.active.onfocus();
		}
	},
	onadded(){ return false; },
	ondrop(){ return false; },
	active:{},
	stack:{}
}

/* Wordlist ***********************************************************************************************************/

var Wordlist = {
	names:[],
	fragment(owner){
		owner = owner || document;
		owner.selector("*[data-translate]", true).forEach(function(item){
			var target = item.dataset.translate;
			item[target] = Wordlist[item[target]] || item[target];
		});
	},
	addWordlist(dictionary, name){
		if(name && isNaN( this.names.inArray(name))){
			this.names.push(name);
		}else return false;
		for(var key in (dictionary || {})){
			this[key] = dictionary[key];
		}
	}
}

/* Object ************************************************************************************************************/

function inArray(obj, value){
	for(var key in obj) if(obj.hasOwnProperty(key) && (obj[key] == value)) return key;
	return false;
}
function flip(obj){
	var outObj={};
	obj=obj || {};
	for(var key in obj){
		if(typeof(obj[key]) in {"string":0,"number":0,"boolean":0} || obj[key]===null && obj.hasOwnProperty(key)){
			outObj[obj[key]]=key;
		}
	} return outObj;
}

/* Array *************************************************************************************************************/

Array.prototype.inArray = function(value){
	for(var i=this.length; i--;) if(this[i] == value) return i;
	return NaN;
}
Array.prototype.toJSON = function(){
	var isArray, item, t, json = [];
	for(var i=0; i<this.length; i++){
		item=this[i];
		t=typeof(item);
		isArray = (item.constructor == Array);
		if(t=="string"){
			item = '"'+item+'"';
		}else if(t=="object" && item!==null){
			item=JSON.encode(item);
		}
		json.push(String(item));
	}
	return '['+String(json)+']';
}


/* String ************************************************************************************************************/

String.prototype.trim=function(){
	return this.replace(/(^\s+)|(\s+$)/g, "");
}
String.prototype.translite=function(space, url){
	space=space || " ";
	
	var str = this;
	if(url){
		str = str.trim().toLowerCase().replace(/(?!-)\W/g,"");
	}
	var dictionary={
		"а":"a", "б":"b", "в":"v", "г":"g", "ґ":"g", 
		"д":"d", "е":"e", "ж":"g", "з":"z", "и":"i", 
		"і":"i", "ї":"yi", "й":"y", "к":"k", "л":"l", 
		"м":"m", "н":"n", "о":"o", "п":"p", "р":"r", 
		"с":"s", "т":"t", "у":"u", "ф":"f", "ы":"y", 
		"э":"e", "ё":"yo", "х":"h", "ц":"ts", "ч":"ch", 
		"ш":"sh", "щ":"shch", "ъ":"", "ь":"", "ю":"yu", 
		"я":"ya", "А":"A", "Б":"B", "В":"V", "Г":"G", 
		"Ґ":"G", "Д":"D", "Е":"E", "Ж":"G", "З":"Z", 
		"И":"I", "І":"I", "Ї":"YI", "Й":"Y", "К":"K", 
		"Л":"L", "М":"M", "Н":"N", "О":"O", "П":"P", 
		"Р":"R", "С":"S", "Т":"T", "У":"U", "Ф":"F", 
		"Ы":"Y", "Э":"E", "Ё":"YO", "Х":"H", "Ц":"TS", 
		"Ч":"CH", "Ш":"SH", "Щ":"SHCH", "Ъ":"", "Ь":"", 
		"Ю":"YU", "Я":"YA"," ":space};
	var str = this.replace(/[\s\S]/g, function(x){
		if(dictionary.hasOwnProperty( x )){
			return dictionary[x];
		}else return x; });
	return str;
}
String.prototype.levenshtein=function(substr){
	var length1=this.length;
	var length2=substr.length;
	var diff,tab=new Array(); 
	for(var i=length1+1; i--;){
		tab[i]=new Array();
		tab[i].length=length2+1;
		tab[i][0]=i;
	}
	for(var j=length2+1; j--;){tab[0][j]=j;}
	for(var i=1; i<=length1; i++){
		for(var j=1; j<=length2; j++){
			diff=(this.toLowerCase().charAt(i-1)!=substr.toLowerCase().charAt(j-1));
			tab[i][j]=Math.min(Math.min(tab[i-1][j]+1, tab[i][j-1]+1), tab[i-1][j-1]+diff);     
		}
	}
	return tab[length1][length2];
}
String.prototype.isFormat=function(reg){
	var str = this;
	var pattern = new RegExp(reg || ".+");
	if(!pattern.test(str)){
		alertBox("incorrect format");
		return false;
	}else return true;
}
String.prototype.jsonToObj=function(){
	var obj,str = this;
	try{
		obj = JSON.parse(str);
	}catch(e){
		obj = false;
	}
	return obj;
}
String.prototype.listToArray=function(){
	var list = this.split(/,/);
	for(var i=list.length; i--;){
		list[i] = list[i].trim();
	}
	return list;
}
String.prototype.format=function(numbers){
	var str = this;
	for(var i=0; i<numbers.length; i++){
		pattern = /%\d*[dbx]/.exec(str)[0];
		key=pattern[pattern.length-1];
		value=parseInt(numbers[i]).toString({"d":10, "b":2, "x":16}[key]);
		lng=parseInt(pattern.substring(1));
		for(var fill="0"; value.length<lng; value=fill+value);
		str = str.replace(pattern, value);
	}
	return str;
}

/* Number ************************************************************************************************************/

function random(min, max){
	min = min || 0;
	max = max || 2147483647;
	return (Math.random() * (max - min + 1) + min)^0;
}

/* COOKIES ***********************************************************************************************************/

var COOKIE = new function(){
	this.get=function(cName){
		var obj = {};
		var cookies=document.cookie.split(/;|=/);
		for(var i=0; i<cookies.length; i++){
			if(cookies[i].trim()===cName) return decodeURI(cookies[++i]);
		}
	}
	this.set=function(name, value, options){
		options = options || {};
		
		var expires = options.expires;
		if(typeof(expires) == "number" && expires){
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if(expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}
		value = encodeURIComponent(value);
		var updatedCookie = name+"="+value;
		for(var key in options){
			if(options.hasOwnProperty(key)){ 
				updatedCookie+="; "+key;
				if(options[key]!==true){
					updatedCookie+="="+options[key];
				}
			}
		}
		document.cookie = updatedCookie;
	}
	this.remove=function(name){
		this.set(name, "", {"expires":-1});
	}
	this.clear=function(){
		for(var key in this){
			if(typeof(this[key])=="string"){
				this.set(key, "", {"expires":-1});
			}
		}
	}
}

/* URL ***************************************************************************************************************/

function splitParams(str){
	var path = str.replace(/^\?/, "").split(/\&/);
	var params={}, temp=[];
	for(var i=0; i<path.length; i++){
		temp = path[i].split(/=/);
		params[temp[0]] = temp[1];
	}
	return params;
}

	
/* JSON **************************************************************************************************************/

var JSON = JSON || new Object;

JSON.encode = function(obj, level){
	level = level || 0;
	var t = typeof(obj);
	if(typeof obj!="object"){
		return '"'+String(obj)+'"';
	}else{
		var t="",
			json = [],
			isArray = (obj && obj.constructor == Array);
		for(var i=0; i<level; i++) t += '\t';
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				if(typeof obj[key]==="object"){
					var item = JSON.encode(obj[key], level+1);
				}else var item = '"'+String(obj[key]).trim()+'"';
				json.push( (isArray ? '' : '"'+key.replace(/"/g,"&quot;").trim()+'":')+item );
			}
		}
		return isArray ? '[\n\t'+t+json.join(',\n\t'+t)+'\n'+t+']' : '{\n\t'+t+json.join(',\n\t'+t)+'\n'+t+'}';
	}
}
JSON.stringify = JSON.stringify || JSON.encode;
JSON.parse = JSON.parse || function(str){
	if(str==="") str = '""';
	eval("var obj="+str+";");
	return obj;
}

/* Session ***********************************************************************************************************/

var session = window.sessionStorage || new function(){
	try{
		JSON.parse(window.name);
	}catch(e){ window.name = "{}"; }
	
	this.getItem = function(varName){
		return JSON.parse(window.name)[varName] || null;
	}
	this.setItem = function(varName, val){
		var temp=JSON.parse(window.name);
			temp[varName]=val;
			window.name=JSON.stringify(temp);
	}
}

var storage = window.localStorage || session;

session.__proto__.open = function(){
	var today = new Date();
		today.setUTCHours(0,0,0,0);
	var oldTimestamp = session.getItem("today");
	var newTimestamp = today.getTime();
	if(newTimestamp > oldTimestamp){
		session.setItem("today", today.getTime());
		return false;
	}else return true;
}

/* Date **************************************************************************************************************/

function date(pattern, timestamp){
	var M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var F = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	pattern=pattern||"d.m.Y";
	var today= timestamp ? new Date(timestamp) : new Date();
	var params=pattern.trim().split(/\W+/);
	var set={
		"d":"%02d".format([today.getDate()]),
		"m":"%02d".format([today.getMonth()+1]),
		"M":M[today.getMonth()],
		"F":F[today.getMonth()],
		"Y":"%04d".format([today.getFullYear()]),
		"H":"%02d".format([today.getHours()]),
		"i":"%02d".format([today.getMinutes()]),
		"s":"%02d".format([today.getSeconds()]),
		"D":today.getDay(),
		"U":((today.getTime()/1000)^0)
	}
	for(var i=0; i<params.length; i++){
		pattern=pattern.replace(params[i], set[params[i]]);
	}
	return pattern;
}

/* Other *************************************************************************************************************/

var Interval = function(callback, iterations, delay){
	if(!iterations) return false;
	var interval = this;
	this.delay = delay;
	this.iterations = iterations;
	this.shot = function(){
		interval.timer = setTimeout(function(){
			callback();
			if(--interval.iterations) interval.shot();
		}, delay);
	}
	this.clear = function(){
		clearTimeout(interval.timer);
	}
	this.shot();
}

/*********************************************************************************************************/

var datepicker=function(event, bg){
	bg = bg || blue;
	var obj=event.target;
	var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
	if(obj.value){
		var current=obj.value.split(/\D+/);
		d = new Date(Date.parse(current[1]+"/"+current[0]+"/"+current[2]));
	}else d = new Date();
	d.setDate(1);
	refreshPicker=function(){
		var thYear=d.getFullYear(), thMonth=d.getMonth(), thDay=d.getDay();
		var daysInThMonth = Math.round((+new Date(thYear+(thMonth==11), (thMonth+1)%12, 1) - new Date(thYear, thMonth, 1))/ 86400000);
		
		calendar=document.create("div", {}, 
			"<div class='pickerbar'>"+
				"<label onclick='setMonth(-1)' title='Previous month'>&#xe020;</label> "+
				"<label onclick='setYear(-1)' title='Previous year'>&#xe045;</label> "+
				"<label>"+months[thMonth]+" "+thYear+"</label> "+
				"<label onclick='setYear(1)' title='Next year'>&#xe044;</label> "+
				"<label onclick='setMonth(1)' title='Next month'>&#xe01f;</label>"+
			"</div>"+
			"<span style='color:#F66;'>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>");

		for(var i=1-thDay; i<=daysInThMonth; i++){
			if(i>0){
				calendar.appendChild(document.create("span", {"class":"dateCell","onclick":"setDate(this)"}, i.toString()));
			}else calendar.appendChild(document.create("span", {}));
		}
		return calendar;
	}
	var offset = obj.getBoundingClientRect();
	picker=document.create("div", {"class":"datepicker "+bg,"style":"top:"+(offset.top - obj.fullScrollTop())+"px;left:"+offset.left+"px"}, refreshPicker());
	setDate=function(cell){
		d.setDate(cell.textContent);
		obj.value=date("d.m.Y", d.getTime());
		document.body.removeChild(picker);
	}
	setYear=function(dir){
		d.setFullYear(d.getFullYear()+dir);
		picker.removeChild(calendar);
		picker.appendChild(refreshPicker());
	}
	setMonth=function(dir){
		d.setMonth(d.getMonth()+dir);
		picker.removeChild(calendar);
		picker.appendChild(refreshPicker());
	}
	document.body.appendChild(picker);
	
	if(document.body.clientHeight < (picker.offsetTop + picker.offsetHeight)){
		picker.style.top = (document.body.clientHeight-picker.offsetHeight)+"px";
	}
	if(document.body.clientWidth < (picker.offsetLeft + picker.offsetWidth)){
		picker.style.left = (document.body.clientWidth-picker.offsetWidth)+"px";
	}
	
	picker.onmouseout=function(){ obj.onblur=function(){ document.body.removeChild(picker); }}
	picker.onmouseover=function(){ obj.onblur=null; }
}