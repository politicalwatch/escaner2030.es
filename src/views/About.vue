<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header :title="$t('about.title')" />
      <div class="o-grid">
        <div
          class="o-grid__col u-8@sm u-offset-2@sm"
          v-html="$t('about.content')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TipiHeader } from '@politicalwatch/tipi-uikit';
</script>

<style scoped lang="scss"></style>
