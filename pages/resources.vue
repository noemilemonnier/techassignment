<template>
    <div>
        <v-row class="mt-5 mb-5">
            <v-col cols="12" md="6" lg="6">
                        <v-card class="ma-4" elevation="3" style="width: 400px;" shaped outlined>
                            <form>
                                <v-card-title class="justify-center"><h3>Nearby Services</h3></v-card-title>
                                <v-card-text>
                                    <v-row class="ma-1">
                                        <vuetify-google-autocomplete id="id" class="mx-3" :v-model="inputAddress" placeholder="Enter an address" v-on:placechanged="getAddressData" v-on:no-results-found="noResultsFound" />
                                    </v-row>
                                </v-card-text>
                                <v-card-actions class="pa-1">
                                    <v-btn class="mx-2" color="primary" type="submit" @click.prevent="searchButtonPressed">Search</v-btn>
                                </v-card-actions>
                            </form>
                        </v-card>
            </v-col>
            <v-col v-if="hasResults" cols="12" md="6" lg="6">
                        <v-card class="justify-center ma-4 ">
                            <GmapMap id="map" ref="map" :center="{lat, lng}" :zoom="10" style="height: 300px;">
                                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false"></GmapInfoWindow>
                                <GmapMarker ref="myMarker" v-for="(u, index) in units" :key="index" :position="google && new google.maps.LatLng(u.position.lat, u.position.lng)" :clickable="true" @click="toggleInfoWindow(u,index)"></GmapMarker>
                                <GmapMarker :icon="icon"  :position="google && new google.maps.LatLng(lat, lng)"></GmapMarker>
                            </GmapMap>
                        </v-card>
                </v-col>
                <h4 v-if="hasNoResults">No Services Nearby</h4>
        </v-row>
        <v-row v-if="hasLoaded">
                <v-row class="ma-4">
                    <v-text-field class="ma-4" clearable label="Searching..." v-model="filters.search" ></v-text-field>
                </v-row>
                <v-row class="ma-4">
                    <v-card class="ma-4" outlined>
                        <client-only>
                                    <v-data-table :headers="tableHeaders" :items="formattedUnits" :search="filters.search" :items-per-page="40">
                                        <template v-slot:[`item.name`]="{ item }">
                                            {{ item.name }}
					                    </template>
                                        <template v-slot:[`item.www`]="{ item }">
						                    {{ item.www  }}
					                    </template>
					                    <template v-slot:[`item.street_address`]="{ item }">
						                    {{ item.street_address  }}
					                    </template>
                                        <template v-slot:[`item.description`]="{ item }">
						                    {{ item.description  }}
					                    </template>
				                    </v-data-table>
			            </client-only>
		            </v-card>
                </v-row>
        </v-row>
    </div>
</template>

<script>
import axios from "axios";
import {gmapApi} from 'vue2-google-maps'
import apis from "../api/index"

export default {
    head: () => ({
        title: "Resources"
    }),
    data: () => ({
        inputAddress: '',
        map: null,
        distanceBtwLocation: 0,
        count: 0,
        hasResults: false,
        hasNoResults: false,
        hasLoaded: false,
        radius: 100,
        units: [],
        markers: [],
        lat: 0,
        lng: 0,
        filters: {
			search: ""
        },
        tableHeaders: [
            { text: "Name", value: "name" },
            { text: "Website", value: "www", sortable: false },
            { text: "Street Address", value: "street_address"},
            { text: "Description", value: "description" , sortable: false }
        ],
        icon: {
            url: "https://icon-library.com/images/maps-pin-icon/maps-pin-icon-13.jpg",
            scaledSize: {width: 28, height: 28},
            labelOrigin: {x: 16, y: -10}
        },
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
        	content: '',
            pixelOffset: {
              width: 0,
              height: -35
            }
        },
    }),
    computed:{
        google: gmapApi,
		formattedUnits(){
			return this.units.map(unit => {
                const u = {...unit};
				return u;
			});
        }
    },
    methods: {
        getAddressData(addressData) {
            if (addressData !== null) {
                this.lat = addressData.latitude;
                this.lng = addressData.longitude;
            }
        },
        noResultsFound() {
            console.log("Result not found");
        },
        async searchButtonPressed() {
            await apis.getUnitsWithDistance(this.lat, this.lng, this.radius)
            .then(
                response => {
                    console.log("Response count: " + response.data.count)
                    this.count = response.data.count;
                    console.log("Count: " + this.count);
                    this.retrieveUnits();
                })
            .catch(error => {
                console.error("There was an error in retrieving units!", error.message);
            });
        },
        async retrieveUnits(){
            if(this.count > 0 ){
                await apis.getUnitsAll(this.lat, this.lng, this.radius, this.count)
                .then(
                    response => {
                        console.log(response.data.results);
                        let website = null;
                        let address = null;
                        let nm = null;
                        let descr = null;
                        response.data.results.forEach(unit => {
                            if(unit.www !== null) website = unit.www.fi;
                            if(unit.description !== null) descr = unit.description.fi;
                            if(unit.street_address.fi !== null) address = unit.street_address.fi;
                            if(unit.name.fi !== null) nm = unit.name.fi;
                            this.units.push({
                                id: unit.id,
                                is_active: unit.is_active,
                                department: unit.department,
                                description: unit.description,
                                name: nm,
                                street_address: address,
                                description: descr,
                                www: website,
                                position: {
                                    lat: unit.location.coordinates[0],
                                    lng: unit.location.coordinates[1]
                                }
                            });
                        });
                        this.hasNoResults = false;
                        this.hasLoaded = true;
                    }
                ).catch(error => {
                    console.error("There was an error in retrieving units!", error.message);
                });
            }
            else{
                this.hasNoResults = true;
                this.hasResults = false;
                this.hasLoaded = false;
            }
            this.hasResults = true;
            console.log(this.units[0].position.lat);
        },
        toggleInfoWindow(unit, idx) {
            this.infoWindowPos = unit.position;
            this.infoOptions.content = this.getInfoWindowContent(unit);

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current place index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;

            }
        },
        getInfoWindowContent(unit) {
            const p1 = new google.maps.LatLng(this.lat, this.lng);
            const p2 = new google.maps.LatLng(unit.position.lat, unit.position.lng);
            this.distanceBtwLocation = this.calcDistance(p1, p2);
            return (
                `<div>
                    <div>
                        <div>
                            <div style="margin: 3px; color: rgb(190, 50, 35);">
                                <h2> ${unit.name} </h2>
                            </div>
                        </div>
                        <div v-if="unit.description.fi !== null" style="margin: 3px;">
                            <span style="font-weight: bold;">Description:  </span>
                            ${unit.description.fi}
                            <br>
                        </div>
                        <div style="margin: 3px;">
                            <span style="font-weight: bold;">Distance:  </span>
                            ${this.distanceBtwLocation}
                            <span>km</span>
                            <br>
                        </div>
                    </div>
                </div>`
            );
        },
        calcDistance(p1, p2) {
          return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
        },
    }
}
</script>

<style scoped>
.scroll {
   overflow-y: scroll
}
#map{
    height: 100%;
}
#h2{
    font-weight: bold;
    color:rgb(190, 50, 35);
}
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>