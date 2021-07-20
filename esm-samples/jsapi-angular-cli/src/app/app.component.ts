import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";

import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  public view: MapView = null;

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    // const webmap = new WebMap({
    //   portalItem: {
    //     id: 'aa1d3f80270146208328cf66d022e09c',
    //   },
    // });

    // const view = new MapView({
    //   container,
    //   map: webmap
    // });

    const view = new MapView({
      container: container,
      center: [-111.893789, 33.616224],
      zoom: 10,
      map: {
        basemap: "streets"
      },
      constraints: {
        rotationEnabled: false
      }
    });

    // const bookmarks = new Bookmarks({
    //   view,
    //   // allows bookmarks to be added, edited, or deleted
    //   editingEnabled: true,
    // });

    // const bkExpand = new Expand({
    //   view,
    //   content: bookmarks,
    //   expanded: true,
    // });

    // // Add the widget to the top-right corner of the view
    // view.ui.add(bkExpand, 'top-right');

    // // bonus - how many bookmarks in the webmap?
    // webmap.when(() => {
    //   if (webmap.bookmarks && webmap.bookmarks.length) {
    //     console.log('Bookmarks: ', webmap.bookmarks.length);
    //   } else {
    //     console.log('No bookmarks in this webmap.');
    //   }
    // });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("The map is ready.");

      const testLayer = new FeatureLayer({
        title: 'Testing Undefined Properties',
        id: "test-undefined-values-layer",
        objectIdField: "ObjectID",
        geometryType: "point",
        outFields: ["*"],
        fields: [
          {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid",
            nullable: false
          },
          {
            name: "place",
            alias: "Place",
            type: "string",
            nullable: true
          }
        ],
        source: [
          new Graphic({
            attributes: {
              ObjectId: 1,
              place: " somewhere"
            },
            geometry: new Point({
              longitude: -111.947088,
              latitude: 33.653044
            })
          }),
          new Graphic({
            attributes: {
              ObjectId: 2,
              place: undefined
            },
            geometry: new Point({
              longitude: -112.058618,
              latitude: 33.595268
            })
          })
        ],
        renderer: new SimpleRenderer({
          label: 'circle',
          symbol: new SimpleMarkerSymbol({
            color: [255, 128, 0, 0.5],
            outline: {
              width: 2,
              color: "white"
            }
          })
        }),
        spatialReference: { wkid: 4326 }
      });
      this.view.map.add(testLayer);
      testLayer.when().then(() => {
        console.log('test layer created');
        setTimeout( () => { testLayer.applyEdits( {
          addFeatures: [
            new Graphic ({
              attributes: {
                ObjectId: 3,
                place: undefined
              },
              geometry: new Point({
                longitude: -111.714306,
                latitude: 33.469397
              })
            })
          ]
          }).then( () => {
            console.log('3rd graphic added');
          }); 
        }, 5000);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
