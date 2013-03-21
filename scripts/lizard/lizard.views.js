/**
ItemViews
*/

Lizard.Views = {};



Lizard.Views.Layer = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#layeritem-template',
  initialize: function() {
    this.model.bind('change', this.render);
  },
  events: {
    'click .icon-circle-arrow-up': 'moveUp',
    'click .icon-circle-arrow-down': 'moveDown',
    'click .indicator': 'toggleVisibility'
  },
  moveUp: function(event) {
    console.log('moveUp!', this.model.get('display_name'));
  },
  moveDown: function(event) {
    console.log('moveDown!', this.model.get('display_name'));
  },
  toggleVisibility: function(event) {
    console.log('Toggle!', this.model.get('display_name'));
  },
  onBeforeRender: function(model) {
    // console.log('onBeforeRender', model);
  }
});



Lizard.Views.InfoModal = Backbone.Marionette.ItemView.extend({
  template: '#info-modal-template',
  initialize: function() {
    console.log('Lizard.Views.Info initializing');
  }
});

Lizard.Views.ItemView = Backbone.Marionette.ItemView.extend({
  _modelBinder: undefined,
  initialize: function(){
    this._modelBinder = new Backbone.ModelBinder();
    this.model.on('reset', this.render, this);
  },
  onRender: function() {
    var bindings = {state: 'span.state'};
    this._modelBinder.bind(this.model, this.el, bindings);
  },
  tagName: 'li'
});




/**
CollectionViews
*/

Lizard.Views.CollectionView = Backbone.Marionette.CollectionView.extend({
  tagName: 'ul',
  initialize: function(){
   this.collection.fetch({
      cache: false
    });
    this.listenTo(this.collection, 'reset', this.render, this);
  }
});

/*
Lizard.Views.FilterCollection = Lizard.Views.CollectionView.extend({
  collection: filterCollection,
  itemView: Lizard.Views.Filter,
});

Lizard.Views.LocationCollection = Backbone.Marionette.CollectionView.extend({
  collection: locationCollection,
  itemView: Lizard.Views.Location,
});

Lizard.Views.ParameterCollection = Backbone.Marionette.CollectionView.extend({
  collection: parameterCollection,
  itemView: Lizard.Views.Parameter,
});
*/


/* MENU VIEWS */

Lizard.Views.Menu = Backbone.Marionette.ItemView.extend({
	model: null,
	el: '#loginRegion',
	template: '#loggedin-template',
	events: {
		'click #login': 'doLogin',
		'click #logout': 'doLogout'
	},

	initialize: function(){
    this.model.on('change', this.render);
    console.log('initialize LoginView');
	},

	doLogin: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.login_token_url;
		$.getJSON(url, function(json) {
			window.location=json.login_url;
		});
	},

	doLogout: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.logout_token_url;
		$.getJSON(url, function(json) {
			window.location=json.logout_url;
		});
	}

});