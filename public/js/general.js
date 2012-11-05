document.observe("dom:loaded", function() {
	var page = YYMG.page || 0;
	if(page == 4) {
		alert(1);
	}	
});