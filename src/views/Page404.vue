<template>
  <div id="page404" class="o-container o-section u-margin-bottom-10">
    <div class="o-grid u-padding-top-10 u-padding-bottom-10">
      <div
        class="o-grid__col u-12 u-6@sm u-offset-3@sm u-text-center u-padding-top-10 u-padding-bottom-10"
      >
        <h1>{{ t('page404.title') }}</h1>
        <p>
          {{ t('page404.body') }}
        </p>
        <router-link :to="{ name: 'scanner' }" class="btn btn-custom">{{
          t('page404.button')
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped lang="scss">
.container {
  padding: 80px 15px;
}
p {
  font-size: 1.2em;
}
</style>
