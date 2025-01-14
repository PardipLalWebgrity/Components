import Component from '../component.js';
import html from './html.js';



class WBTR_Color_Picker extends Component{

	constructor(){
		super();
		this.html = html;
		this.moduleURL = import.meta.url;
	}

	connectedCallback(){
		this.attachShadow({mode: 'open'});
		this.defaultSetup();
		this.init();
		console.log(WBTR);
	}

	defaultUI(){
		this.cpickerBoxCanvasUI('rgb(255, 0, 0)');
		this.cpickerGradientCanvas();
	}

	cpickerBoxCanvasUI(color){

		const canvasEl = this.$id.cpickerBoxCanvas;
		this.clearCanvas(canvasEl);
		const ctx = canvasEl.getContext('2d');

		// set solid color
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

		// set 1st overlay
		const gradient1 = ctx.createLinearGradient(0, 0, canvasEl.width, 0); 
		gradient1.addColorStop(0, "#fff"); 
		gradient1.addColorStop(1, "rgba(255, 255, 255, 0)");
		ctx.fillStyle = gradient1;
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

		// 2nd overlay
		const gradient2 = ctx.createLinearGradient(0, 0, 0, canvasEl.height);
		gradient2.addColorStop(0, "transparent");
		gradient2.addColorStop(1, "#000");
		ctx.fillStyle = gradient2;
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
	}

	cpickerGradientCanvas(){
		const canvasEl = this.$id.cpickerGradientCanvas;
		const ctx = canvasEl.getContext('2d');
		const gradient = ctx.createLinearGradient(0, 0, canvasEl.width, 0);

		gradient.addColorStop(0, "red");
		gradient.addColorStop(0.17, "#ff0");
		gradient.addColorStop(0.33, "lime");
		gradient.addColorStop(0.5, "cyan");
		gradient.addColorStop(0.66, "blue");
		gradient.addColorStop(0.83, "#f0f");
		gradient.addColorStop(1, "red");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
	}

	getColorFromCanvasPixel(canvasEl, xPos, yPos){
		const ctx = canvasEl.getContext("2d");
		const pixel = ctx.getImageData(xPos, yPos, 1, 1);
		const rgba = pixel.data;
		return rgba;
	}

	clearCanvas(canvasEl){
		const ctx = canvasEl.getContext("2d");
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	}

	event(){
		this.$id.cpicker.addEventListener('input',(e)=>{
			this.handleInput(e);
		})
		this.$id.cpicker.addEventListener('pointerdown',(e)=>{
			this.handlePointerDown(e);
		})
		this.$id.cpicker.addEventListener('pointermove',(e)=>{
			this.handlePointerMove(e);
		})
		this.$id.cpicker.addEventListener('pointerup',(e)=>{
			this.handlePointerUp(e);
		})

	}

	handleInput(e){

		// Gradient Input
		if(e.target.dataset.id == 'cpicker-gradient-input') {
			const valu = e.target.value;
			const xPos = Math.floor(((valu*100)*this.$id.cpickerGradient.offsetWidth)/100);
			let color = this.getColorFromCanvasPixel(this.$id.cpickerGradientCanvas, xPos, 10);
			
			if(valu == 0 || valu == 1) color = [255, 0, 0, 255];
			this.cpickerBoxCanvasUI(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
		}

	}

	handlePointerDown(e){
		if(e.target.dataset.id == 'cpicker-box-canvas') {
			this.$id.cpickerBoxCanvas.setPointerCapture(e.pointerId);
			const valu = e.target.value;
			const xPos = e.clientX-this.$id.cpickerBoxCanvas.getBoundingClientRect().left;
			const yPos = e.clientY-this.$id.cpickerBoxCanvas.getBoundingClientRect().top;
			let color = this.getColorFromCanvasPixel(this.$id.cpickerBoxCanvas, xPos, yPos);	
			document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${(color[2]/255).toFixed(2)})`; 
		}
	}

	handlePointerMove(e){
		if(e.target.dataset.id == 'cpicker-box-canvas') {
			const valu = e.target.value;
			const xPos = e.clientX-this.$id.cpickerBoxCanvas.getBoundingClientRect().left;
			const yPos = e.clientY-this.$id.cpickerBoxCanvas.getBoundingClientRect().top;
			let color = this.getColorFromCanvasPixel(this.$id.cpickerBoxCanvas, xPos, yPos);	
			document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${(color[2]/255).toFixed(2)})`; 
		}
	}

	handlePointerUp(e){
		if(e.target.dataset.id == 'cpicker-box-canvas') {
			this.$id.cpickerBoxCanvas.setPointerCapture(e.pointerId);
			const valu = e.target.value;
			const xPos = e.clientX-this.$id.cpickerBoxCanvas.getBoundingClientRect().left;
			const yPos = e.clientY-this.$id.cpickerBoxCanvas.getBoundingClientRect().top;
			let color = this.getColorFromCanvasPixel(this.$id.cpickerBoxCanvas, xPos, yPos);	
			document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${(color[2]/255).toFixed(2)})`; 
		}
	}

	init(){
		this.defaultUI();
		this.event();
	}
}

if(!customElements.get('wbtr-color-picker')){
	customElements.define('wbtr-color-picker',WBTR_Color_Picker);	
}
