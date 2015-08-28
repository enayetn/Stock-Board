// Now we've configured RequireJS, we can load our dependencies and start
define([ 'ractive', 'rv!../ractive/template','jquery','autocomplete', 'datatables'], function ( Ractive, html,$,autocomplete,datatables) {



    var sampleRactive = new Ractive({
      el: 'ractiveDiv',
      template: html,
      data: {
      	"response":[]
      }
    });



	$("#symbol").autocomplete({
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
				//sampleRactive.set("response", json);
				processQuote(json);
			},
		  	error: function(json){
		  		//sampleRactive.set("response",JSON.stringify(json));
				response.push(json);
			}
		});
	}

	function processQuote(data) {
		//sampleRactive.get("response").push(data);
		//console.log(data);
		//$('#stockTable').DataTable();
	}

    return sampleRactive;

});
