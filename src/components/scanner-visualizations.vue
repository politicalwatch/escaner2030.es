<template>
  <div>
    <div>
      <h5>Distribución de los resultados:</h5>

      <div class="o-grid">
        <div class="o-grid__col u-6 u-padding-bottom-4">
          <ScannerLegend :result="result" :isFirst="true" :styles="styles"></ScannerLegend>
        </div>
        <div class="o-grid__col u-6 u-padding-bottom-4">
          <ScannerLegend :result="result" :isFirst="false" :styles="styles"></ScannerLegend>
        </div>
        <div class="o-grid__col u-12 u-6@sm">
          <ScannerSunburst :result="result" :styles="styles"></ScannerSunburst>
          <tipi-message type="info" icon>Puedes hacer zoom haciendo clic en cada una de las porciones.</tipi-message>
        </div>
        <div class="o-grid__col u-12 u-6@sm u-text-center">
          <ScannerWordsCloud :result="result" :maxResults="tagsInWordCloud" :styles="styles"></ScannerWordsCloud>
          <tipi-message type="info" icon>Se muestran un máximo de {{tagsInWordCloud}} términos.</tipi-message>
        </div>
      </div>
    </div>
    <div class="u-padding-top-10">
      <h5>Compara los resultados:</h5>
      <tipi-message type="info" icon>Selecciona un texto de referencia, entre los que tenemos cargados en nuestro sistema, para poder comparar con los resultados de tu texto etiquetato.</tipi-message>
      <div class="c-select-label u-block">
        <label for="topic">Comparar con...</label>
        <multiselect
          v-model="textToCompare"
          :loading="isLoadingDocuments"
          :options="compareOptions"
          @search-change="searchDocuments"
          name="pre-scanned-text" id="pre-scanned-text" placeholder="Selecciona uno">
            <template v-slot:noOptions>Listado vacío</template>
        </multiselect>
      </div>
      <ScannerBarchart :result="this.result" :resultToCompare="resultToCompare" :styles="styles"></ScannerBarchart>
    </div>

    <div class="u-padding-top-10">
      <h5>Resultados detallados:</h5>
      <p v-if="result.topics.length>9">Se muestran solo 10 resultados de {{result.topics.length}}, para ver el resto descarga el archivo.</p>
      <p v-if="result.topics.length<9">También puedes obtener los datos descargando el archivo.</p>
      <ScannerTable :result="result"></ScannerTable>
    </div>

    <div class="o-grid__col u-12 u-margin-top-4">
      <export-excel
        :data="csvItems"
        class="c-button c-button--icon-right c-button--primary"
      >
        Descarga tus resultados
        <span class="c-icon c-icon--type-download"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="none" viewBox="0 0 12 16"><path fill="#2D4252" d="M12 5.647H8.571V0H3.43v5.647H0l6 6.588 6-6.588zm-12 8.47V16h12v-1.882H0z"></path></svg></span>
      </export-excel>
      <tipi-message type="info" icon>Los resultados se descargarán en formato Excel.</tipi-message>
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
