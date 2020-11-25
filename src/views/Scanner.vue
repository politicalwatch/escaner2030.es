<template>
  <div>
    <div id="scanner" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Escàner"/>

        <div class="o-grid u-margin-bottom-4">
          <div class="o-grid__col u-12 u-6@sm">
            <tipi-message type="info" icon><div v-html="'L\'EscànerODS et permet detectar i visualitzar la presència dels diferents Objectius de Desenvolupament Sostenible (ODS) en qualsevol text.'"></div></tipi-message>
          </div>

          <div class="o-grid__col u-12 u-6@sm">
            <p><textarea placeholder="Enganxa aquí el text que vulguis escanejar..." v-model="inputText" rows="9"/></p>
            <div class="c-input-label c-input-label--file u-block">
              <label for="file">Puja un arxiu</label>
              <input type="file" id="file" name="file" v-on:change="loadSelectedFile" placeholder="PDF, doc o txt">
              <small class="u-color-secondary">La mida màxima dels fitxers suportats és de 20 MB.</small><br>
              <small class="u-color-secondary">pdf, txt, doc, docx, odt, xls, xlsx, ppt, pptx, jpg, png, gif, html</small>
            </div>
            <p>
            <a id="start" class="c-button c-button--primary" @click.prevent="annotate">Escanejar</a>
            <a class="c-button" :class="{ disabled: inProgress }" v-if="hasInput" @click="cleanTextAndResult">Netejar</a>
            </p>
          </div>
        </div>

        <div id="result" class="o-section o-grid">
          <div v-if="inProgress || errors" class="o-grid__col u-12">
            <tipi-message v-if="errors" type="error" icon>{{errors}}</tipi-message>
            <tipi-loader v-if="inProgress" title="Escanejant document" :subtitle="subtitle" />
          </div>
          <div class="o-grid__col u-12 result" v-if="result">

            <tipi-message v-if="!result.topics.length" type="error" icon>No hem trobat cap coincidència entre el teu text i les nostres etiquetes.</tipi-message>

            <div v-else>

              <scanner-visualizations :result="result"></scanner-visualizations>

            </div>

            <!-- Begin CTAs -->
            <div class="o-grid o-grid--wide o-grid--center u-bg-primary-light u-padding-top-8 u-padding-bottom-8 u-margin-top-8" v-if="result.topics.length">
              <div class="o-grid__col u-12 u-12@xs u-10@sm u-text-center">
                <h5>Desa el resultat</h5>
                <p>Pots tornar a accedir als resultats del teu text escanejat sense necessitat de descarregar-te l'arxiu. En desar el resultat, se't generarà un enllaç que pots conservar i visitar sempre que el necessitis.</p>
                <a @click="saveResult" class="c-button c-button--primary">Desar</a>
              </div>
            </div>
            <!-- End CTAs -->

          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { TipiMessage, TipiHeader, TipiLoader } from 'tipi-uikit';
import ScannerVisualizations from '@/components/scanner-visualizations.vue';
import swal from 'sweetalert2';
import api from '@/api';

const VueScrollTo = require('vue-scrollto');

