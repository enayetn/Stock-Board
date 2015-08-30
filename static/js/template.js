// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/template','autocomplete', 'datatables', 'gridster','utils','gridsterExtras','draggable'], 
	function ( Ractive, html, autocomplete, datatables, gridster, utils, gridsterExtras, draggable) {


	var currentCardNum = 0;

    var stockRactive = new Ractive({
      el: 'ractiveDiv',
      template: html,
      data: {
      	"response":[],
      	"showLoading":false,
      	"numCards":0,
      	"responseCard": [
      						{"showSearch":false}
      					]
      }
    });

    $(document).ready(function(){
		$('#addButton0').click( function() {
			initializeCard();
		});
		$('body').keyup(function(e){
			if(e.keyCode == 32){
				initializeCard();
			}
		});

		$('#initialLoad').fadeOut();
	});

	function initializeCard() {
		ractiveSetCard("showSearch","true");
		ractiveSetCard("styles","card animated slideInUp")
		initializeSearchBar("#symbol"+currentCardNum);
	}

	function ractiveSetCard(property, value) {
		stockRactive.set("responseCard["+currentCardNum+"]."+property,value);
	}

	function showLoading(answer) {
		stockRactive.set("showLoading",answer);
	}

	function initializeSearchBar(element) {
		$(element).autocomplete({
			deferRequestBy: 400,
		    lookup: function (query, done) {
		        // Do ajax call or lookup locally, when done,
		        // call the callback and pass your results:
				var resultObj = {};
				showLoading(true);
				resultObj.suggestions = [];
		  		$.ajax({
				  type: "GET",
				  url: "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input="+query,
				  contentType : 'application/json',
				  dataType: "jsonp",
				  success: function(json) {
				  	for (companies in json) {
						var dupe = false;
						var tmpObj = {};
						tmpObj.value=json[companies].Name;
						tmpObj.data=json[companies].Symbol;
						for (objs in resultObj.suggestions) {
							if (resultObj.suggestions[objs].data==tmpObj.data) {
								dupe = true;
							}
						}
				  		if (!dupe) {
				  			resultObj.suggestions.push(tmpObj);
				  		}
				  	}
		        	done(resultObj);
		        	showLoading(false);	
				  },
				  error: function(json){
				  	console.log("ERROR: "+json);
		        	done( {"suggestions":[{"value":"ERROR: See console for debug info","data":"ERROR"}]} );
				  }
				});

		    },
		    onSelect: function (suggestion) {
		    	findQuote(suggestion.data);
		    }
		});
	}

    function findQuote(symbol) {
		showLoading(true);
    	$.ajax({
			type: "GET",
			url: "http://dev.markitondemand.com/Api/v2/Quote/jsonp",
			contentType : 'application/json',
			dataType: "jsonp",
			data: {"symbol":symbol},
			success: function(json) {
				//stockRactive.set("response", json);
				processQuote(json);
				showLoading(false);
			},
		  	error: function(json){
		  		//stockRactive.set("response",JSON.stringify(json));
				response.push(json);
			}
		});
	}

	function processQuote(data) {
		var dataObj = {};
		dataObj.raw = data;
		var updatedDate = new Date(data.Timestamp);
		dataObj.raw.Timestamp = updatedDate;
		dataObj.name = data.Name;
		dataObj.dir = "black-text";
		dataObj.dirVal = "--";
		dataObj.dirIcon = "trending_flat";
		if (data.Change>0) {
			dataObj.dir = "green-text";
			dataObj.dirVal = "+"+data.Change.toFixed(4);
			dataObj.dirIcon = "trending_up";
		} else if (data.Change<0) {
			dataObj.dir = "red-text";
			dataObj.dirVal = "-"+data.Change.toFixed(4);
			dataObj.dirIcon = "trending_down";
		}
		pushDataObj(dataObj);
		//buildGrid(data);
		//console.log(data);
		//$('#stockTable').DataTable();
		/*var dataObj = {};
		dataObj.raw = data;
		for (items in data) {
			dataObj.name = {}
		}*/
	}

	function pushDataObj(data) {
		var currentCard = stockRactive.get("responseCard["+currentCardNum+"]");
		stockRactive.set("responseCard["+currentCardNum+"].showSearch",false);
		stockRactive.set("responseCard["+currentCardNum+"].styles","card z-depth-1");
		stockRactive.set("responseCard["+currentCardNum+"].data",data);
		var newCardObj = {"showSearch":false};
		stockRactive.get("responseCard").push(newCardObj);
		stockRactive.set("numCards",currentCardNum+1);
		currentCardNum++;

		$('#addButton'+currentCardNum).click( function() {
			ractiveSetCard("showSearch","true");
			ractiveSetCard("showAdd","false");
			initializeSearchBar("#symbol"+currentCardNum);
		});
	}

	function buildGrid(data) {
	    var gridster;

	    $(function(){

	      gridster = $(".gridster").gridster({
	          widget_margins: [5, 5],
	          widget_base_dimensions: [100, 55]
	      }).data('gridster');

	      var widgets = [
	          ['<div class="card">WHEE</div>', 1, 2],
	          ['<div class="card">WHEE</div>', 3, 2],
	          ['<div class="card">WHEE</div>', 3, 2]
	      ];

	      $.each(widgets, function(i, widget){
	          gridster.add_widget.apply(gridster, widget)
	      });

	    });
	}


    return stockRactive;

});
