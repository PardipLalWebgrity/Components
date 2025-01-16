import Component from '../component.js';
import html from './html.js';



class WBTR_Color_Picker extends Component{

	pointerActive = false;
	currentColor = { hex: "#464787", r: 70, g: 71, b: 135, a: "0.48" };

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
		this.cpickerBoxCanvasUI('rgb(15, 0, 255)');
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
		gradient1.addColorStop(0, "rgba(255, 255, 255, 1)");
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
		this.$id.cpicker.addEventListener('change',(e)=>{
			this.handleChange(e);
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

			this.currentColor = this.getColorCodeFromCanvasPixelValue(color);
			this.currentColor.a = this.$id.cpickerTransparentInput.value;
			
			this.updateColorCodeInputsData();

		}

		// Transparent Input
		if(e.target.dataset.id == 'cpicker-transparent-input') {
			this.currentColor.a = e.target.value;
			console.log(this.currentColor.a);
			this.updateColorCodeInputsData();
		}

	}

	handleChange(e){

		// Transparent Input
		if(e.target.dataset.id == 'cpicker-code-type') {			
			this.shadowRoot.querySelector('.cpicker-code-input.show')?.classList.remove('show');
			this.shadowRoot.querySelector(`.cpicker-code-${this.$id.cpickerCodeType.value}`).classList.add('show');
		}

		// Hex Input
		if(e.target.dataset.id == 'cpicker-code-hex-input') {

			// calculation
			const colorData = {};
			colorData.hex = this.$id.cpickerCodeHexInput.value;
			colorData.rgb = this.hexToRGB(colorData.hex);
			colorData.hsv = this.RGBtoHSV(colorData.rgb);
			colorData.solidColor = this.RGBtoHex(this.HSVtoRGB(colorData.hsv.h, 1, 1));

			// input
			this.$id.cpickerCodeRgbaRinput.value = colorData.rgb.r;
			this.$id.cpickerCodeRgbaGinput.value = colorData.rgb.g;
			this.$id.cpickerCodeRgbaBinput.value = colorData.rgb.b;
			this.$id.cpickerCodeCssInput.value = `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}, 1)`;
			this.$id.cpickerGradientInput.value = ((colorData.hsv.h * 100)/100).toFixed(2);
			
			// UI
			this.cpickerBoxCanvasUI(colorData.solidColor);
			this.$id.cpickerTransparentOverlay.style.background = `linear-gradient(to right, rgba(0, 42, 255, 0) 0%, rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}) 100%)`;
			
			let x = colorData.hsv.s * 100;
      let y = (1 - colorData.hsv.v) * 100;
			let leftPos = (x/100 * this.$id.cpickerBoxCanvas.offsetWidth + this.$id.cpickerBoxThumb.offsetWidth/4);
      let topPos = (y/100 * this.$id.cpickerBoxCanvas.offsetHeight + this.$id.cpickerBoxThumb.offsetWidth/4);

			if(leftPos < 0) leftPos = 0;
			if(leftPos > 270) leftPos = 270;

			if(topPos < 0) topPos = 0;
			if(topPos > 270) topPos = 270;

			this.$id.cpickerBoxThumb.style.left = leftPos + 'px';
      this.$id.cpickerBoxThumb.style.top = topPos + 'px';
			
		}

	}

	handlePointerDown(e){
		if(e.target.dataset.id == 'cpicker-box-canvas') {
			this.pointerActive = true;
			this.$id.cpickerBoxCanvas.setPointerCapture(e.pointerId);
			this.currentColor = this.getColorCodeFromCanvasPixelValue(this.getXYPointerPositionColorOfBoxCanvas(e));
			this.currentColor.a = this.$id.cpickerTransparentInput.value;
			this.updateColorCodeInputsData();
		}
	}

	handlePointerMove(e){
		if(this.pointerActive && this.$id.cpickerBoxCanvas.hasPointerCapture(e.pointerId)) {
			this.currentColor = this.getColorCodeFromCanvasPixelValue(this.getXYPointerPositionColorOfBoxCanvas(e));
			this.currentColor.a = this.$id.cpickerTransparentInput.value;
			this.updateColorCodeInputsData();
		}
	}

	handlePointerUp(e){
			this.pointerActive = false;
			this.$id.cpickerBoxCanvas.releasePointerCapture(e.pointerId);			
	}

	getXYPointerPositionColorOfBoxCanvas(e){
		const boxCanvasRect = this.$id.cpickerBoxCanvas.getBoundingClientRect();

		let xPos = Math.floor(e.clientX-boxCanvasRect.left);
		let yPos = Math.floor(e.clientY-boxCanvasRect.top);
		
		if(e.clientX>boxCanvasRect.right) xPos = boxCanvasRect.width-1;
		if(e.clientX<boxCanvasRect.left) xPos = 0;

		if(e.clientY>boxCanvasRect.bottom) yPos = boxCanvasRect.height-1;
		if(e.clientY<boxCanvasRect.top) yPos = 0;
		
		let color = this.getColorFromCanvasPixel(this.$id.cpickerBoxCanvas, xPos, yPos);	
		this.$id.cpickerBoxThumb.style.left = xPos+'px';
		this.$id.cpickerBoxThumb.style.top = yPos+'px';
		return color;
	}

