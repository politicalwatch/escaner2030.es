
<template>
    <g :transform="`translate(0, ${group.y})`">     
        <circle r="12" cx="12" cy="-4" fill="#fafafa"></circle>    
        <circle r="6" cx="12" cy="-4" :fill="getColorForTopic(group.topic)" @click="expandMe"></circle>
        <text x="32">{{IdAndName.id  }}</text>
        <text x="80"> {{  IdAndName.name }} </text>
        <g :transform="`translate(${availableWidth-miniBar.width}, 0)`">
            
            <!-- bg rect-->
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
                fill="#000">
            </rect>
          
            
        </g>
        <!-- expansion-->
        <g v-for=" (tag,index2) in group.children" :transform="`translate(0, ${tag.y})`" v-if="group.expanded">
            <text x="80" y="-4">
                {{ tag.tag }}
            </text>
            <path :d="getPathForIndex(tag,index2)" class="link"></path>
            <line x1="80" y1="" :x2="availableWidth" y2="0" stroke="#eee" stroke-width="1"></line>
            <g class="tagCount" :transform="`translate(${availableWidth-interTopicPosition},${0})`" >
                <circle
                    class="normal"
                    :r="radiusScale(tag.times)"
                    :cx="0"
                    :cy="0"
                ></circle>
                <circle
                    class="outline"
                    :r="interTopicPosition"
                    :cx="0"
                    :cy="0"
                ></circle>
                <text
                    :x="0"
                    :y="0"
                    fill="white"
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    {{ group.times }}
                </text>
            </g>
        </g>
    </g>
</template>

<script setup>
import { computed,ref } from 'vue';
import { linkHorizontal, scaleSqrt, scaleLinear } from 'd3';
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
    margin: 10
}
const miniBarScale = computed(() => {
    return scaleLinear()
        .domain([0, props.maxSubtopicsCount])
        .range([0, miniBar.width])
})

const IdAndName = computed(() => {
    const id = props.group.groupTagLabel.split(' ')
    return {
        id: id[0],
        name: props.group.groupTagLabel.split(' ').slice(1).join(' ')
    }
})

const emits = defineEmits(['expandSubtopic', 'update:globalSelectedSubtopic']);
function expandMe() {
    emits('expandSubtopic', props.group)
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
    x: 80,
    y: 0,
  };
  const startingPoint = {
    x: 12,
    y: -tag.y,
  };
  return link({ source: startingPoint, target: endingPoint });
}

const radiusScale = computed(() => {
  return scaleSqrt()
    .domain([0, props.maxTagsCount])
    .range([3, props.interTopicPosition - 4]);
});
</script>

<style lang="scss" scoped>


path.link {
  stroke: #d5d5d5;
  fill: none;
}
path.link.active,


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

</style>