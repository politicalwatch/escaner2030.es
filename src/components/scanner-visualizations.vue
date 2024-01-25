<template>
  <div>
    <div>
      <h5>{{ $t('components.scannerVisualizations.title') }}:</h5>
      <div class="o-grid">
        <scanner-list-viz-container :styles="styles" :result="result">
        </scanner-list-viz-container>
      </div>
      <div class="o-grid">
        <div class="o-grid__col u-12 u-6@sm">
          <ScannerLegend
            :result="result"
            :isFirst="true"
            :styles="styles"
          ></ScannerLegend>
        </div>
        <div class="o-grid__col u-12 u-6@sm">
          <ScannerLegend
            :result="result"
            :isFirst="false"
            :styles="styles"
          ></ScannerLegend>
        </div>
        <div class="o-grid__col u-12 u-6@sm u-padding-top-4">
          <ScannerSunburst :result="result" :styles="styles"></ScannerSunburst>
          <tipi-message type="info" icon>{{
            $t('components.scannerVisualizations.zoom')
          }}</tipi-message>
        </div>
        <div class="o-grid__col u-12 u-6@sm u-padding-top-4 u-text-center">
          <ScannerWordsCloud
            :result="result"
            :maxResults="tagsInWordCloud"
            :styles="styles"
          ></ScannerWordsCloud>
          <tipi-message type="info" icon>
            {{
              $t('components.scannerVisualizations.maxShown', {
                num: tagsInWordCloud,
              })
            }}</tipi-message
          >
        </div>
      </div>
    </div>
    <div v-if="$i18n.locale === 'es'" class="u-padding-top-10">
      <h5>{{ $t('components.scannerVisualizations.compare.title') }}</h5>
      <tipi-message type="info" icon>{{
        $t('components.scannerVisualizations.compare.info')
      }}</tipi-message>
      <div class="c-select-label u-block">
        <label for="topic">{{
          $t('components.scannerVisualizations.compare.label')
        }}</label>
        <multiselect
          v-model="textToCompare"
          :loading="isLoadingDocuments"
          :options="compareOptions"
          @search-change="searchDocuments"
          name="pre-scanned-text"
          id="pre-scanned-text"
          :placeholder="
            $t('components.scannerVisualizations.compare.placeholder')
          "
        >
          <template v-slot:noOptions>{{
            $t('components.scannerVisualizations.compare.empty')
          }}</template>
        </multiselect>
      </div>
      <ScannerBarchart
        :result="this.result"
        :resultToCompare="resultToCompare"
        :styles="styles"
      ></ScannerBarchart>
    </div>

    <div class="u-padding-top-10">
      <h5>{{ $t('components.scannerVisualizations.detailed.title') }}</h5>
      <p v-if="result.topics.length > 9">
        {{
          $t('components.scannerVisualizations.detailed.infoLength', {
            num: result.tags.length,
          })
        }}
      </p>
      <p v-else>
        {{ $t('components.scannerVisualizations.detailed.info') }}
      </p>
      <ScannerTable :result="result"></ScannerTable>
    </div>

    <div class="o-grid__col u-12 u-margin-top-4">
      <json-excel
        :data="csvItems"
        id="downloadCSV"
        type="xls"
        class="c-button c-button--icon-right c-button--primary"
      >
        {{ $t('components.scannerVisualizations.detailed.button') }}
        <span class="c-icon c-icon--type-download"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="16"
            fill="none"
            viewBox="0 0 12 16"
          >
            <path
              fill="#2D4252"
              d="M12 5.647H8.571V0H3.43v5.647H0l6 6.588 6-6.588zm-12 8.47V16h12v-1.882H0z"
            ></path>
          </svg>
        </span>
      </json-excel>
      <tipi-message type="info" icon>
        {{ $t('components.scannerVisualizations.detailed.downloadInfo') }}
      </tipi-message>
    </div>
  </div>
</template>

<script>
import { TipiMessage, TipiCsvDownload } from '@politicalwatch/tipi-uikit';
import ScannerWordsCloud from '@/components/scanner-wordscloud.vue';
import ScannerSunburst from '@/components/scanner-sunburst.vue';
import ScannerBarchart from '@/components/scanner-barchart.vue';
import ScannerTable from '@/components/scanner-table.vue';
import ScannerLegend from '@/components/scanner-legend.vue';
import ScannerListVizContainer from '@/components/ScannerList/ScannerListVizContainer.vue';
import Multiselect from 'vue-multiselect';
import preScannedTexts from '@/scanned';
import config from '@/config';
import JsonExcel from 'vue-json-excel3';
import api from '@/api';

export default {
  name: 'ScannerVisualizations',
  components: {
    TipiMessage,
    TipiCsvDownload,
    ScannerWordsCloud,
    ScannerSunburst,
    ScannerBarchart,
    ScannerTable,
    ScannerLegend,
    ScannerListVizContainer,
    Multiselect,
    JsonExcel,
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    },
  },
  data() {
    return {
      preScannedTexts: preScannedTexts,
      resultToCompare: null,
      textToCompare: null,
      csvItems: this.result.tags,
      scanned: {},
      tagsInWordCloud: 25,
      styles: config.STYLES[this.$i18n.locale],
      isLoadingDocuments: false,
      documents: [],
      compareOptions: [],
      globalSelectedSubtopic: null,
      scannerListWidth: null,
      scannerRadialOdsWidth: null,
    };
  },
  methods: {
    searchDocuments(query) {
      if (query.length <= 1) {
        return;
      }

      this.isLoadingDocuments = true;
      api.searchScanned(query).then((response) => {
        this.documents = response ? response : [];
        this.compareOptions = [];
        this.documents.forEach((document) => {
          this.compareOptions.push(document.title);
        });
        this.isLoadingDocuments = false;
      });
    },
  },
  watch: {
    textToCompare(val) {
      const compareWith = this.documents.filter((d) => d.title === val);
      this.resultToCompare = compareWith.length ? compareWith[0] : null;
    },
  },
};
</script>

<style lang="scss">
.c-select-label {
  .multiselect {
    .multiselect__option--highlight {
      background-color: white;
      &:hover {
        background-color: #2d4252;
        color: white;
      }

      &.multiselect__option--selected {
        color: white;
      }
    }
  }
}
</style>
