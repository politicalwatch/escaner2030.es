import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';

Vue.use(Vuex);

const types = {
  GET_TOPICS: 'GET_TOPICS',
};

const state = {
  allTopics: [],
};

const getters = {
};

const actions = {
  getTopics(context) {
    api.getTopics()
      .then(response => {
        context.commit(types.GET_TOPICS, response);
      })
      .catch(error => this.errors = error);
  },
};

const mutations = {
  [types.GET_TOPICS](state, topics) {
    state.allTopics = topics;
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
