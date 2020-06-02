<template>
  <div class="about">
    <a @click="$router.go(-1)">
      <v-icon large color="#FFCB05">mdi-reply</v-icon>
    </a>
    <div id="detailsCard" v-if="this.cardId !== null">
      <h1 class="pageHeader">{{ this.card.name }}</h1>
      <br />
      <v-layout class="justify-center">
        <v-flex sm4 md4>
          <v-card min-height="350">
            <img
              id="image"
              :src="this.card.image"
              height="94"
              width="100"
              class="center"
            />
            <h3 class="statsData">{{ this.card.id }}</h3>
            <button @click="play(card.sound)">
              <v-icon large color="blue darken-2">mdi-volume-high</v-icon>
            </button>
            <div>
              <div>
                <span :key="index" v-for="(type, index) in this.card.types">
                  <span>
                    <v-chip
                      v-if="type === 'Grass'"
                      color="green"
                      text-color="white"
                      >{{ type }}</v-chip
                    >
                    <v-chip
                      v-if="type === 'Fire'"
                      color="red"
                      text-color="white"
                      >{{ type }}</v-chip
                    >
                    <v-chip
                      v-if="type === 'Ice'"
                      color="blue"
                      text-color="white"
                      >{{ type }}</v-chip
                    >
                    <v-chip
                      v-if="['Ice', 'Grass', 'Fire'].includes(type) === false"
                      color="purple"
                      text-color="white"
                      >{{ type }}</v-chip
                    >
                    &nbsp;
                  </span>
                </span>
                <span>
                  <v-spacer />
                </span>
              </div>
              <div class="pretty p-icon p-toggle p-plain p-tada p-has-focus">
                <input
                  id="favCheckbox"
                  :checked="returnFavoritesStore.includes(cardId)"
                  type="checkbox"
                  @click="callShowList(cardId)"
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
            </div>
            <v-row id="stats">
              <v-col>
                <h3 class="statsHeader">Max CP</h3>
                <h5 class="statsData">{{ this.card.maxCP }}</h5>
              </v-col>
              <v-col>
                <h3 class="statsHeader">Max HP</h3>
                <h5 class="statsData">{{ this.card.maxHP }}</h5>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h3 class="statsHeader">Weight</h3>
                <h5 class="statsData">
                  {{ this.card.weight.maximum }} -
                  {{ this.card.weight.minimum }}
                </h5>
              </v-col>
              <v-col>
                <h3 class="statsHeader">Height</h3>
                <h5 class="statsData">
                  {{ this.card.height.maximum }} -
                  {{ this.card.height.minimum }}
                </h5>
              </v-col>
            </v-row>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars*/
import { POKEMON_TYPES } from "@/gql/pokedex.queries";
import { bus } from "../main";
export default {
  name: "pokemonDetail",
  data() {
    return {
      card: this.$route.params.msg,
      cardId: this.$route.params.msg.id,
      pokemonById: []
    };
  },
  apollo: {
    // fetch pokemon types for dropdown
    pokemonTypes: {
      query: POKEMON_TYPES
    }
  },
  computed: {
    returnFavoritesStore() {
      return this.$store.getters.favoritesStore;
    }
  },
  methods: {
    play: function(sound) {
      var myTrack = new Audio(sound);
      myTrack.play();
    },
    callShowList(id) {
      bus.$emit("showListAbout", id);
    }
  },
  created() {
    this.card = this.$route.params.msg;
  }
};
</script>

<style lang="scss" scoped>
@import "~pretty-checkbox/src/pretty-checkbox.scss";
#image {
  width: 50%;
  height: 50%;
}
#detailsCard {
  margin-left: 30px;
  margin-right: 30px;
}
.about {
  background: linear-gradient(125deg, #00103a 0%, #3e5f77 100%);
  min-height: 100vh;
}
.transparent {
  background-color: black !important;
  opacity: 0.65;
  border-color: transparent !important;
}
.pageHeader {
  color: #ffcb05;
  text-shadow: 2px 2px 6px #3d7dca;
  font-size: 40px;
}
.statsHeader {
  color: #003d99;
}
.statsData {
  color: #0052cc;
}
.container {
  background-color: blue;
}
button:focus {
  outline: none;
}
.v-col {
  background: #3a1c71;
}
</style>
