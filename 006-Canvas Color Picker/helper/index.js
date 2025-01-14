class WBTR_Help {
	static underScoreToUpperCase(underScoreString){
		let word = '';
		underScoreString.split('-').forEach((w,i)=>{
			if(i===0) {
				word += w;
			} else {
				word += w.charAt(0).toUpperCase()+w.slice(1);
			}				
		})
		return word;
	}

	static firstCharacterUppercase(str){
		return str.charAt(0).toUpperCase()+str.slice(1);
	}
}