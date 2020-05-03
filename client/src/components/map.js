import { PureComponent } from "preact/compat";
import mapboxgl from "mapbox-gl";

import "./map";
mapboxgl.accessToken =
  "pk.eyJ1Ijoicml6a3lyYWppdGhhIiwiYSI6ImNrOHFhMWxvejAwcGEzZnBoN293Yno4YWcifQ.ubRk2pd_ryY67UaSUnZJzg";

class Application extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lng: "80.6",
      lat: "7.9",
      zoom: 7,
      districtdata: []
    };
  }

  componentDidMount() {
    var bounds = [
      [77.964416, 4.958167], // Southwest coordinates
      [83.611469, 10.279157], // Northeast coordinates
    ];

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      maxBounds: bounds,
    });

    var arrr = this.props.districtData.map((point, index) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
      },
      properties: {
        id: index,
        district: point.district,
        cases: point.cases,
      },
    }));

    this.setState({ districtdata: arrr });
    // console.log(arrr);

    map.on("load", () => {
      map.resize();
      // console.log(this.state);
    });

    map.once("load", () => {
      // Add our SOURCE
      // with id "points"
      // console.log(this.state);
      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: this.state.districtdata,
        },
      });

      // // Add our layer
      map.addLayer({
        id: "circles",
        source: "points", // this should be the id of the source
        type: "circle",

        paint: {
          "circle-opacity": 0.75,
          "circle-stroke-width": 1,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "cases"],
            0,
            4,
            1,
            8,
            10,
            15,
            20,
            22,
            30,
            32,
            40,
            42,
            50,
            52,
            60,
            62,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "cases"],
            1,
            "#ffffb2",
            10,
            "#fed976",
            20,
            "#feb24c",
            30,
            "#fd8d3c",
            40,
            "#fc4e2a",
            50,
            "#e31a1c",
            100,
            "#b10026",
          ],
        },
      });
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let lastId;

    map.on("mousemove", "circles", (e) => {
      const id = e.features[0].properties.id;

      if (id !== lastId) {
        lastId = id;
        const { cases, district } = e.features[0].properties;

        map.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();

        const provinceHTML =
          district !== "null" ? `<p>District : <b>${district}</b></p>` : "";

        const HTML = `
            ${provinceHTML}
            <p>Cases: <b>${cases}</b></p>
          `;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(HTML).addTo(map);
      }
    });

    map.on("mouseleave", "circles", function () {
      lastId = undefined;
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
  }

  render() {
    return (
      <div>
        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

export default Application;
