// Create default layout, including regions
Lizard.Map.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#map-template',
  regions: {
    'sidebarRegion': '#sidebarRegion',
    'leafletRegion': '#leafletRegion',
    'modalitems' : '#location-modal-collapsables',
    'workspaceListRegion': '#workspaceListRegion',
    'workspaceRegion': '#workspaceRegion',
    'annotationsRegion' : '#annotationsRegion',
    'geocoderRegion' : '#geocoderRegion',
    'extraLayerRegion' : '#extramaplayers'
  }
});

// Create router
Lizard.Map.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'map': 'map',
      'map/:lonlatzoom': 'map', // lonlatzoom is a commaseparated longitude/latitude/zoomlevel combination
      'map/:lonlatzoom/:workspacekey': 'map' // workspace is a primary key that refers to a specific workspace
    }
});


Lizard.Map.NoItemsView = Backbone.Marionette.ItemView.extend({
  template: '#show-no-items-message-template'
});


Lizard.Map.IconItemView = Backbone.Marionette.ItemView.extend({
  template: '#icon-template',
  tagName: 'li'
});

// Create collection for this page
layerCollection = new Lizard.Collections.Layer();
window.mapCanvas = ((window.mapCanvas === undefined) ? null : window.mapCanvas);

// Instantiate the Leaflet Marionnette View.
// This way you can talk with Leaflet after initializing the map.
// To talk with the Leaflet instance talk to -->
// Lizard.Map.Leaflet.mapCanvas

