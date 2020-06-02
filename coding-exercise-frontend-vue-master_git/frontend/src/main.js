import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { createProvider } from "./vue-apollo";

export const bus = new Vue();

import VueApollo from "vue-apollo";
Vue.use(VueApollo);

import PrettyCheckbox from "pretty-checkbox-vue";
Vue.use(PrettyCheckbox);

import VueStar from "vue-star";
Vue.component("VueStar", VueStar);

import VueParticles from "vue-particles";
Vue.use(VueParticles);

import infiniteScroll from "vue-infinite-scroll";
Vue.use(infiniteScroll);

import VueParticlesBg from "particles-bg-vue";
Vue.use(VueParticlesBg);

//import SequentialEntrance from "vue-sequential-entrance";
//import "vue-sequential-entrance/vue-sequential-entrance.css";
//Vue.use(SequentialEntrance);

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "http://localhost:4000/graphql"
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

// eslint-disable-next-line no-unused-vars
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
