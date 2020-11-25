<template>
  <div>
    <div>
      <h5>Distribució dels resultats:</h5>

      <div class="o-grid">
        <div class="o-grid__col u-6 u-padding-bottom-4">
          <ScannerLegend :result="result" :isFirst="true" :styles="styles"></ScannerLegend>
        </div>
        <div class="o-grid__col u-6 u-padding-bottom-4">
          <ScannerLegend :result="result" :isFirst="false" :styles="styles"></ScannerLegend>
        </div>
        <div class="o-grid__col u-12 u-6@sm">
          <ScannerSunburst :result="result" :styles="styles"></ScannerSunburst>
          <tipi-message type="info" icon>Pots fer zoom fent clic a cadascuna de les porcions.</tipi-message>
        </div>
        <div class="o-grid__col u-12 u-6@sm u-text-center">
          <ScannerWordsCloud :result="result" :maxResults="tagsInWordCloud" :styles="styles"></ScannerWordsCloud>
          <tipi-message type="info" icon>Es mostra un màxim de {{tagsInWordCloud}} termes</tipi-message>
        </div>
      </div>
    </div>
    <div class="u-padding-top-10">
      <h5>Compara els resultats:</h5>
      <tipi-message type="info" icon>Selecciona un text de referència, entre els que tenim carregats en el nostre sistema, per a poder comparar amb els resultats del teu text etiquetat.</tipi-message>
      <div class="c-select-label u-block">
        <label for="topic">Comparar amb...</label>
        <multiselect
          v-model="textToCompare"
          :loading="isLoadingDocuments"
          :options="compareOptions"
          @search-change="searchDocuments"
          name="pre-scanned-text" id="pre-scanned-text" placeholder="Selecciona un">
            <template v-slot:noOptions>Llistat buit</template>
        </multiselect>
      </div>
      <ScannerBarchart :result="this.result" :resultToCompare="resultToCompare" :styles="styles"></ScannerBarchart>
    </div>

    <div class="u-padding-top-10">
      <h5>Resultats detallats:</h5>
      <p v-if="result.topics.length>9">Es mostren només 10 resultats de {{result.topics.length}}, per veure la resta descarregueu l'arxiu.</p>
      <p v-if="result.topics.length<9">També podeu obtenir les dades descarregant-vos l'arxiu.</p>
      <ScannerTable :result="result"></ScannerTable>
    </div>

    <div class="o-grid__col u-12 u-margin-top-4">
      <export-excel
        :data="csvItems"
        class="c-button c-button--icon-right c-button--primary"
      >
        Descarrega els teus resultats
        <span class="c-icon c-icon--type-download"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="none" viewBox="0 0 12 16"><path fill="#2D4252" d="M12 5.647H8.571V0H3.43v5.647H0l6 6.588 6-6.588zm-12 8.47V16h12v-1.882H0z"></path></svg></span>
      </export-excel>
      <tipi-message type="info" icon>Els resultats es descarregaran en format Excel.</tipi-message>
    </div>
  </div>
</template>

<script>
import { TipiMessage, TipiCsvDownload } from 'tipi-uikit';
import ScannerWordsCloud from '@/components/scanner-wordscloud.vue';
import ScannerSunburst from '@/components/scanner-sunburst.vue';
import ScannerBarchart from '@/components/scanner-barchart.vue';
import ScannerTable from '@/components/scanner-table.vue';
import ScannerLegend from '@/components/scanner-legend.vue';
import Multiselect from 'vue-multiselect';
import preScannedTexts from '@/scanned';
import config from '@/config';
import Vue from 'vue'
import excel from 'vue-excel-export'
import api from '@/api'

Vue.use(excel)

export default {
  name: "ScannerVisualizations",
  components: {
    TipiMessage,
    TipiCsvDownload,
    ScannerWordsCloud,
    ScannerSunburst,
    ScannerBarchart,
    ScannerTable,
    ScannerLegend,
    Multiselect,
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    }
  },
  data() {
    return {
      preScannedTexts: preScannedTexts,
      resultToCompare: null,
      textToCompare: null,
      csvItems: this.result.tags,
      scanned: {},
      tagsInWordCloud: 25,
      styles: config.STYLES,
      isLoadingDocuments: false,
      documents: [],
      compareOptions: [],
    };
  },
  methods: {
    searchDocuments(query) {
      if (query.length <= 1) {
        return
      }

      this.isLoadingDocuments = true
      api.searchScanned(query).then(response => {
        this.documents = response ? response: []
        this.compareOptions = []
        this.documents.forEach(document => {
          this.compareOptions.push(document.title)
        })
        this.isLoadingDocuments = false
      })
    }
  },
  watch: {
    textToCompare(val) {
      const compareWith = this.documents.filter(d => d.title === val);
      this.resultToCompare = compareWith.length
        ? compareWith[0]
        : null;
    }
  }
}
</script>
