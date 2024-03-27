<template>
  <g
    :transform="`translate(0, ${group.y})`"
    :class="getClassesForHovered(group)"
  >
    <g
      class="expand-circle"
      :class="{
        expanded: group.expanded,
      }"
    >
      <circle
        :r="CIRCLE_RADIUS"
        cx="12"
        cy="-4"
        class="bg-circle"
        @click="expandMe"
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
      ></circle>
      <circle
        :r="CIRCLE_RADIUS / 3"
        :cx="CIRCLE_RADIUS"
        :cy="-CIRCLE_RADIUS / 3"
        :fill="getColorForTopic(group.topic)"
        v-show="!hovered && !group.expanded"
        style="pointer-events: none"
      ></circle>
      <path
        transform="translate(12,-4)"
        :d="symbol(symbolPlus, 24)()"
        stroke="black"
        stroke-width="2"
        fill="none"
        style="pointer-events: none"
        v-show="hovered && !group.expanded"
      />
      <line
        x1="6"
        y1="-4"
        x2="18"
        y2="-4"
        stroke="black"
        stroke-width="3"
        fill="none"
        v-show="group.expanded"
      />
    </g>

    <text :x="positions.id" class="text-normal" font-weight="500">{{
      IdAndName.id
    }}</text>
    <text
      :x="positions.label"
      class="text-normal"
      @mouseover="onMouseOver(group)"
      @mouseleave="onMouseLeave(group)"
    >
      {{ IdAndName.name }}
    </text>
    <g :transform="`translate(${availableWidth - miniBar.width},-8)`">
      <rect
        fill="#fff"
        x="-4"
        y="-4"
        :width="miniBar.width + 4"
        :height="interTopicPosition + 4"
      ></rect>
      <rect
        :width="miniBar.width"
        :height="miniBar.height"
        fill="#efefef"
        rx="2"
        ry="2"
      >
      </rect>
      <rect
        :width="miniBarScale(group.times)"
        :height="miniBar.height"
        fill="#000"
      >
      </rect>
      <text :x="-8" y="4" font-size="12px" text-anchor="end" v-if="hovered">
        {{ group.times }}
      </text>
    </g>

    <!-- expansion on click -->
    <g
      v-for="(tag, index2) in group.children"
      :transform="`translate(0, ${tag.y})`"
      v-if="group.expanded"
      :class="getClassesForHoveredTag(tag)"
    >
      <text
        class="text-label"
        :x="positions.label"
        y="-4"
        @mouseover="onMouseOver(tag)"
        @mouseleave="onMouseLeave(tag)"
      >
        {{ tag.tag }}
      </text>
      <path :d="getPathForIndex(tag, index2)" class="link"></path>
      <line
        :x1="positions.label"
        y1="0"
        :x2="availableWidth"
        y2="0"
        stroke="#eee"
        stroke-width="1"
      ></line>
      <g
        class="tagCount"
        :transform="`translate(${availableWidth - interTopicPosition},${0})`"
      >
        <circle
          class="outline"
          :r="interTopicPosition"
          :cx="0"
          :cy="0"
          @mouseover="onMouseOver(tag)"
          @mouseleave="onMouseLeave(tag)"
        ></circle>
        <circle
          class="normal"
          :r="radiusScale(tag.times)"
          :cx="0"
          :cy="0"
        ></circle>

        <text
          :x="0"
          :y="0.5"
          fill="white"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ tag.times }}
        </text>
      </g>
    </g>
  </g>
</template>

<script setup>
import { computed, isReactive, ref } from 'vue';
import {
  linkHorizontal,
  scaleSqrt,
  scaleLinear,
  symbol,
  symbolPlus,
  line,
  isoFormat,
} from 'd3';
const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
  availableWidth: {
    type: Number,
    required: true,
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  interTopicPosition: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  mouseOverElement: {
    type: Object || null,
    default: null,
  },
  clickedElement: {
    type: Object || null,
    default: null,
  },
  maxTagsCount: {
    type: Number,
    required: true,
  },
  maxSubtopicsCount: {
    type: Number,
    required: true,
  },
});

