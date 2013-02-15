/**
Collections
*/

Lizard.Collections = {};


/* MAP COLLECTIONS */
Lizard.Collections.Layer = Backbone.Collection.extend({
  parse: function(response){
    return response.results;
  },
  url: settings.layers_url,
  model: Lizard.Models.Layer
});




/* FILTER/LOCATION/PARAMETER COLLECTIONS */
Lizard.Collections.Filter = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Filter collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.filters_url,
  model: Lizard.Models.Filter
});

Lizard.Collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.locations_url,
  model: Lizard.Models.Location
});

Lizard.Collections.Parameter = Backbone.Collection.extend({
  initialize: function() {
    console.log('Parameter initializing');
  },
  parse: function(response){
    return response.results;
  },
  url: settings.parameters_url,
  model: Lizard.Models.Parameter
});


/* WIDGET COLLECTIONS */
Lizard.Collections.Widget = Backbone.Collection.extend({
  initialize: function() {
    console.log('Widget collection initializing');
  },
  parse: function(response){
    return response.results;
  },
  model: Lizard.Models.Widget
});


/* COLLAGE COLLECTIONS */
Lizard.Collections.Collage = Backbone.Collection.extend();


/* TIMESERIES COLLECTIONS */
Lizard.Collections.Timeseries = Backbone.Collection.extend({
  parse: function(response){
    return response.results;
  },
  url: settings.timeseries_url,
  model: Lizard.Models.Timeserie
});

Lizard.Collections.Workspace = Backbone.Collection.extend({
  model: Lizard.Models.WorkspaceItem,
  buildUrl: function(){
    // _.each(this, model, function(model){
      
    // });
  }
});

workspaceCollection = new Lizard.Collections.Workspace();
filterCollection = new Lizard.Collections.Filter();
locationCollection = new Lizard.Collections.Location();
parameterCollection = new Lizard.Collections.Parameter();
timeseriesCollection = new Lizard.Collections.Timeseries();