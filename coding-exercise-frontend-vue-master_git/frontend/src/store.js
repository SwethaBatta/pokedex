import Vue from "vue";
import Vuex from "vuex";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    allData: [], //All data for search and type filters
    favoritesStore: [], //favorites
    data: [], //filteredResults
    pokemonNames: [],
    pokemonTypes: [],
    busy: false,
    searchText: "",
    dropdownText: "",
    tab: "All",
    isGridView: true,
    isListView: false,
    view: "Grid"
  },

  getters: {
    favoritesStore: state => state.favoritesStore
  },

  mutations: {
    ADD_Item(state, id) {
      state.favoritesStore.push(id);
    },

    REMOVE_Item(state, index) {
      state.favoritesStore.splice(index, 1);
    },

    data(state, payload) {
      state.data = payload;
    },

    allData(state, payload) {
      state.allData = payload;
    },

    busy(state, payload) {
      state.busy = payload;
    },

    tab(state, payload) {
      state.tab = payload;
    },

    isGridView(state, payload) {
      state.isGridView = payload;
    },

    isListView(state, payload) {
      state.isListView = payload;
    },

    view(state, payload) {
      state.view = payload;
    },

    dropdownText(state, payload) {
      state.dropdownText = payload;
    },

    searchText(state, payload) {
      state.searchText = payload;
    }
  },

  actions: {
    addToCart(context, id) {
      context.commit("ADD_Item", id);
    },

    removeItem(context, id) {
      context.commit("REMOVE_Item", id);
    }
  }
});
