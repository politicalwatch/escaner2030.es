<template>
  <div class="o-grid__col u-12 u-margin-bottom-4">
    <ScannerListOds
      :result="result"
      :styles="styles"
      :mouseOverElement="hoveredObject"
      :clicked-array="clickedArray"
      @update:mouseOverElement="hoveredObject = $event"
      @update:clickedElement="manageClickedArray($event)"
    ></ScannerListOds>
  </div>
  <div
    class="o-grid__col u-4 u-relative u-margin-top-8"
    ref="scannerRadialOdsOnctainer"
  >
    <div class="container-sunburst u-margin-bottom-10">
      <ScannerRadialOds
        :result="result"
        :styles="styles"
        :mouseOverElement="hoveredObject"
        :availableWidth="scannerRadialOdsWidth"
        :clicked-array="clickedArray"
        @update:mouseOverElement="hoveredObject = $event"
        @update:clickedElement="manageClickedArray($event)"
      ></ScannerRadialOds>
    </div>
  </div>
  <div class="o-grid__col u-1">&nbsp;</div>
  <div class="o-grid__col u-7" ref="scannerListContainer">
    <ScannerListViz
      :result="result"
      :styles="styles"
      @update:mouseOverElement="hoveredObject = $event"
      @update:clickedElement="manageClickedArray($event)"
      :mouseOverElement="hoveredObject"
      :availableWidth="scannerListWidth"
      :clicked-array="clickedArray"
    >
    </ScannerListViz>
  </div>
</template>

<script>
import ScannerListViz from './ScannerListViz.vue';
import ScannerRadialOds from './ScannerRadialOds.vue';
import ScannerListOds from './ScannerListOds.vue';
export default {
  components: {
    ScannerListViz,
    ScannerRadialOds,
    ScannerListOds,
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    },
    styles: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      globalSelectedSubtopic: null,
      scannerListWidth: null,
      scannerRadialOdsWidth: null,
      hoveredObject: null,
      /*{
        name: '',
        level: 0, // 1 2 3
        level1: '',
        level2: '',
        source: '0', // list or radial
      },*/
      clickedArray: [],
    };
  },
  mounted: function () {
    this.hoveredObject = null;
    this.scannerListWidth = this.$refs.scannerListContainer.offsetWidth - 32;
    console.log(this.scannerListWidth);
    this.scannerRadialOdsWidth =
      this.$refs.scannerRadialOdsOnctainer.offsetWidth;
  },
  methods: {
    manageClickedArray(clickedObject) {
      if (clickedObject === null) {
        this.clickedArray = [];
        return;
      }
      const clickedobj = this.clickedArray.find(
        (element) => element.name === clickedObject.name
      );
      if (clickedobj) {
        const index = this.clickedArray.indexOf(clickedobj);
        this.clickedArray.splice(index, 1);
      } else {
        this.clickedArray.push(clickedObject);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container-sunburst {
  position: sticky;
  top: 24px;
  left: 0;
}
</style>
