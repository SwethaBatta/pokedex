<template>
  <div class="pageView">
    <div class="mainView">
      <PokemonHeader :names="this.pokemonNames" />
      <template v-if="loading > 0">
        <img
          id="loadingIcon"
          alt="Spinner"
          src="../assets/pokemon_ball.png"
          style="width: 5%; height: 5%"
        />
      </template>
      <template v-else> </template>

      <!-- GridView structure -->
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance=""
      >
        <div class="gridView" v-if="$store.state.isGridView">
          <article v-for="card in this.results" v-bind:key="card.id">
            <router-link
              :to="{
                name: 'pokemonDetail',
                params: { msg: card, name: card.name }
              }"
            >
              <img
                id="gridImage"
                :src="card.image"
                height="94"
                width="100"
                class="center"
              />
            </router-link>
            <div>
              <h3>{{ card.name }}</h3>
              <span :key="index" v-for="(type, index) in card.types">
                <span>
                  <v-chip color="blue" dark text-color="white">{{
                    type
                  }}</v-chip></span
                ><span v-if="index !== card.types.length - 1">&nbsp; </span>
              </span>
            </div>
            <span>
              <v-spacer />
              <div class="pretty p-icon p-toggle p-plain p-tada p-has-focus">
                <input
                  id="favCheckbox"
                  :value="card.id"
                  v-model="favorites"
                  type="checkbox"
                  @click="showList(card.id)"
                />
                <div class="state p-default-o p-off">
                  <i class="icon mdi mdi-heart-outline"></i>
                  <label></label>
                </div>
                <div class="state p-danger-o p-on">
                  <transition
                    enter-active-class="bouncein"
                    leave-active-class="rollout"
                  >
                    <i class="icon mdi mdi-heart"></i>
                  </transition>
                  <label></label>
                </div>
              </div>
            </span>
          </article>
          <div v-if="spinnerConditionGridView" id="scroll-trigger">
            <img
              id="loadingIcon"
              alt="Spinner"
              src="../assets/pokemon_ball.png"
              style="width: 50px; height: 50px"
            />
          </div>
        </div>
        <h3
          style="color: white; text-align: center"
          v-if="$store.state.isGridView && noFavoritesCondition"
        >
          No Favorites
        </h3>
      </div>

      <!-- ListView structure -->
      <div v-if="$store.state.isListView">
        <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="">-->
        <div
          class="list-row"
          :key="item.id"
          v-for="item in this.results"
          cols="12"
          xs="2"
          sm="4"
          md="6"
        >
          <ul>
            <router-link
              :to="{
                name: 'pokemonDetail',
                params: { msg: item, name: item.name }
              }"
            >
              <li>
                <v-list-item :key="item.id">
                  <v-list-item-avatar>
                    <v-img :src="item.image"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="item.name"></v-list-item-title>
                    <v-list-item-subtitle>
                      <h3>{{ item.types.join(", ") }}</h3>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </li>
            </router-link>
            <li class="left">
              <div class="pretty p-icon p-toggle p-plain p-tada p-has-focus">
                <input
                  id="favCheckbox"
                  :value="item.id"
                  v-model="favorites"
                  type="checkbox"
                  @click="showList(item.id)"
                />
                <div class="state p-default-o p-off">
                  <i class="icon mdi mdi-heart-outline"></i>
                  <label></label>
                </div>
                <div class="state p-danger-o p-on">
                  <transition
                    enter-active-class="bouncein"
                    leave-active-class="rollout"
                  >
                    <i class="icon mdi mdi-heart"></i>
                  </transition>
                  <label></label>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="spinnerConditionListView" id="scroll-trigger">
          <img
            id="loadingIcon"
            alt="Spinner"
            src="../assets/pokemon_ball.png"
            style="width: 50px; height: 50px"
          />
        </div>
        <h3
          style="color: white; text-align: center"
          v-if="$store.state.isListView && noFavoritesCondition"
        >
          No Favorites
        </h3>
        <!--</div>-->
      </div>

      <footer></footer>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars*/
