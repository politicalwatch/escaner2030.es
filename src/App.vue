<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <tipi-navbar
          v-if="locale === 'es'"
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

<script setup>
import { computed, onMounted } from 'vue';
import { TipiNavbar } from '@politicalwatch/tipi-uikit';
import { useI18n } from 'vue-i18n';

import config from '@/config';
import { useScannerStore } from '@/stores/scanner';
import FooterBlock from '@/components/footer-block.vue';

const store = useScannerStore();
const { locale } = useI18n();

const MENU = computed(() => config.MENU[locale.value]);
const DISCLAIMER = computed(() => config.DISCLAIMER[locale.value]);
const LOGO = config.LOGO;

onMounted(() => {
  store.getTopics();
});
</script>

<style lang="scss"></style>
