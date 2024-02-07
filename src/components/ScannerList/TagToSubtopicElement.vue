<template>
  <g :class="getClassesForHovered(group)">
    <g class="tagCount">
      <circle
        class="outline"
        :r="interTopicPosition"
        :cx="interTopicPosition"
        :cy="interTopicPosition"
        @mouseover="onMouseOver(group)"
        @mouseleave="onMouseLeave(group)"
      ></circle>
      <circle
        class="normal"
        :r="radius"
        :cx="interTopicPosition"
        :cy="interTopicPosition"
      ></circle>

      <text
        :x="interTopicPosition"
        :y="interTopicPosition + 1"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ group.times }}
      </text>
    </g>

    <text
      :x="interTopicPosition * 3"
      :y="interTopicPosition - 6"
      @mouseover="onMouseOver(group)"
      @mouseleave="onMouseLeave(group)"
      class="text-label"
    >
      {{
        hovered
          ? group.groupTagLabel
          : group.groupTagLabel.substring(0, maxCharactersText)
      }}
    </text>
    <g
      v-for="(subtopic, index2) in group.children"
      :key="index2"
      class="subtopics"
      :class="getClassesForHoveredSubtopic(subtopic)"
    >
      <path :d="getPathForIndex(index2)" class="link"></path>
      <circle
        r="4"
        :cx="subtopic.x"
        :cy="subtopic.y"
        :fill="getColorForTopic(subtopic.topic)"
      ></circle>
      <text
        class="text-subtopic"
        dominant-baseline="middle"
        :x="subtopic.x + interTopicPosition"
        :y="subtopic.y"
        text-anchor="start"
        @mouseover="onMouseOver(subtopic)"
        @mouseleave="onMouseLeave(group)"
      >
        {{ subtopic.subtopic }}
      </text>
    </g>
  </g>
</template>

<script setup>
import { linkHorizontal } from 'd3';
import { computed, ref } from 'vue';
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
});

const emits = defineEmits(['update:mouseOverElement', 'update:clickedElement']);

// aux:
function getColorForTopic(topic) {
  return props.styles.topics[topic].color ?? 'black';
}

const link = linkHorizontal()
  .x((d) => d.x)
  .y((d) => d.y);

function getPathForIndex(index) {
  const startingPoint = {
    x: index === 0 ? props.interTopicPosition * 2 : props.availableWidth * 0.4,
    y: props.interTopicPosition,
  };
  const endingPoint = {
    x: props.availableWidth * 0.6,
    y: props.interTopicPosition * (index + 1),
  };
  return link({ source: startingPoint, target: endingPoint });
}

const maxCharactersText = computed(() => {
  const space = props.availableWidth * 0.6 - props.interTopicPosition * 3;
  return space / 7.2; // TBD - 7 is an arbitrary number
});
// interactivity
const hovered = ref(false);

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
  if (props.mouseOverElement.level === 3) {
    if (props.mouseOverElement.name === props.group.groupTagLabel)
      return 'hovered';
  }
  return 'hoveredOut';
}
function getClassesForHoveredSubtopic(d) {
  if (!props.mouseOverElement) return '';
  if (props.mouseOverElement.level === 3) {
    if (props.mouseOverElement.name === d.tag) return 'hovered';
  }
}
</script>

<style lang="scss" scoped>
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

path.link {
  stroke: #d5d5d5;
  fill: none;
}
path.link.active,
path.link:hover {
  stroke: #000;
}

g.active {
  text {
    font-weight: bold;
  }
  path.link {
    stroke: #000 !important;
  }
  circle.normal {
    fill: #000;
  }
}

// charts
.text-label {
  font-size: 16px;
  font-weight: 300;
  cursor: default;
}
.text-subtopic {
  font-size: 14px;
  font-weight: 300;
  cursor: default;
}

.subtopics text:hover {
  font-weight: bold !important;
}

g.hoveredOut {
  text,
  circle,
  line,
  rect,
  path {
    opacity: 0.2;
  }
  .hovered {
    text,
    circle,
    line,
    rect,
    path {
      opacity: 1;
    }
  }
}
.hovered {
  circle.normal {
    fill: #000 !important;
  }
  circle.outline {
    stroke: #000;
  }
}
</style>