	updateColorCodeInputsData(){
		this.$id.cpickerCodeCssInput.value = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b}, ${this.currentColor.a})`;
		this.$id.cpickerCodeHexInput.value = this.currentColor.hex;
		this.$id.cpickerCodeRgbaRinput.value = this.currentColor.r;
		this.$id.cpickerCodeRgbaGinput.value = this.currentColor.g;
		this.$id.cpickerCodeRgbaBinput.value = this.currentColor.b;
		this.$id.cpickerCodeRgbaAinput.value = this.currentColor.a;
	}

	// Color
	getColorCodeFromCanvasPixelValue(rgba) { // Parameter Format : [255,255,255,255];
			const [r, g, b, a] = rgba;
			const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
			let alpha = (a / 255).toFixed(2);
			return {
					hex,					
					r,
					g,
					b,
					a: alpha,
			};
	}
		
	HSVtoRGB(H, S, V) {
			let R,G,B, var_h, var_i, var_1, var_2, var_3, var_r, var_g, var_b;
			if ( S === 0 ) {
					R = V * 255;
					G = V * 255;
					B = V * 255;
			} else {
					var_h = H * 6;
					if ( var_h === 6 ) { var_h = 0; }      //H must be < 1
					var_i = parseInt( var_h );            //Or ... var_i = floor( var_h )
					var_1 = V * ( 1 - S );
					var_2 = V * ( 1 - S * ( var_h - var_i ) );
					var_3 = V * ( 1 - S * ( 1 - ( var_h - var_i ) ) );

					if      ( var_i === 0 ) { var_r = V     ; var_g = var_3 ; var_b = var_1; }
					else if ( var_i === 1 ) { var_r = var_2 ; var_g = V     ; var_b = var_1; }
					else if ( var_i === 2 ) { var_r = var_1 ; var_g = V     ; var_b = var_3; }
					else if ( var_i === 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = V;     }
					else if ( var_i === 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = V;     }
					else                   { var_r = V     ; var_g = var_1 ; var_b = var_2; }

					R = parseInt(var_r * 255);
					G = parseInt(var_g * 255);
					B = parseInt(var_b * 255);
			}
			return { r: R, g: G, b: B };
	}

	RGBtoHSV(rgb) {
			//R, G and B input range = 0 ÷ 255
			//H, S and V output range = 0 ÷ 1.0

			const var_R = ( rgb.r / 255 );
			const var_G = ( rgb.g / 255 );
			const var_B = ( rgb.b / 255 );

			const var_Min = Math.min( var_R, var_G, var_B );   //Min. value of RGB
			const var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
			const del_Max = var_Max - var_Min;             //Delta RGB value

			let V = var_Max;
			let H, S;

			if ( del_Max === 0 )                     //This is a gray, no chroma...
			{
					H = 0;
					S = 0;
			}
			else                                    //Chromatic data...
			{
					S = del_Max / var_Max;

					const del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
					const del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
					const del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

					if      ( var_R === var_Max ) { H = del_B - del_G; }
					else if ( var_G === var_Max ) { H = ( 1 / 3 ) + del_R - del_B; }
					else if ( var_B === var_Max ) { H = ( 2 / 3 ) + del_G - del_R; }

					if ( H < 0 ) { H += 1; }
					if ( H > 1 ) { H -= 1; }
			}
			return { h: H, s: S, v: V };
	}

	RGBtoHex(r, g, b) {
			if (typeof r === 'object') {
					g = r.g;
					b = r.b;
					r = r.r;
			}
			return '#' + this.toHex(parseInt(r)) + this.toHex(parseInt(g)) + this.toHex(parseInt(b));
	}

	// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	hexToRGB(hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
			});

			let target;
			if (hex.charAt(0) === '#') {
					target = 7;
			} else if (hex.charAt(0) !== '#') {
					target = 6;
			}

			while(hex.length < target) {
					hex += '0';
			}

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
			} : null;
	}

	formatHex(val) {
			if (val.charAt(0) !== '#') {
					val = '#' + val;
			}
			while (val.length < 7) {
					val += '0';
			}
			return val;
	}

	toHex(val) {
			let hex = Number(val).toString(16);
			if (hex.length < 2) {
					hex = "0" + hex;
			}
			return hex;
	}

	init(){
		this.defaultUI();
		this.event();		
	}
}

if(!customElements.get('wbtr-color-picker')){
	customElements.define('wbtr-color-picker',WBTR_Color_Picker);	
}













