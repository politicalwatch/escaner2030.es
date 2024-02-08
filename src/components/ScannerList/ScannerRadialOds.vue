<template>
  <div class="relative">
    <svg class="radialView" :width="width" :height="canvasHeight">
      <g :transform="`translate(${width / 2}, ${canvasHeight / 2})`">
        <path
          v-for="d in dataHierarchy.descendants().filter((d) => d.depth > 0)"
          :key="d.name"
          :d="arc(d)"
          :fill="d.data.color"
          :stroke="d.depth === 3 ? '#fff' : 'transparent'"
          :class="`depth-` + d.depth + ' ' + getClassesForHovered(d)"
          @mouseover="onMouseOver($event, d)"
          @mouseleave="onMouseOut($event, null)"
          @click="onClick($event, d)"
        ></path>
        <text
          v-for="d in dataHierarchy
            .descendants()
            .filter(
              (d) => d.depth < 3 && showText(d) && !isNaN(arc.centroid(d)[0])
            )"
          :key="d.name"
          :transform="`translate(${arc.centroid(d)})`"
          :dy="0"
          :dx="0"
          text-anchor="middle"
          :font-size="d.depth === 1 ? '14px' : '10px'"
          fill="#fff"
          font-weight="600"
          pointer-events="none"
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
          <div class="tooltip-content">
            <div class="codes-indicators">
              <div
                class="ods-number"
                :style="{
                  'background-color': selectedSubtopic.data.color,
                }"
              >
                {{ selectedSubtopic.data.level1 }}
              </div>
              <div
                v-if="selectedSubtopic.depth > 1"
                class="meta-number"
                :style="{
                  'background-color': selectedSubtopic.data.color,
                }"
              >
                {{ selectedSubtopic.data.level2 }}
              </div>
            </div>
            <div class="codes-labels">
              <div>{{ selectedSubtopic.parent.tag }}</div>
              <div>{{ selectedSubtopic.data.name }}</div>
            </div>
            <div class="tag-count">
              {{ selectedSubtopic.value }}
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// d3 functions coming from : https://observablehq.com/@yieldtactics/radial-stacked-bar-chart
import * as d3 from 'd3';
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
  mouseOverElement: {
    type: Object || null,
    default: null,
  },
  clickedArray: {
    type: Array,
    default: () => [],
  },
});

const margin = 40;

const emits = defineEmits(['update:mouseOverElement', 'update:clickedElement']);