const miniBar = {
  width: 100,
  height: 4,
  margin: 10,
};
const CIRCLE_RADIUS = 12;
const positions = {
  id: CIRCLE_RADIUS * 2 + 8,
  label: CIRCLE_RADIUS * 2 + 50,
};
const miniBarScale = computed(() => {
  return scaleLinear()
    .domain([0, props.maxSubtopicsCount])
    .range([0, miniBar.width]);
});

const IdAndName = computed(() => {
  const id = props.group.groupTagLabel.split(' ');
  return {
    id: id[0],
    name: props.group.groupTagLabel.split(' ').slice(1).join(' '),
  };
});

const hovered = ref(false);
const emits = defineEmits([
  'expandSubtopic',
  'update:mouseOverElement',
  'update:clickedElement',
]);
function expandMe() {
  emits('expandSubtopic', props.group);
}
function hoveredMe() {
  hovered.value = true;
}
// aux:
function getColorForTopic(topic) {
  return props.styles.topics[topic].color ?? 'black';
}

const link = linkHorizontal()
  .x((d) => d.x)
  .y((d) => d.y);

function getPathForIndex(tag, index) {
  const endingPoint = {
    x: positions.label,
    y: 0,
  };
  const startingPoint = {
    x: CIRCLE_RADIUS * 2 - 4,
    y: -tag.y + 4,
  };
  return link({ source: startingPoint, target: endingPoint });
}

const radiusScale = computed(() => {
  return scaleSqrt()
    .domain([0, props.maxTagsCount])
    .range([6, props.interTopicPosition - 4]);
});

// interactivity
function onMouseOver(d) {
  hovered.value = true;
  emits('update:mouseOverElement', {
    name: d.groupTagLabel ? d.groupTagLabel : d.tag,
    level: d.depth,
    level1: d.level1,
    level2: d.level2,
    source: 'radial',
  });
}
function onMouseLeave(d) {
  hovered.value = false;
  emits('update:mouseOverElement', null);
}

function getClassesForHovered() {
  if (!props.mouseOverElement) return '';
  if (props.mouseOverElement.level === 1) {
    if (props.mouseOverElement.level1 === props.group.level1) return 'hovered';
  }
  if (props.mouseOverElement.level === 2) {
    if (
      props.mouseOverElement.level2 === props.group.level2 &&
      props.mouseOverElement.level1 === props.group.level1
    )
      return 'hovered';
  }
  return 'hoveredOut';
}
function getClassesForHoveredTag(d) {
  if (!props.mouseOverElement) return '';
  if (props.mouseOverElement.level === 3) {
    if (props.mouseOverElement.name === d.tag) return 'hovered';
  }
}
</script>

<style lang="scss" scoped>
.text-normal {
  font-size: 16px;
  font-weight: 300;
  line-height: 12px;
  text-anchor: start;
}
.text-label {
  font-size: 14px;
  font-weight: 300;
  text-anchor: start;
}

path.link {
  stroke: #eee;
  fill: none;
}
path.link.active,
.tagCount {
  circle.normal {
    fill: #c5c5c5;
    pointer-events: none;
  }
  circle.outline {
    fill: white;
    stroke: #c5c5c5;
    stroke-width: 1px;
    stroke-dasharray: 2 2;
  }
  text {
    font-size: 12px;
    font-weight: 500;
    line-height: 12px;
    pointer-events: none;
  }
}

.expand-circle {
  & {
    pointer-events: none;
  }
  circle.bg-circle {
    pointer-events: all !important;
    transition: 0.2s;
    cursor: pointer;
    fill: #f9f9f9;
    &:hover {
      fill: #d5d5d5;
    }
  }
}

g.hoveredOut {
  text,
  circle,
  line,
  rect,
  path {
    opacity: 0.2;
  }
  g.hovered {
    text,
    circle,
    line,
    rect,
    path {
      opacity: 1;
    }
    circle.normal {
      fill: #000;
    }
    circle.outline {
      stroke: #000;
    }
  }
}
g.hovered {
}
</style>
