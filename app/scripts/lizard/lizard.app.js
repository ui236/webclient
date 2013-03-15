// Initialization code needed to run before eerything
$.ajaxSetup({
	xhrFields: {
		withCredentials: true
	}
});

Backbone.Collection.prototype.move = function(model, toIndex) {
  var fromIndex = this.indexOf(model);
  if (fromIndex === -1) {
    throw new Error("Can't move a model that's not in the collection");
  }
  if (fromIndex !== toIndex) {
    this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0]);
    this.trigger('sort', this);
  }
};

Proj4js.defs["EPSG:28992"]= "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_def";
// Define Lizard namespace
Lizard = {};
Lizard.Layers = {};
Lizard.Layers.Custom = {};
Lizard.Popups = {};
Lizard.Map = {};

// Instantiate the Application()
Lizard.App = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.App.addRegions({
  content: '#content',
});


Lizard.App.on('initialize:before', function() {

  account = new Lizard.Models.Account();
  account.fetch();

  workspaceCollection = new Lizard.Collections.Workspace();
  workspaceCollection.fetch();

  collageCollection = new Lizard.Collections.Collage();
  collageCollection.fetch();

  currentStatus = new Lizard.Models.CurrentState();
});

// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  var loginView = new Lizard.Views.Menu({
    model: account
  });
  loginView.render();

  Backbone.history.start();
});
