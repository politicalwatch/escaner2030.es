<template>
  <div style="position: relative">
    <div class="flex-header">
      <div class="flex-tabs">
        <a
          class="tab"
          :class="{ active: selectedTab === 'metas' }"
          @click="selectedTab = 'metas'"
        >
          Metas
        </a>
        <a
          class="tab"
          :class="{ active: selectedTab === 'etiquetas' }"
          @click="selectedTab = 'etiquetas'"
        >
          Etiquetas
        </a>
      </div>
      <div>
        <span v-if="selectedTab === 'metas'" class="legend-text">
          Importancia según etiquetas
        </span>
      </div>
    </div>
    <svg class="list-of-topics" :width="availableWidth" :height="canvasHeight">
      <g v-if="availableWidth !== null && selectedTab === 'metas'">
        <g
          class="legend-minibar"
          :transform="`translate(${availableWidth - miniBar.width}, ${
            POSITIONS.interTopic
          })`"
        >
          <line
            x1="0"
            y1="6"
            :x2="miniBar.width"
            y2="6"
            stroke="#eee"
            stroke-width="1"
          ></line>
          <text
            x="0"
            y="0"
            fill="black"
            text-anchor="start"
            dominant-baseline="text-bottom"
          >
            0
          </text>
          <text
            :x="miniBar.width"
            y="0"
            fill="black"
            text-anchor="end"
            dominant-baseline="text-bottom"
          >
            {{ maxSubtopicsCount }}
          </text>
        </g>

        <g :transform="`translate(${0}, ${POSITIONS.interTopic})`">
          <SubtopicToTag
            v-for="(group, index) in allSubtopicsWithTags"
            :group="group"
            :styles="styles"
            :availableWidth="availableWidth"
            :interTopicPosition="POSITIONS.interTopic"
            :radius="radiusScale(group.times)"
            :globalSelectedSubtopic="globalSelectedSubtopic"
            :maxTagsCount="maxTagsCount"
            :maxSubtopicsCount="maxSubtopicsCount"
            @expandSubtopic="expandSubTopic($event)"
            @selectedTag="selectedTag = $event"
            @selectedSubtopic="selectedSubtopic = $event"
          ></SubtopicToTag>
        </g>
      </g>
      <g
        v-if="selectedTab === 'etiquetas'"
        v-for="(group, index) in tagsGroupedByName"
        :key="group.groupTagLabel"
        :transform="`translate(0, ${group.y})`"
      >
        <TagToSubtopicElement
          :class="{
            active: selectedTag?.groupTagLabel === group.groupTagLabel,
          }"
          v-if="availableWidth !== null"
          :group="group"
          :styles="styles"
          :availableWidth="availableWidth"
          :interTopicPosition="POSITIONS.interTopic"
          :radius="radiusScale(group.times)"
          :globalSelectedSubtopic="globalSelectedSubtopic"
          @selectedTag="selectedTag = $event"
          @selectedSubtopic="selectedSubtopic = $event"
        ></TagToSubtopicElement>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';
import { scaleSqrt, max } from 'd3';
import TagToSubtopicElement from './TagToSubtopicElement.vue';
import SubtopicToTag from './SubtopicToTag.vue';

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

// Main function:
// It groups and assign positions to the tag groups and tags
const tagsGroupedByName = ref(null);

watchEffect(() => {
  const tags = props.result.tags;
  const grouped = [];
  tags.forEach((tag) => {
    const existingGroup = grouped.find(
      (group) => group.groupTagLabel === tag.tag
    );
    if (existingGroup) {
      existingGroup.times += tag.times;
      existingGroup.children.push({ ...tag });
    } else {
      grouped.push({
        groupTagLabel: tag.tag,
        times: tag.times,
        children: [{ ...tag }],
      });
    }
  });
  grouped.sort((a, b) => b.times - a.times);
  tagsGroupedByName.value = grouped;
  updatePositionsTagsGroupedByName();
});

function updatePositionsTagsGroupedByName() {
  let y = POSITIONS.interTopic;
  const x = 0; // Assuming x is a constant value
  tagsGroupedByName.value.forEach((group) => {
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
  return tagsGroupedByName.value;
}

/************* sorting in topic mode (list of topics that expand to related tags) */
const allSubtopicsWithTags = ref(null);
watchEffect(() => {
  const tags = props.result.tags;
  const grouped = [];
  tags.forEach((tag) => {
    const existingGroup = grouped.find(
      (group) => group.groupTagLabel === tag.subtopic
    );
    if (existingGroup) {
      existingGroup.times += tag.times;
      existingGroup.children.push({ ...tag });
    } else {
      grouped.push({
        groupTagLabel: tag.subtopic,
        times: tag.times,
        children: [{ ...tag }],
        topic: tag.topic,
        expanded: false,
      });
    }
  });

  //group by importance
  grouped.sort((a, b) => b.times - a.times);
  allSubtopicsWithTags.value = grouped;
  updatePositionsSubtopicsWithTags(grouped);
});

function updatePositionsSubtopicsWithTags(listOfTags) {
  let y = POSITIONS.interTopic;
  const x = 0;
  listOfTags.forEach((group) => {
    group.y = y;
    group.x = x;
    if (group.expanded)
      y += 2 * POSITIONS.interTopic * (group.children.length + 1.5); //
    else y += POSITIONS.interTopic + 6;

    const xGroup = props.availableWidth * 0.6;
    let yGroup = POSITIONS.interTopic * 2; // spacing for first item
    group.children.forEach((child) => {
      child.x = xGroup;
      child.y = yGroup;
      yGroup += 2 * POSITIONS.interTopic + 3;
    });
  });
  return listOfTags;
}

function expandSubTopic(group) {
  console.log(group.expanded);
  group.expanded = !group.expanded;
  updatePositionsSubtopicsWithTags(allSubtopicsWithTags.value);
}

const canvasHeight = computed(() => {
  if (selectedTab.value === 'etiquetas') {
    const lastItem =
      tagsGroupedByName.value[tagsGroupedByName.value.length - 1];

    return max([
      300,
      lastItem.y +
        lastItem.children.length * POSITIONS.interTopic +
        POSITIONS.interTopic * 2,
    ]);
  } else {
    const lastItem =
      allSubtopicsWithTags.value[allSubtopicsWithTags.value.length - 1];
    return max([300, lastItem.y + POSITIONS.interTopic * 4]);
  }
});
//
const maxTagsCount = computed(() => {
  return max(tagsGroupedByName.value, (d) => d.times);
});
const maxSubtopicsCount = computed(() => {
  return max(allSubtopicsWithTags.value, (d) => d.times);
});
const radiusScale = computed(() => {
  return scaleSqrt()
    .domain([0, maxTagsCount.value])
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
  if (newValue === null) {
    emits('selectedTag', null);
    return;
  } else {
    emits(
      'update:globalSelectedTag',
      newValue.children.map((child) => child.subtopic)
    );
  }
});
watch(selectedSubtopic, (newValue, oldValue) => {
  if (newValue === null) {
    emits('update:globalSelectedSubtopic', null);
    return;
  } else emits('update:globalSelectedSubtopic', newValue.subtopic);
});

const selectedTab = ref('metas');

const miniBar = {
  width: 100,
  height: 4,
  margin: 10,
};
</script>

<style lang="scss" scoped>
// ui
.flex-tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 2rem;
}
.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0rem;
  column-gap: 2rem;
  position: sticky;
  .legend-text {
    font-size: 12px;
    font-weight: bold;
    line-height: 12px;
  }
}
.tab {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  color: gray;
}
.tab.active {
  border-bottom: 2px solid #000;
  color: #000;
  font-weight: bold;
  line-height: 50%;
}

.legend-minibar {
  text {
    font-size: 12px;
    font-weight: bold;
    line-height: 12px;
  }
}
</style>