export default {
  name: 'scanner',
  components: {
    TipiHeader,
    TipiMessage,
    TipiLoader,
    ScannerVisualizations
  },
  data() {
    return {
      inputText: '',
      inputFile: null,
      result: null,
      errors: null,
      inProgress: false,
      estimatedTime: 0,
      csvItems: [],
      csvFields: ['topic', 'subtopic', 'tag', 'times'],
      excerptText: '',
      scanned: {},
      tagsInWordCloud: 25,
    };
  },
  computed: {
    subtitle () {
      return this.estimatedTime ? `Trigarem aproximadament ${this.estimatedTime} segons en presentar-te els resultats. No marxis...` : "Tingues paciència. Estem treballant de valent."
    },
    hasInput () {
      return this.inputText!='' || this.inputFile!=null
    }
  },
  methods: {
    cleanText() {
      this.inputText = ""
      this.inputFile = null
      document.getElementById("file").value = "";
    },
    cleanResult() {
      this.result = null
      this.errors = null
    },
    cleanTextAndResult() {
      this.cleanText()
      this.cleanResult()
    },
    loadSelectedFile(event) {
      this.inputFile = event.target.files[0]
    },
    annotate() {
      this.cleanResult();
      this.inProgress = true;
      document.getElementById('start').text = 'En procés...'
      api.annotate(this.inputText, this.inputFile)
        .then(response => {
          if (response.data.status==="SUCCESS") {
            this.result = response.data.result
            this.excerptText = response.data.excerpt
            this.inProgress = false;
            document.getElementById('start').text = 'Escanejar'
            VueScrollTo.scrollTo('#result', 1500)
          } else if (response.data.status==="PROCESSING") {
            this.estimatedTime = response.data.estimated_time
            setTimeout(() => {
              this.getAsyncResults(response.data.task_id)
            }, response.data.estimated_time * 1000);
          }
        })
        .catch(error => {
          if (error.response.status == 429) this.errors = "Has sobrepassat el límit d'escanejos per hora. Torna a intentar-ho d'aquí una estona."
          else if (error.response.status == 413) this.errors = "Fitxer massa pesat per processar-lo. Proveu amb un altre més lleuger."
          else this.errors = error.response.data.message
          this.inProgress = false;
          document.getElementById('start').text = 'Escanejar'

        });
    },
    saveResult: function() {
      swal({
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'Desar',
        confirmButtonAriaLabel: 'Desar',
        confirmButtonColor: '#d64949',
        cancelButtonText: 'Cancel·lar',
        cancelButtonAriaLabel: 'Cancel·lar',
        html:
          '<label for="scan-name"><h4>Anomena\'l</h4></label>' +
          '<input id="scan-name" type="text"></input>' +
          '<label class="scan-expiration-label" for="scan-expiration"><h4>S\'esborrarà en:</h4></label>' +
          '<select id="scan-expiration">' +
            '<option value="1m" selected>Un mes</option>' +
            '<option value="3m">Tres mesos</option>' +
            '<option value="1y">Un any</option>' +
          '</select>',
        preConfirm: () => {
          const name = swal.getPopup().querySelector('#scan-name').value
          const expiry = swal.getPopup().querySelector('#scan-expiration').value
          if (!name || !expiry) {
            swal.showValidationMessage('Si us plau, ompl el formulari')
          }
          return { name, expiry }
        }
      })
        .then(({ value }) => {
          api.saveScanned(value.name, value.expiry, this.excerptText, this.result)
            .then(response => {

              swal({
                title: 'Desat!',
                text: 'Text escanejat desat satisfactòriament',
                html:
                  '<p>Text escanejat desat satisfactòriament</p>' +
                  '<input id="url-to-copy" value="' + window.location.origin + '/scanner/' + response.data.id + '" readonly />',
                focusConfirm: false,
                confirmButtonClass: 'clipboard-button',
                confirmButtonText: 'Còpia enllaç i continuar',
                confirmButtonAriaLabel: 'Còpia enllaç i continuar',
                confirmButtonColor: '#d64949',
                type: 'success',
                onOpen: () => {
                    const clipboard = new ClipboardJS(".clipboard-button", {
                        target: (trigger) => document.getElementById('url-to-copy')
                    })
                }
              }).then(function (){
                this.scanned.title = response.data.title
                this.scanned.excerpt = response.data.excerpt
                this.$router.replace({
                  name: 'scanned',
                  params: {
                    id: response.data.id
                  }
                });
              }.bind(this, response.data));

            })
            .catch(
              error => {
                const limited = error.response.status === 429;
                swal({
                  title: limited ? 'Límit per hora excedit ' : 'Error en desar el text escanejat',
                  text: 'Intenta-ho de nou més tard',
                  focusConfirm: false,
                  type: 'error'
                });
              }
            );

        })
        .catch(error => {
          this.errors = error
        });
    },
    getAsyncResults: function(taskID) {
      api.getScannerResult(taskID).then(response => {
        if (response.data.status==="SUCCESS") {
          this.result = response.data.result
          this.excerptText = response.data.excerpt
          this.inProgress = false;
          document.getElementById('start').text = 'Iniciar procés'
          VueScrollTo.scrollTo('#result', 1500)
        } else if (response.data.status==="PENDING") {
          setTimeout(() => {
            this.getAsyncResults(taskID)
          }, 3000);
        }
      }).catch(() => {
        setTimeout(() => {
          this.getAsyncResults(taskID)
        }, 3000);
      })
    }
  }
};
</script>

<style lang="scss">
  #scan-expiration {
    width: 100%;
    height: 56px;
    background: white;
    border: solid 1px #9cb0bf;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='rgb(156,176,191)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: 14px;
    padding: 10px;
  }

  .scan-expiration-label h4 {
      margin-top: 15px;
  }

  #url-to-copy {
    height: 53px;
    margin-right: 1px;
    width: 100%;
  }
</style>
