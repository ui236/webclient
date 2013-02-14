/**
Models
*/


Lizard.Models = {};

Lizard.Models.Filter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});

Lizard.Models.Location = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url; 
  },
  defaults: {
    'selected':  false
  },
});

Lizard.Models.Parameter = Backbone.Model.extend({
  defaults: {
    'selected':  false
  }
});

Lizard.Models.Timeserie = Backbone.Model.extend({
  initialize: function(response) {
    this.url = response.url;
    // this.fetch({async: false, cache: true});
  },
  defaults: {
    'selected':  false
  },
});

Lizard.Models.Widget = Backbone.Model.extend({});

// Lizard.Models.Collage = Backbone.Model.extend({
//   initialize: function() {
//     this.url = response.url;
//     this.fetch({cache: true});
//   }
// });
// ^^^^ This was present before Bastiaan/Roland added the one below.

Lizard.Models.Collage = Backbone.Model.extend({
  defaults: {
    data: '',
    id: null
  },
  url: function() {
    var origUrl = Backbone.Model.prototype.url.call(this);
    return origUrl += _.last(origUrl) === '/' ? '' : '/';
  }
});

Lizard.Models.Layer = Backbone.Model.extend({
  defaults: {
        layer_name: '',
        display_name: '',
        description: null,
        metadata: null,
        legend_url: null,
        enable_search: null,
        styles: null,
        format: null,
        height: null,
        width: null,
        tiled: null,
        transparent: null,
        wms_url: '',
        opacity: null,
        type: null
  }
});


Lizard.Models.WorkspaceItem = Backbone.Model.extend();