<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <tipi-navbar
          pre-image="/img/multicolor.jpg"
          :links="MENU"
          :logo="LOGO"
        />
        <router-view />
        <footer-block />
      </div>
    </transition>
  </div>
</template>

<script>
import { TipiNavbar } from '@politicalwatch/tipi-uikit';
import FooterBlock from '@/components/footer-block.vue';
import config from '@/config';
import { useScannerStore } from '@/stores/scanner';

export default {
  name: 'app',
  components: {
    TipiNavbar,
    FooterBlock,
  },
  setup() {
    const store = useScannerStore();
    return { store };
  },
  data: function () {
    return {
      MENU: config.MENU,
      DISCLAIMER: config.DISCLAIMER,
      LOGO: config.LOGO,
    };
  },
  created: function () {
    this.store.getTopics();
  },
};
</script>

<style lang="scss"></style>
