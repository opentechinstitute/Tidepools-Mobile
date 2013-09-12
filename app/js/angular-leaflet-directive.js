var leafletDirective = angular.module("leaflet-directive", []);

leafletDirective.directive("leaflet", ["$http", "$log", function ($http, $log) {


// MAP FROM FOLDERS
//ENABLE TO LOAD LOCAL MAP
var defaults = {
    minZoom: 13,
    maxZoom: 22,
    tileLayer: '1.0.0/IS4CWN/{z}/{x}/{y}.png',
    tileLayerOptions: {
        tms: true,
        reuseTiles: true
    },
    icon: {
        url: 'img/marker-icon.png',
        size: [25, 41],
        anchor: [12, 40],
        popup: [0, -40],
    },
    path: {
        weight: 10,
        opacity: 1,
        color: '#0000ff'
    }
};

// end local load
    
    if (mapSelect == 'cloud'){

    //-------------ENABLE TO LOAD CLOUD MAP -----------//
    
        var defaults = {
            minZoom: 1,
            maxZoom: 23,
            //tileLayer: 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', //another tilelayer option
            tileLayer: 'http://{s}.tiles.mapbox.com/v3/openplans.map-dmar86ym/{z}/{x}/{y}.png',
            attribution: '&copy; OpenStreetMap contributors, CC-BY-SA. <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>',
            tileLayerOptions: {
                reuseTiles: true
            },
            icon: {
                url: 'img/marker-icon.png',
                size: [25, 41],
                anchor: [12, 40],
                popup: [0, -40],
                shadow: {
                    url: 'img/marker-shadow.png',
                    size: [41, 41],
                    anchor: [12, 40]
                }
            },
            path: {
                weight: 10,
                opacity: 1,
                color: '#0000ff'
            }
        };    

    //--------------------------------------------------//
    }

    if (mapSelect == 'amc2013'){
    //-------------ENABLE TO LOAD LOCAL MAP -----------//

        var defaults = {
            minZoom: 13,
            maxZoom: 17,
            tileLayer: '1.0.0/amc2013/{z}/{x}/{y}.png',
            
            tileLayerOptions: {
                tms: 'true',
                reuseTiles: true
            },
            icon: {
                url: 'img/marker-icon.png',
                size: [25, 41],
                anchor: [12, 40],
                popup: [0, -40],
                shadow: {
                    url: 'img/marker-shadow.png',
                    size: [41, 41],
                    anchor: [12, 40]
                }
            },
            path: {
                weight: 10,
                opacity: 1,
                color: '#0000ff'
            }
        };
    }

    //-----------------------------------------------//



    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            center: '=center',
            maxBounds: '=maxbounds',
            markers: '=markers',
            defaults: '=defaults',
            paths: '=paths',
           // tempMarker: '=tempMarker'
        },
        template: '<div class="angular-leaflet-map"></div>',
        link: function ($scope, element, attrs /*, ctrl */) {

            $scope.leaflet = {};
            $scope.leaflet.maxZoom = !!(attrs.defaults && $scope.defaults && $scope.defaults.maxZoom) ? parseInt($scope.defaults.maxZoom, 10) : defaults.maxZoom;

            var map = new L.Map(element[0], {
                maxZoom: $scope.leaflet.maxZoom});
            map.setView([0, 0], 1);

            $scope.leaflet.tileLayer = !!(attrs.defaults && $scope.defaults && $scope.defaults.tileLayer) ? $scope.defaults.tileLayer : defaults.tileLayer;
            $scope.leaflet.map = !!attrs.testing ? map : 'Add testing="testing" to <leaflet> tag to inspect this object';

            // build custom options for tileLayer
            if ($scope.defaults && $scope.defaults.tileLayerOptions) {
                for (var key in $scope.defaults.tileLayerOptions) {
                    defaults.tileLayerOptions[key] = $scope.defaults.tileLayerOptions[key];
                }
            }
            var tileLayerObj = L.tileLayer(
                    $scope.leaflet.tileLayer, defaults.tileLayerOptions);
            tileLayerObj.addTo(map);
            $scope.leaflet.tileLayerObj = !!attrs.testing ?
                tileLayerObj : 'Add testing="testing" to <leaflet> tag to inspect this object';

            setupCenter();
            setupMaxBounds();
            setupMarkers();
            setupPaths();

            function setupMaxBounds() {
                if (!$scope.maxBounds) {
                    return;
                }
                if ($scope.maxBounds && $scope.maxBounds.southWest && $scope.maxBounds.southWest.lat && $scope.maxBounds.southWest.lng && $scope.maxBounds.northEast && $scope.maxBounds.northEast.lat && $scope.maxBounds.northEast.lng ) {
                    map.setMaxBounds(
                        new L.LatLngBounds(
                            new L.LatLng($scope.maxBounds.southWest.lat, $scope.maxBounds.southWest.lng),
                            new L.LatLng($scope.maxBounds.northEast.lat, $scope.maxBounds.northEast.lng)
                        )
                    );

                    $scope.$watch("maxBounds", function (maxBounds /*, oldValue */) {
                        if (maxBounds.southWest && maxBounds.northEast && maxBounds.southWest.lat && maxBounds.southWest.lng && maxBounds.northEast.lat && maxBounds.northEast.lng) {
                            map.setMaxBounds(
                                new L.LatLngBounds(
                                    new L.LatLng(maxBounds.southWest.lat, maxBounds.southWest.lng),
                                    new L.LatLng(maxBounds.northEast.lat, maxBounds.northEast.lng)
                                )
                            );
                        }
                    });
                }
            }

            function setupCenter() {
                $scope.$watch("center", function (center /*, oldValue */) {
                    if (!center) {
                        return;
                    }

                    if (center.lat && center.lng && center.zoom) {
                        map.setView([center.lat, center.lng], center.zoom);
                    } else if (center.autoDiscover === true) {
                        map.locate({ setView: true, maxZoom: $scope.leaflet.maxZoom });
                    }
                }, true);

                map.on("dragend", function (/* event */) {
                    $scope.$apply(function (scope) {
                        scope.center.lat = map.getCenter().lat;
                        scope.center.lng = map.getCenter().lng;
                    });
                });

                map.on("zoomend", function (/* event */) {
                    if ($scope.center.zoom < map.getZoom()) {
						if ($scope.center.zoom < 17 ||
withinBoundingBox(map.getCenter().lat, map.getCenter().lng) == true) {
							$scope.$apply(function (s) {
								s.center.zoom = map.getZoom();
								s.center.lat = map.getCenter().lat;
								s.center.lng = map.getCenter().lng;
							});
						}
						else {
							map.zoomOut()
						}
					}
					else if ($scope.center.zoom !== map.getZoom()) {
						$scope.$apply(function (s) {
							s.center.zoom = map.getZoom();
							s.center.lat = map.getCenter().lat;
							s.center.lng = map.getCenter().lng;
						});
					}
				});
            }
			
			function withinBoundingBox(lat, lng) {
				if (52.5156 > lat && lat > 52.5100) {
					if (13.4263 > lng && lng > 13.4142) {
						return true 
					}
				}
			}
			

			function changeIconSize(e) {

				// this is the default size (of the default icon); it should be known beforehand;
				var defaultIconSize = new L.Point(25, 41);
				//var defaultShadowSize = new L.Point(41, 41);
				var defaultPopupSize = new L.Point(0, -40);
				
				// use leaflet's internal methods to scale the size (a bit overkill for this case...)
				var transformation = new L.Transformation(1, 0, 1, 0);
				
				var currentZoom = map.getZoom();
				var newIconSize = transformation.transform(defaultIconSize, sizeFactor(currentZoom));
				//var newShadowSize = transformation.transform(defaultShadowSize, sizeFactor(currentZoom));
				var newPopupSize = transformation.transform(defaultPopupSize, sizeFactor(currentZoom));
				
				// adjust the icon anchor to the new size
				var newIconAnchor = new L.Point(Math.round(newIconSize.x / 2), newIconSize.y);
				// finally, declare a new icon and update the marker
				if (e) {
					icon = e
				}
				else {
					icon = "img/marker-icon.png"
					newIconSize = defaultIconSize
					newPopupSize = defaultPopupSize
					newIconAnchor = [12, 40]

				}

				var newIcon = new L.Icon({
					iconUrl: icon,
                    iconRetinaUrl: defaults.icon.retinaUrl,
                    popupAnchor: newPopupSize,
					iconSize: newIconSize,
					iconAnchor: newIconAnchor,
					//shadowSize: newShadowSize,
				});
				return newIcon
			}
			
			function sizeFactor(zoom) {
				if (zoom <= 14) return 0.3;
				else if (zoom == 15) return 0.3;
				  else if (zoom == 16) return 1.0;
				  else if (zoom == 17) return 1.0;
				  else if (zoom == 18) return 1.5;
				  else if (zoom == 19) return 2.0;
				  else if (zoom == 20) return 3.0;
				  else if (zoom == 21) return 3.5;
				  else if (zoom == 22) return 3.9;
				  else // zoom >= 22
					    return 2.2;
				}

            function setupMarkers() {
                var markers = {};
                $scope.leaflet.markers = !!attrs.testing ? markers : 'Add testing="testing" to <leaflet> tag to inspect this object';

                if (!$scope.markers) {
                    return;
                }

                for (var name in $scope.markers) {
                    markers[name] = createMarker(name, $scope.markers[name], map);
                }

                $scope.$watch("markers", function (newMarkers /*, oldMarkers*/) {
                    for (var new_name in newMarkers) {
                        if (markers[new_name] === undefined) {
                            markers[new_name] = createMarker(new_name, newMarkers[new_name], map);
                        }
                    }

                    // Delete markers from the array
                    for (var name in markers) {
                        if (newMarkers[name] === undefined) {
                            delete markers[name];
                        }
                    }

                }, true);
            }


            function createMarker(name, scopeMarker, map) {
                var marker = buildMarker(name, scopeMarker);
                map.addLayer(marker);

                if (scopeMarker.focus === true) {
                    marker.openPopup();
                }

                marker.on("dragend", function () {

                    $scope.$apply(function (scope) {

                        //----this is a fix for a problem with marker coordinates on editing landmark --///////
                        globalEditLoc = {}; 
                        globalEditLoc = {
                            lat: marker.getLatLng().lat,
                            lng: marker.getLatLng().lng
                        };
                        //------------//
                 
                        scopeMarker.lat = marker.getLatLng().lat;
                        scopeMarker.lng = marker.getLatLng().lng;

                    });
                    if (scopeMarker.message) {
                        marker.openPopup();
                    }
                });
				//===TODO: The method below needs stress testing. Should we create the various icon sizes first and not do this recalculation every zoom? Does it matter? ===//
				map.on('viewreset', function(){
					if(map.getZoom() > 13){
						marker.setIcon(changeIconSize(scopeMarker.icon));
					}
				});

                $scope.$watch('markers.' + name, function (data, oldData) {
                    if (!data) {
                        map.removeLayer(marker);
                        return;
                    }

                    if (oldData) {
                        if (data.draggable !== undefined && data.draggable !== oldData.draggable) {
                            if (data.draggable === true) {
                                marker.dragging.enable();
                            } else {
                                marker.dragging.disable();
                            }
                        }

                        if (data.focus !== undefined && data.focus !== oldData.focus) {
                            if (data.focus === true) {
                                marker.openPopup();
                            } else {
                                marker.closePopup();
                            }
                        }

                        if (data.message !== undefined && data.message !== oldData.message) {
                            marker.bindPopup(data);
                        }

                        if (data.lat !== oldData.lat || data.lng !== oldData.lng) {
                            marker.setLatLng(new L.LatLng(data.lat, data.lng));
                        }
                    }
                }, true);
                return marker;
            }

            function buildMarker(name, data) {
				if (data.icon) {
					icon = data.icon
				}
				else {
					icon = "img/marker-icon.png"
				}
                var marker = new L.marker($scope.markers[name],
                        {
                            icon: buildIcon(icon),
                            draggable: data.draggable ? true : false
                        }
                );
                if (data.message) {
                    marker.bindPopup(data.message);
                }
                return marker;
            }

            function buildIcon(icon) {
                return L.icon({
                    iconUrl: icon,
                    iconRetinaUrl: defaults.icon.retinaUrl,
                    iconSize: defaults.icon.size,
                    iconAnchor: defaults.icon.anchor,
                    popupAnchor: defaults.icon.popup,
                    //shadowUrl: defaults.icon.shadow.url,
                    //shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
                    //shadowSize: defaults.icon.shadow.size,
                    //shadowAnchor: defaults.icon.shadow.anchor
                });
            }
			
            function setupPaths() {
                var paths = {};
                $scope.leaflet.paths = !!attrs.testing ? paths : 'Add testing="testing" to <leaflet> tag to inspect this object';

                if (!$scope.paths) {
                    return;
                }

                $log.warn("[AngularJS - Leaflet] Creating polylines and adding them to the map will break the directive's scope's inspection in AngularJS Batarang");

                for (var name in $scope.paths) {
                    paths[name] = createPath(name, $scope.paths[name], map);
                }

                $scope.$watch("paths", function (newPaths) {
                    for (var new_name in newPaths) {
                        if (paths[new_name] === undefined) {
                            paths[new_name] = createPath(new_name, newPaths[new_name], map);
                        }
                    }
                    // Delete paths from the array
                    for (var name in paths) {
                        if (newPaths[name] === undefined) {
                            delete paths[name];
                        }
                    }

                }, true);
            }

            function createPath(name, scopePath, map) {
                var polyline = new L.Polyline([], { weight: defaults.path.weight, color: defaults.path.color, opacity: defaults.path.opacity });

                if (scopePath.latlngs !== undefined) {
                    var latlngs = convertToLeafletLatLngs(scopePath.latlngs);
                    polyline.setLatLngs(latlngs);
                }

                if (scopePath.weight !== undefined) {
                    polyline.setStyle({ weight: scopePath.weight });
                }

                if (scopePath.color !== undefined) {
                    polyline.setStyle({ color: scopePath.color });
                }

                if (scopePath.opacity !== undefined) {
                    polyline.setStyle({ opacity: scopePath.opacity });
                }

                map.addLayer(polyline);

                $scope.$watch('paths.' + name, function (data, oldData) {
                    if (!data) {
                        map.removeLayer(polyline);
                        return;
                    }

                    if (oldData) {
                        if (data.latlngs !== undefined && data.latlngs !== oldData.latlngs) {
                            var latlngs = convertToLeafletLatLngs(data.latlngs);
                            polyline.setLatLngs(latlngs);
                        }

                        if (data.weight !== undefined && data.weight !== oldData.weight) {
                            polyline.setStyle({ weight: data.weight });
                        }

                        if (data.color !== undefined && data.color !== oldData.color) {
                            polyline.setStyle({ color: data.color });
                        }

                        if (data.opacity !== undefined && data.opacity !== oldData.opacity) {
                            polyline.setStyle({ opacity: data.opacity });
                        }
                    }
                }, true);
                return polyline;
            }

            function convertToLeafletLatLngs(latlngs) {
                var leafletLatLngs = latlngs
                    .filter(function (latlng) {
                        return !!latlng.lat && !!latlng.lng;
                    })
                    .map(function (latlng) {
                        return new L.LatLng(latlng.lat, latlng.lng);
                    });
                return leafletLatLngs;
            }
			$(window).on("resize", function() {
				$(".angular-leaflet-map").height($(window).height()).width($(".row-fluid").width());
				map.invalidateSize();
			}).trigger("resize");
			
			$(window).on("load", function() {
				$(".angular-leaflet-map").height($(window).height()).width($(".row-fluid").width());
				map.invalidateSize();
			});	
        }
    };
}]);
