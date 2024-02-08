<template>
  <div class="o-grid u-margin-bottom-4">
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
    <div class="o-grid__col u-5@sm u-4@lg u-12 u-relative u-margin-top-8">
      <div
        class="container-sunburst u-margin-bottom-10"
        ref="scannerRadialOdsContainer"
      >
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
    <div class="o-grid__col u-1 u-hide u-block@lg">&nbsp;</div>
    <div class="o-grid__col u-7@sm u-12" ref="scannerListContainer">
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
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  unmounted: function () {
    window.removeEventListener('resize', this.handleResize);
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

    handleResize() {
      this.scannerListWidth = this.$refs.scannerListContainer.offsetWidth - 32;
      this.scannerRadialOdsWidth =
        this.$refs.scannerRadialOdsContainer.offsetWidth;
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
