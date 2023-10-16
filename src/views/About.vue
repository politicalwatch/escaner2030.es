<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Acerca" />
      <div class="o-grid">
        <div
          class="o-grid__col u-8@sm u-offset-2@sm"
          v-html="$t('about.content')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { TipiHeader } from '@politicalwatch/tipi-uikit';

export default {
  name: 'about',
  components: {
    TipiHeader,
  },
};
</script>

<style scoped lang="scss"></style>