const width = computed(() => {
  return Math.min(props.availableWidth, 500);
});
const canvasHeight = computed(() => {
  return width.value;
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
    ods.level1 = ods.code;
    ods.level2 = '';
    if (!ods) return;

    const subtopic = ods.children.find(
      (subtopic) => subtopic.subtopic === tag.subtopic
    );
    if (subtopic) {
      subtopic.children.push({
        name: tag.tag,
        value: tag.times,
        color: ods.color,

        level1: ods.code,
        level2: subtopic.level2,
      });
    } else {
      // add subtopic to ods
      ods.children.push({
        code: tag.subtopic.split(' ')[0],
        level1: ods.code,
        level2: tag.subtopic.split(' ')[0].split('.')[1],
        name: tag.subtopic,
        subtopic: tag.subtopic,
        children: [
          {
            name: tag.tag,
            value: tag.times,
            color: ods.color,
            level1: ods.code,
            level2: tag.subtopic.split(' ')[0].split('.')[1],
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

  // we are creating a sunburst chart and we want to add the init and end radius to each element in the hierarchy
  const partition = d3.partition().size([2 * Math.PI, radius.level3]);
  partition(newroot);

  return newroot;
});

// build chart:
const radius = computed(() => {
  return {
    inner: ((45 / 180) * width.value) / 2,
    level1: ((105 / 180) * width.value) / 2,
    level2: ((135 / 180) * width.value) / 2,
    level3: ((180 / 180) * width.value) / 2,
  };
});
const radiusArray = computed(() => [
  radius.value.inner,
  radius.value.level1,
  radius.value.level2,
  radius.value.level3,
]);

const arc = d3
  .arc()
  .startAngle(function (d) {
    return d.x0;
  })
  .endAngle(function (d) {
    return d.x1;
  })
  .innerRadius(function (d) {
    return radiusArray.value[d.depth - 1];
  })
  .outerRadius(function (d) {
    return radiusArray.value[d.depth];
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
  tooltipPosition.value = getRealPosition(event.pageX, event.pageY); // { x: event.pageX, y: event.pageY };
  emits('update:mouseOverElement', {
    name: d.data.name,
    level: d.depth,
    level1: d.data.level1,
    level2: d.data.level2,
    source: 'radial',
  });
}
// this function considers the screen width and height and adjusts the tooltip position to avoid it to be cut by the screen
function getRealPosition(x, y) {
  const tooltipWidth = 400;
  const tooltipHeight = 100;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  if (x + tooltipWidth > windowWidth) x = windowWidth - tooltipWidth;
  if (y + tooltipHeight > windowHeight) y = windowHeight - tooltipHeight;
  return { x, y };
}
function onMouseOut(event, d) {
  selectedSubtopic.value = null;
  emits('update:mouseOverElement', null);
}
function onClick(event, d) {
  if (d.depth != 1) return;
  selectedSubtopic.value = d;
  //  tooltipPosition.value = { x: event.pageX, y: event.pageY };
  tooltipPosition.value = getRealPosition(event.pageX, event.pageY); // { x: event.pageX, y: event.pageY };

  emits('update:clickedElement', {
    name: d.data.name,
    level: d.depth,
    level1: d.data.level1,
    level2: d.data.level2,
    source: 'radial',
  });
}

function getClassesForHovered(d) {
  // nothing selected
  let classes = '';
  if (!props.mouseOverElement && !props.clickedArray.length) {
    if (d.depth === 3) return 'hoveredOut';
    else return '';
  }
  // clicked
  if (props.clickedArray.length) {
    const clickedArray = props.clickedArray;
    for (let i = 0; i < props.clickedArray.length; i++) {
      const clickedElement = props.clickedArray[i];
      const clickedLevel = clickedElement.level;
      if (clickedLevel === 1) {
        if (clickedElement.level1 === d.data.level1) classes += 'active';
      }
      if (clickedLevel === 2) {
        if (
          clickedElement.level2 === d.data.level2 &&
          clickedElement.level1 === d.data.level1
        )
          classes += 'active';
      }
      if (clickedLevel === 3)
        if (d.data.name === clickedElement.name) classes += 'active';
    }
    if (classes === '') classes += 'inactive';
  }

  if (props.mouseOverElement) {
    const level = props.mouseOverElement.level;
    if (level === 1) {
      if (props.mouseOverElement.level1 === d.data.level1) return 'hovered';
    }
    if (level === 2) {
      if (
        props.mouseOverElement.level2 === d.data.level2 &&
        props.mouseOverElement.level1 === d.data.level1
      )
        return 'hovered';
    }
    if (level === 3) {
      if (d.data.name == props.mouseOverElement.name) {
        return 'hovered';
      }
    }

    classes += ' hoveredOut';
  }
  return classes;
}
</script>

<style lang="scss" scoped>
.radialView {
  path.depth-1 {
    cursor: pointer;
  }
  path {
    transition: all 0.3s ease;
  }
}
.simple-tooltip {
  position: absolute;
  z-index: 10;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
}
path:hover,
path.hovered {
  opacity: 0.8;
}

path.active {
  filter: brightness(1.2);
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 2px;
}

.simple-tooltip {
  transition: all 0.3s ease;
  background-color: #222;
  color: white;
  padding: 16px;
  min-height: 40px;
  min-width: 300px;
  .tooltip-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .codes-indicators {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
  .codes-labels {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-weight: 600;
    max-width: 400px;
  }

  .ods-number {
    display: flex;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
    line-height: 32px;
  }
  .meta-number {
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
    border-radius: 100%;
    line-height: 32px;
  }
  .tag-count {
    width: 48px;
    height: 48px;
    border-radius: 100%;
    border-color: white;
    border-style: dashed;
    padding: 8px;
    text-align: center;
    font-weight: bold;
    line-height: 30px;
  }
}

.hoveredOut,
.inactive {
  fill: #efefef !important;
}
</style>
