import { defineStore } from 'pinia';
import api from '@/api';

const state = () => {
  return {
    allTopics: [],
  };
};

const getters = {};

const actions = {
  getTopics(context) {
    api
      .getTopics()
      .then((response) => {
        this.allTopics = response;
      })
      .catch((error) => (this.errors = error));
  },
};

export const useScannerStore = defineStore('scanner', {
  state,
  getters,
  actions,
});
