<template>
  <gmap-map class="map-container" :center="mapCenter" :zoom="zoom" :options="mapOptions">
    <gmap-marker
      v-for="(item,index) in mapMarkers"
      :key="`marker${index}`"
      :position="{lat:item.lat, lng:item.lng}"
    ></gmap-marker>
  </gmap-map>
</template>
<script>
export default {
  props: ["markers", "center", "options", "zoom", "detalized"],

  computed: {
    mapOptions() {
      let styles = this.styles;
      let options = this.options;
      // console.log({ ...options, styles });
      if (this.detalized) {
        styles = styles.map(item => {
          // console.log();
          item.stylers[0].visibility = "on";
          return item;
        });
        return { ...options, styles };
      } else {
        return { ...options, styles };
      }
    },
    mapMarkers() {
      return this.markers.map(item => {
        return { lat: Number(item.lat), lng: Number(item.lng) };
      });
    },
    mapCenter() {
      if (this.center) {
        return { lat: Number(this.center.lat), lng: Number(this.center.lng) };
      } else {
        let markers = this.markers.map(item => {
          return { lat: Number(item.lat), lng: Number(item.lng) };
        });
        if (markers.length < 1) return { lat: 0, lng: 0 };
        let center = {
          lat: markers[0].lat,
          lng: markers[0].lng - 5
        };
        // console.log(this.$vuetify);
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
            return { lat: center.lat, lng: center.lng + 5 };
            break;
          case "sm":
            return { lat: center.lat, lng: center.lng + 5 };
            break;
          case "md":
            return { lat: center.lat, lng: center.lng - 1 };
            break;
          case "lg":
            return { lat: center.lat, lng: center.lng - 4.5 };
            break;
          case "xl":
            return { lat: center.lat, lng: center.lng - 6.5 };
            break;
        }
        // if (this.$vuetify.breakpoint.smAndDown) {
        //   return { lat: center.lat + 5, lng: center.lng + 5 };
        // } else if (this.$vuetify.breakpoint.mdAndUp) {
        //   return { lat: center.lat, lng: center.lng - 3 };
        // } else if (this.$vuetify.breakpoint.xlOnly) {
        //   return { lat: center.lat, lng: center.lng - 6 };
        // } else {
        //   return center;
        // }
      }
    }
  },
  data() {
    return {
      styles: [
        {
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5"
            }
          ]
        },
        {
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#616161"
            }
          ]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#f5f5f5"
            }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#bdbdbd"
            }
          ]
        },
        {
          featureType: "administrative.neighborhood",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575"
            }
          ]
        },
        {
          featureType: "poi.business",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e"
            }
          ]
        },
        {
          featureType: "road",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#757575"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              color: "#dadada"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#616161"
            }
          ]
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [
            {
              color: "#e5e5e5"
            }
          ]
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [
            {
              color: "#eeeeee"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#c9c9c9"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#9e9e9e"
            }
          ]
        }
      ]
    };
  }
};
</script>
<style>
/* .map-container:after {
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  z-index: 999;
  position: absolute;
} */
/* .overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
} */
</style>