Lizard.Map.map = function(lonlatzoom, workspacekey){
  console.log('Lizard.Map.map()');

  if (!lonlatzoom || lonlatzoom.split(',').length < 2) {
    if (account.get('initialZoom').split(',').length === 3){
      lonlatzoom = account.get('initialZoom');
    } else{
      lonlatzoom = '5.16082763671875,51.95442214470791,7';
    }
  }

  // Instantiate Map's default layout
  Lizard.mapView = new Lizard.Map.DefaultLayout();

  // And add it to the #content div
  Lizard.App.content.show(Lizard.mapView);

  Lizard.workspaceView = new Lizard.Views.ActiveWorkspace();
  extraLayersView = new Lizard.Views.LayerList({
    collection: layerCollection,
    workspace: Lizard.workspaceView.getCollection()
  });

  var workspaceListView = new Lizard.Views.WorkspaceCollection({
    collection: workspaceCollection,
    workspaceView: Lizard.workspaceView
  });

  var leafletView = new Lizard.Views.Map({
    lon: lonlatzoom.split(',')[0],
    lat: lonlatzoom.split(',')[1],
    zoom: lonlatzoom.split(',')[2],
    workspace: Lizard.workspaceView.getCollection()
  });


  if (workspacekey){
    var selectWorkspace = function(collection) {
      workspace = collection.get(workspacekey);
      collection.each(function(worksp) {
        worksp.set('selected', false);
      });
      workspace.set('selected', true);
      workspace.trigger('select_workspace', workspace);
    };
    if (workspaceCollection.models.length > 0) {
      selectWorkspace(workspaceCollection);
    } else {
      workspaceCollection.once('sync', selectWorkspace);
    }
  }

  Lizard.mapView.leafletRegion.show(leafletView.render());

  Lizard.mapView.workspaceListRegion.show(workspaceListView.render());
  Lizard.mapView.workspaceRegion.show(Lizard.workspaceView.render());
  Lizard.mapView.extraLayerRegion.show(extraLayersView.render());

  var annotationsModelInstance = new Lizard.Models.Annotations();
  var annotationsView = new Lizard.Views.AnnotationsView({
    model: annotationsModelInstance,
    mapView: leafletView
  });
  Lizard.mapView.annotationsRegion.show(annotationsView.render());


  // Lizard.mapView.geocoderRegion.show(new Lizard.Views.GeocoderView());

  // Correct place for this?
  Lizard.Map.ddsc_layers = new Lizard.geo.Layers.DdscMarkerLayer({
    collection: locationCollection,
    map: leafletView
  });

  $('.sensor-layer-toggler').click(function(e) {
    var $icon = $(this).find('i');
    if ($icon.hasClass('icon-check-empty')) {
      $icon.addClass('icon-check').removeClass('icon-check-empty');
      Lizard.Map.ddsc_layers.addToMap();
    }
    else {
      $icon.addClass('icon-check-empty').removeClass('icon-check');
      Lizard.Map.ddsc_layers.removeFromMap();
    }
  });

  var alarmWMS = leafletView.getAlarms();
  var alarms = new Lizard.Models.WorkspaceItem(alarmWMS.toJSON());
  alarms.set({visibility: true});
  var activeWorkspace = Lizard.workspaceView.getCollection();

  $('.alarm-layer-toggler').click(function(e) {
        var $icon = $(this).find('i');
        if ($icon.hasClass('icon-check-empty')) {
            $icon.addClass('icon-check').removeClass('icon-check-empty');
            // Lizard.Models.WorkspaceItem;
            activeWorkspace.add(alarms);
        }
        else {
            $icon.addClass('icon-check-empty').removeClass('icon-check');
            activeWorkspace.remove(alarms);
        }
    });

  var alarmWMS = leafletView.getAlarms();
  var alarms = new Lizard.Models.WorkspaceItem(alarmWMS.toJSON());
  alarms.set({visibility: true, selected: false});
  var activeWorkspace = Lizard.workspaceView.getCollection();

  $('.status-layer-toggler').click(function(e) {
        var $icon = $(this).find('i');
        if ($icon.hasClass('icon-check-empty')) {
            $icon.addClass('icon-check').removeClass('icon-check-empty');
            // Lizard.Models.WorkspaceItem
            activeWorkspace.add(alarms);
        }
        else {
            $icon.addClass('icon-check-empty').removeClass('icon-check');
            activeWorkspace.remove(alarms);
        }
    });

  // Then tell backbone to set the navigation to #map
  if(lonlatzoom && workspacekey){
    Backbone.history.navigate('map/' + lonlatzoom + '/' + workspacekey);
  } else if (lonlatzoom) {
    Backbone.history.navigate('map/' + lonlatzoom);
  } else {
    Backbone.history.navigate('map');
  }

  Lizard.App.vent.on('mapPan', function(lonlatzoom){
      urlfragment = Backbone.history.fragment.split('/');
      if (urlfragment.length === 3){
        Backbone.history.navigate('map/' + lonlatzoom + '/' + urlfragment[2]);
      } else if (lonlatzoom) {
      Backbone.history.navigate('map/' + lonlatzoom);
      } else {
        Backbone.history.navigate('map');
      }
    });

    tour = new Tour({
      labels: {
          next: "Verder »",
          prev: "« Terug",
          end: "Einde uitleg"
      },
      useLocalStorage: false,
      backdrop: true
    });
    tour.addStep({
        element: "#leafletRegion",
        title: "Kaart",
        placement: "left",
        content: "Hier ziet u de kaart. Hier ziet u de locaties van de sensoren. Voor meer informatie kunt u hier op klikken."
    });
    tour.addStep({
        element: "#workspaceListRegion",
        title: "Kaartlagen",
        placement: "right",
        content: "Hier ziet u de beschikbare kaartlagen"
    });
    tour.addStep({
        element: "#ddsc_temp",
        title: "Statuslagen",
        placement: "right",
        content: "Hier ziet u de statuslagen die iets vertellen over de alarmen/storingen"
    });
    tour.addStep({
        element: ".annotation-layer-toggler",
        title: "Annotaties",
        placement: "right",
        content: "Hier ziet u commentaar op locaties of tijdreeksen"
    });
};

Lizard.App.addInitializer(function(){
  Lizard.Map.router = new Lizard.Map.Router({
    controller: Lizard.Map
  });
});