import axios from "axios";
import { CREATE_FAVORITE, UN_FAVORITE } from "@/gql/poll.mutations";
import { POKEMON_ALLDATA } from "@/gql/poll.queries";
import { bus } from "../main";

import PokemonHeader from "./PokemonHeader.vue";

export default {
  name: "pokedex",
  data() {
    return {
      appTitle: "Pokedex",
      cards: [],
      searchText: "",
      dropdownText: "",
      tab: "All",
      pokemonNames: [],
      loading: 0,
      endReached: false,
      limitVal: 10,
      initialLimit: 10,
      offsetVal: 0
    };
  },

  computed: {
    favorites() {
      return this.$store.getters.favoritesStore;
    },

    results() {
      return this.filteredResults();
    },

    spinnerConditionGridView() {
      return (
        this.endReached !== true &&
        this.$store.state.isGridView &&
        this.results.length > this.limitVal
      );
    },

    spinnerConditionListView() {
      return (
        this.endReached !== true &&
        this.$store.state.isListView &&
        this.results.length > this.limitVal
      );
    },

    noFavoritesCondition() {
      return (
        this.favorites.length === 0 && this.$store.state.tab === "Favorites"
      );
    }
  },

  components: {
    PokemonHeader
  },

  apollo: {
    pokemonData: {
      query: POKEMON_ALLDATA,
      loadingKey: "loading"
    }
  },

  created: function() {
    this.endReached = false;
    bus.$on("showListAbout", data => {
      this.showList(data);
    });

    bus.$on("callFilteredResults", data => {
      this.filteredResults();
    });
  },

  async mounted() {
    try {
      var result = await axios({
        method: "POST",
        url: "http://localhost:4000/graphql",
        data: {
          query: `{ pokemons(query: { limit: 20, offset: 0 }) { edges {name, id, image, isFavorite, types, height{maximum, minimum}, weight{maximum, minimum}, maxCP, maxHP, sound} } }`
        }
      });
      this.cards = result.data.data.pokemons.edges;
      this.$store.commit("data", this.cards);
      for (var pokemon_each in this.cards) {
        this.pokemonNames.push(this.cards[pokemon_each].name);
      }
    } catch (error) {
      //console.error(error);
    }
    document.getElementById("allTab").setAttribute("disabled", "disabled");
    document.getElementById("gridIcon").setAttribute("disabled", "disabled");
  },

  methods: {
    async getInitialUsers(limitVal, offsetVal) {
      try {
        var result = await axios({
          method: "POST",
          url: "http://localhost:4000/graphql",
          data: {
            query: `{ pokemons(query: { limit: ${limitVal}, offset: ${offsetVal} }) { edges {name, id, image, isFavorite, types, height{maximum, minimum}, weight{maximum, minimum}, maxCP, maxHP, sound} } }`
          }
        });
        this.dta = result.data.data.pokemons.edges;
        this.cards = result.data.data.pokemons.edges;
        for (var pokemon_each in this.cards) {
          this.pokemonNames.push(this.cards[pokemon_each].name);
        }
        this.$store.commit("data", this.cards);
      } catch (error) {
        //console.error(error);
      }
    },

    loadMore: function() {
      if (!this.endReached) {
        this.endReached = false;
        this.busy = true;

        setTimeout(() => {
          this.limitVal = this.limitVal + this.initialLimit;
          this.getInitialUsers(this.limitVal, this.offsetVal);
          this.busy = false;
        }, 1000);

        if (this.limitVal > 151 - this.initialLimit) {
          this.endReached = true;
          this.busy = false;
        }
      }
    },

    filteredResults: function() {
      var self = this;

      if (this.$store.state.tab === "All") {
        return this.cards.filter(function(pokemon) {
          return (
            pokemon.name
              .toLowerCase()
              .indexOf(self.$store.state.searchText.toLowerCase()) !== -1 &&
            (self.$store.state.dropdownText !== ""
              ? pokemon.types.includes(self.$store.state.dropdownText)
              : true)
          );
        });
      } else {
        return this.cards.filter(function(pokemon) {
          return (
            pokemon.name
              .toLowerCase()
              .indexOf(self.$store.state.searchText.toLowerCase()) !== -1 &&
            (self.$store.state.dropdownText !== ""
              ? pokemon.types.includes(self.$store.state.dropdownText)
              : true) &&
            self.favorites.includes(pokemon.id)
          );
        });
      }
    },

    addFavorite(id) {
      this.$apollo
        .mutate({
          mutation: CREATE_FAVORITE,
          variables: {
            id: id
          }
        })
        .then(data => {
          //console.log('ADDFav',data);
        })
        .catch(error => {
          //console.error(error);
        });

      var ind = this.$store.getters.favoritesStore.indexOf(id);
      if (ind < 0) {
        this.$store.getters.favoritesStore.push(id);
      }
    },

    addUnFavorite(id) {
      this.$apollo
        .mutate({
          mutation: UN_FAVORITE,
          variables: {
            id: id
          }
        })
        .then(data => {
          //console.log('RemoveFav',data);
        })
        .catch(error => {
          //console.error(error);
        });

      var index = this.$store.getters.favoritesStore.indexOf(id);
      if (index >= 0) {
        this.$store.getters.favoritesStore.splice(index, 1);
      }
    },

    showList(id) {
      if (this.favorites.includes(id)) {
        this.addUnFavorite(id);
      } else {
        this.addFavorite(id);
      }
    },

    resetScroller() {
      this.endReached = "start";
      this.limitVal = this.initialLimit;
    }
  }
};
</script>

