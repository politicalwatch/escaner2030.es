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
          Apariciones de etiquetas
        </span>
      </div>
    </div>
    <div class="filters-list">
      <div v-for="clickedElement in clickedArray">
        <span
          class="pill"
          :style="{ backgroundColor: getColorForTopic(clickedElement.name) }"
          @click="emits('update:clickedElement', clickedElement)"
        >
          {{ clickedElement.name }}
        </span>
      </div>
    </div>
    <svg class="list-of-topics" :width="availableWidth" :height="canvasHeight">
      <g v-if="availableWidth !== null && selectedTab === 'metas'">
        <g
          class="legend-minibar"
          :transform="`translate(${availableWidth - miniBar.width}, ${
            POSITIONS.interTopic / 2
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

        <g :transform="`translate(${0}, ${POSITIONS.interTopic / 2})`">
          <SubtopicToTag
            v-for="(group, index) in allSubtopicsWithTags"
            :group="group"
            :styles="styles"
            :availableWidth="availableWidth"
            :interTopicPosition="POSITIONS.interTopic"
            :radius="radiusScale(group.times)"
            :maxTagsCount="maxTagsCount"
            :maxSubtopicsCount="maxSubtopicsCount"
            :mouseOverElement="mouseOverElement"
            @expandSubtopic="expandSubTopic($event)"
            @update:mouseOverElement="emits('update:mouseOverElement', $event)"
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
          v-if="availableWidth !== null"
          :group="group"
          :styles="styles"
          :availableWidth="availableWidth"
          :interTopicPosition="POSITIONS.interTopic"
          :radius="radiusScale(group.times)"
          :mouseOverElement="mouseOverElement"
          @update:mouseOverElement="emits('update:mouseOverElement', $event)"
        ></TagToSubtopicElement>
      </g>
    </svg>
    <a
      href="#"
      v-if="hasReadMore && selectedTab === 'etiquetas'"
      @click.prevent="readMoreActive = !readMoreActive"
    >
      {{ readMoreActive ? 'Ver menos' : 'Ver todas las etiquetas' }}
    </a>
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
  mouseOverElement: {
    type: Object || null,
    default: null,
  },
  clickedArray: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(['update:mouseOverElement', 'update:clickedElement']);
const POSITIONS = {
  interTopic: 28,
};

// Main function:
// It groups and assign positions to the tag groups and subtopics
const tagsGroupedByName = ref(null);

watchEffect(() => {
  const tags = props.result.tags;
  let grouped = [];
  tags.forEach((tag) => {
    const existingGroup = grouped.find(
      (group) => group.groupTagLabel === tag.tag
    );
    if (existingGroup) {
      existingGroup.times += tag.times;
      existingGroup.children.push({
        depth: 2,
        level1: tag.subtopic.split(' ')[0].split('.')[0],
        level2: tag.subtopic.split(' ')[0].split('.')[1],
        ...tag,
      });
    } else {
      grouped.push({
        groupTagLabel: tag.tag,
        depth: 3,
        level1: tag.subtopic.split(' ')[0].split('.')[0],
        level2: tag.subtopic.split(' ')[0].split('.')[1],
        times: tag.times,
        children: [
          {
            depth: 2,
            level1: tag.subtopic.split(' ')[0].split('.')[0],
            level2: tag.subtopic.split(' ')[0].split('.')[1],
            ...tag,
          },
        ],
      });
    }
  });
  // filter out elements in case there are elements in the clickedArray.
  // if an element in clicked array has level 1, then we filter out all the grouped that have a different level 1
  // if an element in clicked array has level 2, then we filter out all the grouped that have a different level 2
  // at the end grouped only contains the elements that are in the clicked array
  if (props.clickedArray.length > 0) {
    const clickedArray = props.clickedArray;
    const clickedArrayLevel1 = clickedArray.filter(
      (element) => element.level === 1
    );
    const clickedArrayLevel2 = clickedArray.filter(
      (element) => element.level === 2
    );
    if (clickedArrayLevel1.length > 0) {
      grouped = grouped.filter((element) =>
        clickedArrayLevel1.find((clickedElement) =>
          element.children.some(
            (child) => child.level1 === clickedElement.level1
          )
        )
      );
    }
    if (clickedArrayLevel2.length > 0) {
      grouped = grouped.filter((element) =>
        clickedArrayLevel2.find(
          (clickedElement) => clickedElement.level2 === element.level2
        )
      );
    }
  }

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
  let grouped = [];
  tags.forEach((tag) => {
    const existingGroup = grouped.find(
      (group) => group.groupTagLabel === tag.subtopic
    );
    if (existingGroup) {
      existingGroup.times += tag.times;
      existingGroup.children.push({
        depth: 3,
        level1: tag.subtopic.split(' ')[0].split('.')[0],
        level2: tag.subtopic.split(' ')[0].split('.')[1],
        ...tag,
      });
    } else {
      grouped.push({
        groupTagLabel: tag.subtopic,
        times: tag.times,
        level1: tag.subtopic.split(' ')[0].split('.')[0],
        level2: tag.subtopic.split(' ')[0].split('.')[1],
        depth: 2,
        children: [
          {
            depth: 3,
            level1: tag.subtopic.split(' ')[0].split('.')[0],
            level2: tag.subtopic.split(' ')[0].split('.')[1],
            ...tag,
          },
        ],
        topic: tag.topic,
        expanded: false,
      });
    }
  });
  // filter out elements in case there are elements in the clickedArray.
  // if an element in clicked array has level 1, then we filter out all the grouped that have a different level 1
  // if an element in clicked array has level 2, then we filter out all the grouped that have a different level 2
  // at the end grouped only contains the elements that are in the clicked array
  if (props.clickedArray.length > 0) {
    const clickedArray = props.clickedArray;
    const clickedArrayLevel1 = clickedArray.filter(
      (element) => element.level === 1
    );
    const clickedArrayLevel2 = clickedArray.filter(
      (element) => element.level === 2
    );
    if (clickedArrayLevel1.length > 0) {
      grouped = grouped.filter((element) =>
        clickedArrayLevel1.find(
          (clickedElement) => clickedElement.level1 === element.level1
        )
      );
    }
    if (clickedArrayLevel2.length > 0) {
      grouped = grouped.filter((element) =>
        clickedArrayLevel2.find(
          (clickedElement) => clickedElement.level2 === element.level2
        )
      );
    }
  }

  //sort by importance
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
  group.expanded = !group.expanded;
  updatePositionsSubtopicsWithTags(allSubtopicsWithTags.value);
}
const MAX_ITEMS = 30;

const hasReadMore = computed(() => {
  return tagsGroupedByName.value.length > MAX_ITEMS;
});

const readMoreActive = ref(false);

const canvasHeight = computed(() => {
  if (selectedTab.value === 'etiquetas') {
    let lastItemIndex = readMoreActive.value
      ? tagsGroupedByName.value.length - 1
      : MAX_ITEMS;
    if (hasReadMore.value === false)
      lastItemIndex = tagsGroupedByName.value.length - 1;
    const lastItem = tagsGroupedByName.value[lastItemIndex];
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

span.pill {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #eee;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
  color: white;
  cursor: pointer;

  &:hover::after {
    content: 'x';
    margin-left: 0.5rem;
    cursor: pointer;
  }
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
