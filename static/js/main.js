// First we have to configure RequireJS
require.config({
    // This tells RequireJS where to find Ractive and rvc
    paths: {
        ractive: 'lib/ractive',
        rv: 'loaders/rv',
        mapbox: 'lib/mapbox',
        jquery: 'lib/jquery-1.11',
        jqueryui: 'lib/jquery_ui',
        autocomplete: 'lib/jquery.autocomplete', 
        datatables: 'lib/jquery.dataTables.min', 
        gridster: 'lib/jquery.gridster',
        utils: 'lib/utils',
        gridsterExtras: 'lib/jquery.gridster.extras',
        draggable: 'lib/jquery.draggable',
        materialize: 'lib/materialize.min', 
        hammer: 'hammerjs'
    }
});


require(["template"]);