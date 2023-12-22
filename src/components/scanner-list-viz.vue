<template>
  <div>
    <svg class="list-of-topics" :width="availableWidth" :height="canvasHeight">
      <g
        v-for="(group, index) in tagsGroupedByName"
        :key="group.groupTagLabel"
        :transform="`translate(0, ${group.y})`"
        :class="{
          active:
            selectedTag?.groupTagLabel === group.groupTagLabel 
        }"
      >
        <!-- <line x1="0" y1="0" :x2="availableWidth" y2="0" stroke="red"></line> -->
        <g class="tagCount">
          <circle
            class="normal"
            :r="radiusScale(group.times)"
            :cx="POSITIONS.interTopic"
            :cy="POSITIONS.interTopic"
          ></circle>
          <circle
            class="outline"
            :r="POSITIONS.interTopic"
            :cx="POSITIONS.interTopic"
            :cy="POSITIONS.interTopic"
          ></circle>
          <text
            :x="POSITIONS.interTopic"
            :y="POSITIONS.interTopic + 1"
            fill="white"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ group.times }}
          </text>
        </g>
        <text
          :x="POSITIONS.interTopic * 3"
          :y="POSITIONS.interTopic - 6"
          @mouseover="selectedTag = group"
          @mouseleave="selectedTag = null"
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
            :x="tag.x + POSITIONS.interTopic"
            :y="tag.y"
            text-anchor="start"
            @mouseover="selectedSubtopic = tag"
            @mouseleave="selectedSubtopic = null"
          >
            {{ tag.subtopic }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { scaleSqrt, max, linkHorizontal } from 'd3';

const props = defineProps({
  result: {
    type: Object || null,
    required: true,
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  availableWidth: {
    type: Number,
    default: 900,
  },
  globalSelectedSubtopic: {
    type: String || null,
    default: null,
  },
});

const emits = defineEmits(['selectedTag', 'update:globalSelectedSubtopic']);
const POSITIONS = {
  interTopic: 24,
  fontSize: 12,
};

const link = linkHorizontal()
  .x((d) => d.x)
  .y((d) => d.y);

function getPathForIndex(index) {
  const startingPoint = {
    x: index === 0 ? POSITIONS.interTopic * 2 : props.availableWidth * 0.4,
    y: POSITIONS.interTopic,
  };
  const endingPoint = {
    x: props.availableWidth * 0.6,
    y: POSITIONS.interTopic * (index + 1),
  };
  return link({ source: startingPoint, target: endingPoint });
}

// Main function:
// It groups and assign positions to the tag groups and tags

const tagsGroupedByName = computed(() => {
  const tags = props.result.tags;
  const grouped = [];
  tags.forEach((tag) => {
    const existingGroup = grouped.find(
      (group) => group.groupTagLabel === tag.tag
    );
    if (existingGroup) {
      existingGroup.times += tag.times;
      existingGroup.children.push(tag);
    } else {
      grouped.push({
        groupTagLabel: tag.tag,
        times: tag.times,
        children: [tag],
      });
    }
  });
  grouped.sort((a, b) => b.times - a.times);

  let y = POSITIONS.interTopic;
  const x = 0; // Assuming x is a constant value
  grouped.forEach((group) => {
    group.x = x;
    group.y = y;
    y += POSITIONS.interTopic * (group.children.length + 1) + 6;
    const xGroup = props.availableWidth * 0.6;
    let yGroup = POSITIONS.interTopic;
    group.children.forEach((child) => {
      child.x = xGroup;
      child.y = yGroup;
      yGroup += POSITIONS.interTopic;
    });
  });

  return grouped;
});

const canvasHeight = computed(() => {
  const lastItem = tagsGroupedByName.value[tagsGroupedByName.value.length - 1];

  return max([
    300,
    lastItem.y +
      lastItem.children.length * POSITIONS.interTopic +
      POSITIONS.interTopic * 2,
  ]);
});
//
const radiusScale = computed(() => {
  return scaleSqrt()
    .domain([0, max(tagsGroupedByName.value, (d) => d.times)])
    .range([3, POSITIONS.interTopic - 4]);
});

// aux:
function getColorForTopic(topic) {
  return props.styles.topics[topic].color ?? 'black';
}
// interactivity:
const selectedTag = ref(null);
const selectedSubtopic = ref(null);
watch(selectedTag, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue === null) {
    emits('selectedTag', null);
    return;
  } else {
    console.log(newValue.children.map((child) => child.subtopic));
    emits(
      'update:globalSelectedTag',
      newValue.children.map((child) => child.subtopic)
    );
  }
});
watch(selectedSubtopic, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue === null) {
    emits('update:globalSelectedSubtopic', null);
    return;
  } else emits('update:globalSelectedSubtopic', newValue.subtopic);
});
</script>

<style lang="scss" scoped>
text {
  font-size: 14px;
  font-weight: 300;
  cursor: default;
}

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

.subtopics text:hover {
  font-weight: bold !important;
}
</style>
