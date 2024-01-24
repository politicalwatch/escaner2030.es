<template>
    <g>
        <g class="tagCount">
          <circle
            class="normal"
            :r="radius"
            :cx="interTopicPosition"
            :cy="interTopicPosition"
          ></circle>
          <circle
            class="outline"
            :r="interTopicPosition"
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
          @mouseover="emits('selectedTag', group)"
          @mouseleave="emits('selectedTag', null)"
        >
          {{ group.groupTagLabel }}
        </text>
        <g
          v-for="(tag, index2) in group.children"
          :key="index2"
          class="subtopics"
          :class="{
            active: globalSelectedSubtopic == tag.subtopic,
          }"
        >
          <path :d="getPathForIndex(index2)" class="link"></path>
          <circle
            r="4"
            :cx="tag.x"
            :cy="tag.y"
            :fill="getColorForTopic(tag.topic)"
          ></circle>
          <text
            dominant-baseline="middle"
            :x="tag.x + interTopicPosition"
            :y="tag.y"
            text-anchor="start"
            @mouseover="emits('selectedSubtopic', tag.subtopic)"
            @mouseleave="emits('selectedSubtopic', null)"
          >
            {{ tag.subtopic }}
          </text>
        </g>
    </g>
</template>

<script setup>
import { linkHorizontal } from 'd3';
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
  globalSelectedSubtopic: {
    type: String || null,
    default: null,
  },
});

const emits = defineEmits(['selectedTag', 'selectedSubtopic']);

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

</script>

<style lang="scss" scoped>


.tagCount {
  circle.normal {
    fill: #d5d5d5;
  }
  circle.outline {
    fill: none;
    stroke: #d5d5d5;
    stroke-width: 1px;
    stroke-dasharray: 4 4;
  }
  text {
    font-size: 12px;
    font-weight: bold;
    line-height: 12px;
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
text {
  font-size: 14px;
  font-weight: 300;
  cursor: default;
}

.subtopics text:hover {
  font-weight: bold !important;
}
</style>