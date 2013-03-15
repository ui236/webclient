Lizard.Views.FavoriteView = Backbone.Marionette.ItemView.extend({
  template:function(model){
    return _.template($('#favorite-item-template').html(), {
      name: model.data.name,
      uuid: "fav" + model.data.timeserie
    }, {variable: 'favorite'});
  },
  onRender: function(){
    if (!window.mapCanvas){
      this.$el.find('.goto').toggle('hidden');
    }
  },
  tagName: 'li',
  events:{
    "click .goto": 'goTo',
    "click .favstar" : 'removeFav'
  },
  removeFav: function(){
    this.model.destroy({wait:true});
  },
  goTo: function(e){
    if (window.mapCanvas){
      var location = locationCollection.get(this.model.attributes.location);
      var point = location.attributes.point_geometry;
      window.mapCanvas.panTo(new L.LatLng(point[1], point[0]));
    }
  }
});

Lizard.Views.FavoriteCollection = Lizard.Views.CollectionView.extend({
  collection: favoriteCollection,
  itemView: Lizard.Views.FavoriteView,
  initialize: function() {
    //this.collection.fetch();
  }
});