<style lang="scss">
@import "~pretty-checkbox/src/pretty-checkbox.scss";

html {
  scroll-behavior: smooth;
}

footer {
  position: relative;
  width: 400px;
  height: 200px;
}

@keyframes animate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.gridView {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 50px;
}

#gridImage {
  margin-top: 5%;
}

article {
  margin-top: 10%;
  background-color: white;
  text-align: center;
  text-transform: capitalize;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2);
}

h3 {
  margin: 0;
}

.pageView {
  background: linear-gradient(125deg, #00103a 0%, #3e5f77 100%);
}

.mainView {
  margin-left: 150px;
  margin-right: 150px;
  padding: 0;
  min-height: 100vh;
}

#scroll-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  font-size: 2rem;
  color: #efefef;
}

ul {
  list-style-type: none;
}

li:last-child {
  float: right;
}

.list-row {
  padding: 10px;
  margin: 10px;
  background: white;
  border-radius: 6px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.37);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.37);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.37);
  display: grid;
  transition: all 0.5s;
  grid-template-columns: auto 1fr;
}

.list-row-item {
  display: grid;
  grid-template-columns: 150px 1fr;
  padding: 4px;
  transition: all 0.5s;
}

.list-image {
  width: 50%;
  border-radius: 6px;
  margin-right: 5px;
}

/*Fav icon in grid view*/

.pretty {
  margin-right: 0;
}

/*Animation for spinner*/
#loadingIcon {
  -webkit-animation: rotation 2s infinite linear;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}

/* Media queries for responsiveness */
/* For Mobile Device, we will be going with column wrap approach */
@media screen and (max-width: 600px) {
  .mainView {
    margin-left: 35px;
    margin-right: 35px;
  }
}

@media screen and (max-width: 768px) {
  .mainView {
    overflow-x: hidden;
  }
}

@media screen and (min-width: 768px) {
}

/* Dropdown list */

.theme--light.v-list {
  background: linear-gradient(65deg, #42a5f5 0%, #bbdefb 80%);
}
.v-list-item__content {
  color: black;
}
.theme--light.v-list-item:hover:before {
  opacity: 0.35;
}
</style>
