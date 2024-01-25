<template>
  <div class="o-grid__col u-4 u-relative" ref="scannerRadialOdsOnctainer">
    <div class="container-sunburst">
      <ScannerRadialOds
        :result="result"
        :styles="styles"
        @update:globalSelectedSubtopic="globalSelectedSubtopic = $event"
        :globalSelectedSubtopic="globalSelectedSubtopic"
        :availableWidth="scannerRadialOdsWidth"
      ></ScannerRadialOds>
    </div>
  </div>
  <div class="o-grid__col u-1">&nbsp;</div>
  <div class="o-grid__col u-7" ref="scannerListContainer">
    <ScannerListViz
      :result="result"
      :styles="styles"
      @update:globalSelectedSubtopic="globalSelectedSubtopic = $event"
      :globalSelectedSubtopic="globalSelectedSubtopic"
      :availableWidth="scannerListWidth"
    >
    </ScannerListViz>
  </div>
</template>

<script>
import ScannerListViz from './ScannerListViz.vue';
import ScannerRadialOds from './ScannerRadialOds.vue';
export default {
  components: {
    ScannerListViz,
    ScannerRadialOds,
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
    };
  },
  mounted: function () {
    this.scannerListWidth = this.$refs.scannerListContainer.offsetWidth - 32;
    console.log(this.scannerListWidth);
    this.scannerRadialOdsWidth =
      this.$refs.scannerRadialOdsOnctainer.offsetWidth;
  },
};
</script>

<style lang="scss" scoped>
.container-sunburst {
  position: sticky;
  top: 0;
  left: 0;
}
</style>
