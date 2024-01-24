<template>
  <div class="relative">
    <svg class="radialView" :width="availableWidth" :height="canvasHeight">
      <g :transform="`translate(${availableWidth / 2 -margin}, ${availableWidth / 2})`">
        <g v-for="(ods, index) in dataHierarchy" :key="index">
          <path v-if="ods.times === 0"
            :d="arcEmptyOds(ods)"
            :fill="'#F4F4F4'"
            @mouseover="selectedOds = ods"
            @mouseleave="selectedOds = null"
        
          ></path>
          <path v-for = "(subtopic, index2) in ods.children" :key="index2"
            :d="arc(subtopic)"
            :fill="subtopic.color"
            stroke-width="1"
            stroke="#fff"
            @mouseover="$event => onMouseOver($event, subtopic)"
            @mouseleave="onMouseOut($event, null)"
            :class="{
                active: globalSelectedSubtopic == subtopic.subtopic,
            }"
            >
        </path>
        </g>
      </g>
    </svg>
    <div class="simple-tooltip"  v-show="selectedSubtopic"
    :style="{ top: tooltipPosition.y + 'px', left: tooltipPosition.x + 'px' }"
    >
        <div v-if="selectedSubtopic">
            <div>{{ selectedSubtopic.parent.tag }}</div>
            <div>Meta: {{ selectedSubtopic.subtopic }}</div>
            <div>{{ selectedSubtopic.times }} {{ selectedSubtopic.times==1?'aparicion':'apariciones' }} de tags relacionados</div>
        </div>
        
    </div>
  </div>
</template>

<script setup>
// d3 functions coming from : https://observablehq.com/@yieldtactics/radial-stacked-bar-chart
import * as d3 from 'd3';
window.dd3 = d3;
import { computed,ref } from 'vue';
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

const radius={
  inner:45,
  level1: 105,
  level2: 135,
  level3:180
}

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
    if (!ods) {
      return;
    }
    const subtopic = ods.children.find(
      (subtopic) => subtopic.subtopic === tag.subtopic
    );
    if (subtopic) {
      subtopic.times += tag.times;
    } else {
      ods.children.push({
        parent: ods,
        subtopic: tag.subtopic,
        times: tag.times,
      });
    }
    ods.times += tag.times;
  });

  // add a y position to each subtopic (the y position is the sum of the y position of the ods and the y position of the previous subtopic)
  odsList.forEach((ods) => {
    let y0 = 0;
    ods.children.forEach((subtopic,i) => {
        subtopic.timesRelative = subtopic.times / ods.times;
      subtopic.y0 = y0;
      y0 += subtopic.timesRelative;
      subtopic.index = i;
    });
  });

  // now create a colour scale for each subtopic. The colour scale has a domain from 0 to the number of subtopics of the ods and a range of varying hues of the ods colour
    odsList.forEach((ods) => {
        ods.children.forEach((subtopic) => {
        subtopic.color = d3.interpolateHcl(
            ods.color,
            d3.rgb(ods.color).brighter(1.5)
        )(subtopic.index / ods.children.length);
        });
    });
  return odsList;
});

// build chart:
const innerRadius = 50;
const outerRadius = computed(() => props.availableWidth / 2 - margin)
const arc = computed(() =>
  d3
    .arc()
    .innerRadius((d) => y.value(d.y0))
    .outerRadius((d) => y.value(d.y0 + d.timesRelative))
    .startAngle((d) => x.value(d.parent.tag))
    .endAngle((d) => x.value(d.parent.tag) + x.value.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
);

const arcEmptyOds = computed(() =>
  d3
    .arc()
    .innerRadius((d) => innerRadius)
    .outerRadius((d) => outerRadius.value)
    .startAngle((d) => x.value(d.tag))
    .endAngle((d) => x.value(d.tag) + x.value.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
);

const x = computed(() =>
  d3
    .scaleBand()
    .domain(dataHierarchy.value.map((d) => d.tag))
    .range([0, 2 * Math.PI])
    .align(0)
);

const y = computed(() =>
  d3
    .scaleRadial()
    .domain([0,1])
    .range([innerRadius, outerRadius.value])
);


// interactivity
const selectedSubtopic = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

function onMouseOver (event, d) {
  selectedSubtopic.value = d;
  tooltipPosition.value = { x: event.pageX, y: event.pageY };
  emits('update:globalSelectedSubtopic', d.subtopic);
};
function onMouseOut (event, d) {
  selectedSubtopic.value = null;
  emits('update:globalSelectedSubtopic', null);
};
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
path:hover{
    opacity: 0.8;
}

path.active{
    filter: brightness(1.2);
    stroke: #111;
    stroke-width: 2px;
}

.simple-tooltip{
    transition: all 0.3s ease;
    background-color: #222;
    color:white;
    padding:8px;
}
</style>
