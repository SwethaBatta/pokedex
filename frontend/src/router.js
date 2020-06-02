import Vue from "vue";
import Router from "vue-router";
import Pokedex from "./components/Pokedex.vue";
import PokemonDetail from "./components/PokemonDetail.vue";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "pokedex",
      component: Pokedex
    },
    {
      path: "/pokemonDetails/:name",
      name: "pokemonDetail",
      component: PokemonDetail
    }
  ]
});
