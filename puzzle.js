$(document).ready(function () {

	//creating a namespace for slider app
	$.slider = {};
	$.slider.moves = 0;
	
	//background positions
	$.slider.positions = ['0 0', '0 343px', '0 229px', '0 115px', '115px 0', '115px 229px', '115px 343px', '343px 343px', '229px 0', '229px 229px', '229px 343px', '229px 115px', '343px 0', '343px 229px', '343px 115px'];
	
	$.slider.arrayShuffle= function (a) {
		for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
		return a;
	};
	
	$.slider.shuffle = function (e) {
		e.preventDefault();
		var positions = $.slider.arrayShuffle($.slider.positions);
		$('.tile').each( function(i) {
				$(this).css('backgroundPosition', positions[i]);
		});
		
		//reset moves
		$.slider.moves = 0;
		$('.moves').html(0);
		return false;
	}
	
	$.slider.getRowCol= function (val) { 
            return Math.floor(val/114);
    }
    
	$.slider.handleTiles = function (e) {
		e.preventDefault();
    	//caching the empty div from dom
		var empty = $('.empty'),
		 	movesnode = $('.moves');
		
    	var tileTop, tileLeft, emptyTop, emptyLeft, 
    		tileRow, tileCol, emptyRow, emptyCol,
    		proxRow, proxCol, elem = $(this);
    	
    	tileTop = parseInt(elem.css('top'));
    	tileLeft = parseInt(elem.css('left'));
    	emptyTop = parseInt(empty.css('top'));
    	emptyLeft = parseInt(empty.css('left'));
    	
    	tileRow = $.slider.getRowCol(tileTop) ;
    	tileCol = $.slider.getRowCol(tileLeft);
    	emptyRow = $.slider.getRowCol(emptyTop);
    	emptyCol = $.slider.getRowCol(emptyLeft);    	
    	
    	if(tileRow == emptyRow){
    		//check proximity of column
    		proxCol = tileCol - emptyCol;
    		if (proxCol === 1 || proxCol === -1) {
            	empty.animate({ left: tileLeft }, 250);
            	elem.animate({ left: emptyLeft }, 250); 
            	//update moves
            	var moves = ++$.slider.moves;
            	movesnode.html(moves); 
            }
    	} else if(tileCol == emptyCol) {
    		//check proximity of row
    		proxRow = tileRow - emptyRow;
    		if (proxRow == 1 || proxRow == -1) {
            	empty.animate({ top: tileTop }, 250);
                elem.animate({ top: emptyTop }, 250); 
                var moves = ++$.slider.moves;
            	movesnode.html(moves); 
             }
    	}
    	return false;
	};
	
	//throttling the clicks on tiles to avoid overlapping of tiles.
	$.slider.throttleClicks = function (func, delay){
	  var timer = null;  
	  return function(){    
	  	 var that = this, 
	  		 args = arguments;   
	  	 clearTimeout(timer);   
	  	 timer = setTimeout(function(){      
	  	  			func.apply(that, args);   
	  	  		 }, delay);
	  	  }
	  };
	
	//using event delegation to attach one event to main
	//instead of attaching 15 events to all the tiles.
	$('#main').delegate('.tile', 'click', $.slider.throttleClicks($.slider.handleTiles, 250)).delegate('#submit', 'click', $.slider.shuffle);

});