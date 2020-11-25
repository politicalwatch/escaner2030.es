<template>
    <div class="legend">
      <div v-for="(d, i) in sortedTopics" :key="i" class="legend__item">
        <div
          class="legend__img"
          :style="{
            'background-color': styles.topics[d].color,
            'background-image': `url(/img/topics/${styles.topics[d].image})`,
          }"></div>
        <span class="legend__text c-topic-link__name u-color-secondary">{{d}}</span>
      </div>
    </div>
</template>

<script>
import { Utils } from 'tipi-uikit';

export default {
  name: 'scanner-legend',
  props: {
    result: {
      type: Object || null,
      required: true,
    },
    styles: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    isFirst: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    sortedTopics() {
      const topics = [ ...this.result.topics ];
      const sortedTopics = topics.sort(Utils.naturalSort);
      if (this.isFirst) {
        return sortedTopics.slice(0, 8)
      }
      return sortedTopics.slice(9)
    },
  },
};
</script>

<style lang="scss">
$width: 36px;
.legend {
  &__img {
    margin: 0px 5px 5px 0px;
    width: $width;
    height: $width;
    display: inline-block;
    vertical-align: top;
    background-size: $width/1.5 $width/1.5;
    background-repeat: no-repeat;
    background-position: center;
  }
  &__text {
    line-height: $width !important;
  }
}
</style>
