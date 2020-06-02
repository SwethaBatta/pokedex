<template>
  <div>
    <div>
      <img
        id="pokemonLogo"
        alt="Pokemon logo"
        src="../assets/pokemon_logo.png"
      />
    </div>
    <div class="sky-container">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
    <span>
      <v-row>
        <v-row>
          <v-btn-toggle
            id="tabGroup"
            v-model="$store.state.tab"
            tile
            color="white"
            group
          >
            <v-btn id="allTab" @click="switchToAllTab()" value="All" dark
              >All</v-btn
            >
            <v-btn id="favTab" @click="switchToFavTab()" value="Favorites" dark
              >Favorites</v-btn
            >
          </v-btn-toggle>
        </v-row>
        <v-btn-toggle
          id="viewGroup"
          v-model="$store.state.view"
          tile
          color="white"
          group
        >
          <v-btn
            id="gridIcon"
            @click="switchToGridView()"
            value="Grid"
            active-class="text--darken-2"
            dark
            ><v-icon large color="blue darken-2">mdi-apps</v-icon></v-btn
          >
          <v-btn
            id="listIcon"
            @click="switchToListView()"
            value="List"
            active-class="text--darken-2"
            dark
            ><v-icon large color="blue darken-2"
              >mdi-format-list-bulleted</v-icon
            ></v-btn
          >
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <!--<v-text-field
                      placeholder="Search by name"
                      v-model="search"
                      filled
                      dark>            
                </v-text-field>-->

          <v-autocomplete
            v-model="search"
            :items="names"
            dark
            filled
            clearable
          />
        </v-col>
        <v-col class="d-flex" cols="12" sm="6" md="6">
          <v-select
            :items="pokemonTypes"
            placeholder="Search by type"
            v-model="dropDown"
            filled
            clearable
            dark
          ></v-select>
        </v-col>
      </v-row>
    </span>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars*/
import { bus } from "../main";
import { POKEMON_TYPES, POKEMONBYNAME } from "@/gql/pokedex.queries";
export default {
  name: "PokemonHead",
  props: ["names"],
  data() {
    return {
      pokemonTypes: [],
      pokemonByName: [],
      dropDown: "",
      search: "",
      loading: 0
    };
  },
  apollo: {
    // fetch pokemon types for dropdown
    pokemonTypes: {
      query: POKEMON_TYPES
    },
    pokemonByName: {
      query: POKEMONBYNAME,
      variables() {
        return {
          name: this.search
        };
      },
      loadingKey: "loading"
    }
  },
  computed: {},
  created: function() {},
  methods: {
    switchToAllTab() {
      //Handle initial default case
      document.getElementById("allTab").setAttribute("disabled", "disabled");
      document.getElementById("favTab").removeAttribute("disabled");
      this.$emit("callResetScroller");
      this.$store.commit("tab", "All");
    },
    switchToFavTab() {
      document.getElementById("favTab").setAttribute("disabled", "disabled");
      document.getElementById("allTab").removeAttribute("disabled");
      this.$emit("callResetScroller");
      this.$store.commit("tab", "Favorites");
    },
    switchToGridView() {
      document.getElementById("gridIcon").setAttribute("disabled", "disabled");
      document.getElementById("listIcon").removeAttribute("disabled");
      //this.$emit('callResetScroller');
      this.$store.commit("view", "Grid");
      this.$store.commit("isGridView", true);
      this.$store.commit("isListView", false);
    },
    switchToListView() {
      document.getElementById("listIcon").setAttribute("disabled", "disabled");
      document.getElementById("gridIcon").removeAttribute("disabled");
      //this.$emit('callResetScroller');
      this.$store.commit("view", "List");
      this.$store.commit("isGridView", false);
      this.$store.commit("isListView", true);
    }
  },
  watch: {
    dropDown: function(val, oldval) {
      if (val === undefined) {
        this.dropDown = "";
        this.$store.commit("dropdownText", "");
      } else {
        this.$store.commit("dropdownText", val);
      }
      //Call this.filteredUsers() using emit
      bus.$emit("callFilteredResults", "updating dropdown text");
      true;
    },
    search: function(val, oldval) {
      if (val === undefined) {
        this.search = "";
        this.$store.commit("searchText", "");
      } else {
        this.$store.commit("searchText", val);
      }
      //Call this.filteredUsers() using emit
      bus.$emit("callFilteredResults", "updating search text");
      true;
    }
  }
};
</script>

