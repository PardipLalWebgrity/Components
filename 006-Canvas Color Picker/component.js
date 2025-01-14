
// protect Global WBTR variable
if(window.WBTR){
	document.body.innerHTML = '<h1>WBTR is reserve keyword, please use different identifier</h1>';
	throw new Error('WBTR is reserve keyword, please use different identifier');
} else {
	window.WBTR = {
		bodyHeight: document.body.offsetHeight,
    bodyWidth: document.body.offsetWidth,
	};
}


class Component extends HTMLElement{

	defaultSetup(customize){		
		this.setComponentHTMLCSS();
		this.storeElements();		
		if(customize){
			customize.id && (WBTR[customize.id] = this);
		} else {
			const tagName = WBTR_Help.underScoreToUpperCase(this.tagName.replace('WBTR-','').toLowerCase());
			WBTR[tagName] = this;
			this.setAttribute('data-custom-element', tagName);
		}		
	}

	setComponentHTMLCSS(){
		this.shadowRoot.innerHTML = `
			<style>
				.scroll-design{overflow: auto;scrollbar-color: #0d99ff transparent;scrollbar-width: thin;}
				.scroll-design::-webkit-scrollbar{width: 8px;height: 30px;}
				.scroll-design::-webkit-scrollbar-track-piece{background-color: #fff;}
				.scroll-design::-webkit-scrollbar-thumb:vertical{height: 30px;background-color: #5a3696;}
				:host *{padding: 0;margin: 0;box-sizing: border-box;transition: 0.3s all linear;font-family:inherit;}
			</style>
			<link rel="stylesheet" href="${new URL('./style.css',this.moduleURL).href}">
			${this.html}
		`;		
	}

	storeElements(){
		this.$id = {};
		this.shadowRoot.querySelectorAll('[data-id]').forEach((el)=>{			
			this.$id[WBTR_Help.underScoreToUpperCase(el.dataset.id)] = el;
		})

		this.$class = {};
		this.shadowRoot.querySelectorAll('[data-class]').forEach((el)=>{			
			this.$class[WBTR_Help.underScoreToUpperCase(el.dataset.class)] = this.shadowRoot.querySelectorAll(`[data-class="${el.dataset.class}"]`);
		})
	}

}

export default Component;