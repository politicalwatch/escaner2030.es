<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <tipi-navbar
          v-if="$i18n.locale === 'es'"
          pre-image="/img/multicolor.jpg"
          :links="MENU"
          :logo="LOGO"
        />
        <tipi-navbar
          v-else
          pre-image="/img/multicolor.jpg"
          :links="MENU"
          :logo="LOGO"
          :disclaimerLink="DISCLAIMER"
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
      MENU: config.MENU[this.$i18n.locale],
      DISCLAIMER: config.DISCLAIMER[this.$i18n.locale],
      LOGO: config.LOGO,
    };
  },
  created: function () {
    this.store.getTopics();
  },
};
</script>

<style lang="scss"></style>