<style lang="scss">
#tabGroup {
  margin-left: 20px;
}
/* Media queries for responsiveness */
@media screen and (max-width: 600px) {
  #pokemonLogo {
    width: 150px;
    height: 150px;
  }
  .mainView {
    margin-left: 30px;
    margin-right: 30px;
  }
}
@media screen and (max-width: 768px) {
  #pokemonLogo {
    width: 100%;
    height: 120%;
  }
}
@media screen and (min-width: 768px) {
  #pokemonLogo {
    width: 60%;
    height: 60%;
  }
}
/*Animation- shooting stars*/
.sky-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(125deg, #00103a 0%, #3e5f77 100%);
  border-radius: 50%;
  transform: rotateZ(45deg);
}
.border {
  width: 500px;
  height: 500px;
  position: absolute;
  border: 5px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 3px 2px #d6d6d6;
  z-index: 100;
}
.star {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 2px;
  background: linear-gradient(-45deg, #5f91ff, rgba(0, 0, 255, 0));
  filter: drop-shadow(0 0 6px #699bff);
  animation: tail 3000ms ease-in-out infinite,
    shooting 3000ms ease-in-out infinite;
}
.star::before,
.star::after {
  position: absolute;
  content: "";
  top: calc(50% - 1px);
  right: 0;
  height: 2px;
  background: linear-gradient(
    -45deg,
    rgba(0, 0, 255, 0),
    #5f91ff,
    rgba(0, 0, 255, 0)
  );
  border-radius: 100%;
  transform: translateX(50%) rotateZ(45deg);
  animation: shining 3000ms ease-in-out infinite;
}
.star::after {
  transform: translateX(50%) rotateZ(-45deg);
}
.star:nth-child(1) {
  top: calc(50% - 200px);
  left: calc(50% - 300px);
  animation-delay: 650ms;
}
.star:nth-child(1)::before,
.star:nth-child(1)::after {
  animation-delay: 650ms;
}
.star:nth-child(2) {
  top: calc(50% - -50px);
  left: calc(50% - 190px);
  animation-delay: 150ms;
}
.star:nth-child(2)::before,
.star:nth-child(2)::after {
  animation-delay: 150ms;
}
.star:nth-child(3) {
  top: calc(50% - -90px);
  left: calc(50% - 200px);
  animation-delay: 1600ms;
}
.star:nth-child(3)::before,
.star:nth-child(3)::after {
  animation-delay: 1600ms;
}
.star:nth-child(4) {
  top: calc(50% - 50px);
  left: calc(50% - 250px);
  animation-delay: 4700ms;
}
.star:nth-child(4)::before,
.star:nth-child(4)::after {
  animation-delay: 4700ms;
}
.star:nth-child(5) {
  top: calc(50% - -190px);
  left: calc(50% - 200px);
  animation-delay: 2100ms;
}
.star:nth-child(5)::before,
.star:nth-child(5)::after {
  animation-delay: 2100ms;
}
/* Animations */
@keyframes tail {
  0% {
    width: 0;
  }
  30% {
    width: 100px;
  }
  100% {
    width: 0;
  }
}
@keyframes shining {
  0% {
    width: 0;
  }
  50% {
    width: 30px;
  }
  100% {
    width: 0;
  }
}
@keyframes shooting {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(320px);
  }
}
#pokemon_header {
  margin-right: 50px;
}
</style>
