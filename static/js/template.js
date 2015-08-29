// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/template','jquery','autocomplete', 'datatables', 'gridster','utils','gridsterExtras','draggable'], 
	function ( Ractive, html,$,autocomplete,datatables, gridster, utils, gridsterExtras, draggable) {



    var stockRactive = new Ractive({
      el: 'ractiveDiv',
      template: html,
      data: {
      	"response":[],
      	"numCards":0,
      	"responseCard": [
      						{"showSearch":true}
      					]
      }
    });



	$(".symbol").autocomplete({
		deferRequestBy: 400,
	    lookup: function (query, done) {
	        // Do ajax call or lookup locally, when done,
	        // call the callback and pass your results:
			var resultObj = {};
			resultObj.suggestions = [];
	  		$.ajax({
			  type: "GET",
			  url: "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input="+query,
			  contentType : 'application/json',
			  dataType: "jsonp",
			  success: function(json) {
			  	for (companies in json) {
			  		var tmpObj = {};
			  		tmpObj.value=json[companies].Name;
			  		tmpObj.data=json[companies].Symbol;
			  		resultObj.suggestions.push(tmpObj);
			  	}
	        	done(resultObj);
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

    function findQuote(symbol) {
    	$.ajax({
			type: "GET",
			url: "http://dev.markitondemand.com/Api/v2/Quote/jsonp",
			contentType : 'application/json',
			dataType: "jsonp",
			data: {"symbol":symbol},
			success: function(json) {
				//stockRactive.set("response", json);
				processQuote(json);
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
		dataObj.name = data.Name;
		if (data.Change>0) {
			dataObj.dir = "upColor";
		} else if (data.Change<0) {
			dataObj.dir = "downColor";
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
		var currentCardNum = stockRactive.get("numCards");
		var currentCard = stockRactive.get("responseCard["+currentCardNum+"]");
		stockRactive.set("responseCard["+currentCardNum+"].showSearch",false);
		stockRactive.set("responseCard["+currentCardNum+"].data",data);
		var newCardObj = {"showSearch":true};
		stockRactive.get("responseCard").push(newCardObj);
		stockRactive.set("numCards",currentCardNum+1);
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
