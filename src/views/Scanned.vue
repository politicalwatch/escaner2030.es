<template>
  <div>
    <div
      id="scanner"
      class="o-container o-section u-margin-bottom-10"
      v-if="result"
    >
      <tipi-header :title="title" />

      <div id="result" class="o-section o-grid">
        <div class="o-grid__col u-12 result">
          <div></div>
          <div class="u-padding-bottom-10">
            <h5>Extracto del texto:</h5>
            <div class="o-grid__col u-12">
              <p class="u-color-secondary">{{ excerpt }}</p>
            </div>
          </div>

          <scanner-visualizations :result="result" />

          <!-- Begin CTAs -->
          <div
            class="o-grid o-grid--wide o-grid--center u-bg-primary-light u-padding-top-8 u-padding-bottom-8 u-margin-top-8"
          >
            <div class="o-grid__col u-12 u-12@xs u-10@sm u-text-center">
              <h5>Escanea otro documento</h5>
              <p>
                Escáner 2030 te permite cargar y etiquetar todos los documentos
                que necesites en clave de Agenda 2030, así como realizar
                comparaciones con los documentos almacenados en nuestra base de
                datos.
              </p>
              <router-link
                :to="{ name: 'scanner' }"
                class="c-button c-button--primary"
                >Escanear</router-link
              >
            </div>
          </div>
          <!-- End CTAs -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TipiHeader } from '@politicalwatch/tipi-uikit';
import api from '@/api';
import ScannerVisualizations from '@/components/scanner-visualizations.vue';

const route = useRoute();
const router = useRouter();

const title = ref(null);
const excerpt = ref(null);
const result = ref(null);
const errors = ref(null);

const getScanned = () => {
  api
    .getScanned(route.params.id)
    .then((response) => {
      title.value = response.title;
      excerpt.value = response.excerpt;
      result.value = response.result[0];
    })
    .catch((error) => {
      errors.value = error;
      router.push({ name: 'Page404', params: { 0: '404' } });
    });
};

onMounted(() => {
  getScanned();
});

watch(route, getScanned);
</script>

<style lang="scss" scoped>
.c-page-header {
  margin-bottom: 2rem;
}
</style>
