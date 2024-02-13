<template>
  <div class="legend-list-ods">
    <div v-for="(d, i) in sortedAllOds" :key="i" class="legend__item">
      <div
        class="legend__img"
        :style="{
          'background-color': isTopicActive(d)
            ? styles.topics[d].color
            : '#eee',
          'background-image': `url(/img/topics/${styles.topics[d].image})`,
          'pointer-events': isTopicActive(d) ? 'auto' : 'none',
          cursor: isTopicActive(d) ? 'pointer' : 'default',
        }"
        :class="getClassesForHovered(d, i + 1)"
        @mouseover="onMouseOver(d)"
        @mouseleave="onMouseLeave(d)"
        @click="onClick(d)"
      ></div>
    </div>
  </div>
</template>

<script>
import { Utils } from '@politicalwatch/tipi-uikit';

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
      default: false,
    },
    mouseOverElement: {
      type: Object || null,
      default: null,
    },
    clickedArray: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    sortedTopics() {
      const topics = [...this.result.topics];
      const sortedTopics = topics.sort(Utils.naturalSort);
      return sortedTopics;
    },
    sortedAllOds() {
      const ods = Object.keys(this.styles.topics).slice(0, 17);
      const sortedOds = ods.sort(Utils.naturalSort);
      return sortedOds;
    },
  },
  methods: {
    isTopicActive(topic) {
      return this.sortedTopics.includes(topic);
    },
    getClassesForHovered(d, odsIndex) {
      if (!this.mouseOverElement) return '';
      if (this.mouseOverElement.level1 == odsIndex) return 'hovered';
      else return 'hoveredOut';
    },
    // interactivity
    onMouseOver(d) {
      this.$emit('update:mouseOverElement', {
        name: d,
        level: 1,
        level1: d.split(' ')[1],
        level2: '',
        source: 'ods',
      });
    },
    onMouseLeave(d) {
      this.$emit('update:mouseOverElement', null);
    },
    onClick(d) {
      this.$emit('update:clickedElement', {
        name: d,
        level: 1,
        level1: d.split(' ')[1],
        level2: '',
        source: 'ods',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$width: 36px;
.legend-list-ods {
  display: flex;
  column-gap: 8px;
  justify-content: flex-start;
  flex-wrap: wrap;

  &__img {
    margin: 0px 5px 5px 0px;
    width: $width;
    height: $width;
    display: inline-block;
    vertical-align: top;
    background-size: calc($width/1.5) calc($width/1.5);
    background-repeat: no-repeat;
    background-position: center;
  }
  &__text {
    line-height: $width !important;
  }
}

.hoveredOut {
  opacity: 0.2;
  transition: all 0.2s ease-in-out;
}
</style>
