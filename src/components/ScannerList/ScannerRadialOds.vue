<template>
  <div class="relative">
    <svg class="radialView" :width="availableWidth" :height="canvasHeight">
      <g :transform="`translate(${availableWidth / 2}, ${availableWidth / 2})`">
        <path
          v-for="d in dataHierarchy.descendants()"
          :key="d.name"
          :d="arc(d)"
          :fill="d.data.color"
          :stroke="d.depth === 3 ? '#fff' : 'transparent'"
          @mouseover="onMouseOver($event, d)"
          @mouseleave="onMouseOut($event, null)"
        ></path>
        <text
          v-for="d in dataHierarchy
            .descendants()
            .filter((d) => d.depth < 3 && showText(d))"
          :key="d.name"
          :transform="`translate(${arc.centroid(d)})`"
          :dy="0"
          :dx="0"
          text-anchor="middle"
          :font-size="d.depth === 1 ? '14px' : '10px'"
          fill="#fff"
          font-weight="600"
          pointer-events="none"
          @mouseover="onMouseOver($event, d)"
          @mouseleave="onMouseOut($event, null)"
        >
          {{ d.data.code }}
        </text>
      </g>
    </svg>
    <Teleport to="body">
      <div
        class="simple-tooltip"
        v-show="selectedSubtopic"
        :style="{
          top: tooltipPosition.y + 'px',
          left: tooltipPosition.x + 'px',
        }"
      >
        <div v-if="selectedSubtopic">
          <div>{{ selectedSubtopic.parent.tag }}</div>
          <div>Meta: {{ selectedSubtopic.subtopic }}</div>
          <div>
            {{ selectedSubtopic.times }}
            {{ selectedSubtopic.times == 1 ? 'aparicion' : 'apariciones' }} de
            tags relacionados
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// d3 functions coming from : https://observablehq.com/@yieldtactics/radial-stacked-bar-chart
import * as d3 from 'd3';
window.dd3 = d3;
import { computed, ref } from 'vue';
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
    default: 400,
  },
  globalSelectedSubtopic: {
    type: String || null,
    default: null,
  },
});

const margin = 40;

const emits = defineEmits(['update:globalSelectedSubtopic']);

const canvasHeight = computed(() => {
  return props.availableWidth;
});

function getBaseOdsList() {
  const odsList = [];
  Object.keys(props.styles.topics).forEach((ods) => {
    if (ods == 'no-topic') {
      return;
    }
    odsList.push({
      tag: ods,
      times: 0,
      children: [],
      odsIndex: parseInt(ods.split(' ')[1]),
      color: props.styles.topics[ods].color,
    });
  });
  // sort the odsList by field tag:

  odsList.sort((a, b) => (a.odsIndex > b.odsIndex ? 1 : -1));
  return odsList;
}
// data preparation: I need to craate an array with the 17 ods. Each ods will have a value (the number of tags) and a color (the color of the ods)
// each ods will also have a list of childrens, each child is a subtopic with a value ( the times field of the tag) and a color (the color of the subtopic)
const dataHierarchy = computed(() => {
  const odsList = getBaseOdsList();
  // iterate over results.tags and add each tag to the correct ods (tag.topic) but we are not adding the same tag twice, we are actually adding the tag.subtopic
  props.result.tags.forEach((tag) => {
    const ods = odsList.find((ods) => ods.tag === tag.topic);

    ods.name = ods.tag;
    ods.code = ods.odsIndex + '';
    if (!ods) return;

    const subtopic = ods.children.find(
      (subtopic) => subtopic.subtopic === tag.subtopic
    );
    if (subtopic) {
      subtopic.children.push({
        name: tag.tag,
        value: tag.times,
        color0: ods.color,
        color: '#E6E3E3',
      });
    } else {
      // add subtopic to ods
      ods.children.push({
        code: tag.subtopic.split(' ')[0],
        name: tag.subtopic,
        subtopic: tag.subtopic,
        children: [
          {
            name: tag.tag,
            value: tag.times,
            color0: ods.color,
            color: '#E6E3E3',
          },
        ],
      });
    }
  });
  // add a colour scale to each ods that will be used to color the subtopics.
  // the color scale takes the hue of the ods and creates a new scale around it according to the number of subtopics
  // the colour range moves from the hue of the ods -30% lightness to the hue of the ods +30% lightness
  odsList.forEach((ods) => {
    const colorScale = d3
      .scaleLinear()
      .domain([0, Math.max(ods.children.length, 2)])
      .range([d3.hsl(ods.color).darker(0.4), d3.hsl(ods.color).brighter(0.4)]);
    ods.children.forEach((subtopic, index) => {
      subtopic.color = colorScale(index);
    });
  });

  // remove ods with no children from odslist
  const newOdsList = odsList.filter((ods) => ods.children.length > 0);

  const odsRoot = {
    name: 'root',
    children: newOdsList,
    odsIndex: 0,
    color: 'white',
  };

  const newroot = d3.hierarchy(odsRoot).sum((d) => d.value);

  console.log(newroot);
  // we are creating a sunburst chart and we want to add the init and end radius to each element in the hierarchy
  const partition = d3.partition().size([2 * Math.PI, radius.level3]);
  partition(newroot);

  return newroot;
});

// build chart:
const radius = {
  inner: 45,
  level1: 105,
  level2: 135,
  level3: 180,
};
const radiusArray = [radius.inner, radius.level1, radius.level2, radius.level3];

const arc = d3
  .arc()
  .startAngle(function (d) {
    return d.x0;
  })
  .endAngle(function (d) {
    return d.x1;
  })
  .innerRadius(function (d) {
    return radiusArray[d.depth - 1];
  })
  .outerRadius(function (d) {
    return radiusArray[d.depth];
  });

function showText(d) {
  //console.log(d);
  if (d === undefined || d.x1 === undefined || d.x0 === undefined) return false;
  return d.x1 - d.x0 > 0.2;
}

const x = computed(() =>
  d3
    .scaleBand()
    .domain(dataHierarchy.value.map((d) => d.tag))
    .range([0, 2 * Math.PI])
    .align(0)
);

const y = computed(() =>
  d3.scaleRadial().domain([0, 1]).range([radius.inner, outerRadius.value])
);

// interactivity
const selectedSubtopic = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

function onMouseOver(event, d) {
  selectedSubtopic.value = d;
  tooltipPosition.value = { x: event.pageX, y: event.pageY };
  emits('update:globalSelectedSubtopic', d.data.name);
}
function onMouseOut(event, d) {
  selectedSubtopic.value = null;
  emits('update:globalSelectedSubtopic', null);
}
</script>

<style lang="scss" scoped>
.simple-tooltip {
  position: absolute;
  z-index: 10;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
}
path:hover {
  opacity: 0.8;
}

path.active {
  filter: brightness(1.2);
  stroke: #111;
  stroke-width: 2px;
}

.simple-tooltip {
  transition: all 0.3s ease;
  background-color: #222;
  color: white;
  padding: 8px;
}
</style>
