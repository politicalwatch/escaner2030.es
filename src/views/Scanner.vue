<template>
  <div>
    <div id="scanner" class="o-container o-section u-margin-bottom-10">
      <tipi-header
        :title="t('scanner.title')"
        :subtitle="t('scanner.subtitle')"
      />

      <div class="o-grid u-margin-bottom-4">
        <div class="o-grid__col u-12 u-6@sm">
          <tipi-message type="info" icon>
            <div v-html="t('scanner.info')"></div>
          </tipi-message>
        </div>

        <div class="o-grid__col u-12 u-6@sm">
          <p>
            <textarea
              :placeholder="t('scanner.form.placeholder')"
              v-model="inputText"
              rows="9"
            />
          </p>
          <div class="c-input-label c-input-label--file u-block">
            <label for="file"
              >{{ t('scanner.form.file') }}
              <input
                type="file"
                id="file"
                name="file"
                @change="loadSelectedFile"
                placeholder="PDF, doc o txt"
              />
              <small class="u-color-secondary">{{
                t('scanner.form.weight')
              }}</small
              ><br />
              <small class="u-color-secondary">pdf, txt, doc, docx, pptx</small>
            </label>
          </div>
          <p>
            <button
              id="start"
              class="c-button c-button--primary"
              :disabled="!hasInput || inProgress"
              @click.prevent="annotate"
            >
              {{
                this.inProgress
                  ? t('scanner.form.buttonProgress')
                  : t('scanner.form.button')
              }}
            </button>
            <button
              class="c-button"
              :class="{ disabled: inProgress }"
              v-if="hasInput"
              @click.prevent="cleanTextAndResult"
            >
              Limpiar
            </button>
          </p>
        </div>
      </div>

      <div id="result" class="o-section o-grid">
        <div v-if="inProgress || errors" class="o-grid__col u-12">
          <tipi-message v-if="errors" type="error" icon>{{
            errors
          }}</tipi-message>
          <tipi-loader
            v-if="inProgress"
            :title="t('scanner.result.scanning')"
            :subtitle="subtitle"
          />
        </div>
        <div class="o-grid__col u-12 result" v-if="result">
          <tipi-message v-if="!result.topics.length" type="error" icon>
            {{ t('scanner.result.notFound') }}
          </tipi-message>

          <div v-else>
            <scanner-visualizations :result="result" />
          </div>

          <!-- Begin CTAs -->
          <div
            class="o-grid o-grid--wide o-grid--center u-bg-primary-light u-padding-top-8 u-padding-bottom-8 u-margin-top-8"
            v-if="result.topics.length"
          >
            <div class="o-grid__col u-12 u-12@xs u-10@sm u-text-center">
              <h5>{{ t('scanner.save.title') }}</h5>
              <p>
                {{ t('scanner.save.body') }}
              </p>
              <a @click="saveResult" class="c-button c-button--primary">
                {{ t('scanner.save.button') }}
              </a>
            </div>
          </div>
          <!-- End CTAs -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  TipiMessage,
  TipiHeader,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';
import ScannerVisualizations from '@/components/scanner-visualizations.vue';
import Swal from 'sweetalert2';
import VueScrollTo from 'vue-scrollto';
import api from '@/api';

const router = useRouter();
const { t } = useI18n();

const inputText = ref('');
const inputFile = ref(null);
const result = ref(null);
const errors = ref(null);
const inProgress = ref(false);
const estimatedTime = ref(0);
const excerptText = ref('');
const scanned = ref({});

const subtitle = computed(() => {
  return estimatedTime.value
    ? t('scanner.result.subtitle_estimated', {
        estimatedTime: estimatedTime.value,
      })
    : t('scanner.result.subtitle');
});

const hasInput = computed(() => {
  return inputText.value !== '' || inputFile.value !== null;
});

function cleanText() {
  inputText.value = '';
  inputFile.value = null;
  const fileElement = document.getElementById('file');
  if (fileElement) fileElement.value = '';
}

function cleanResult() {
  result.value = null;
  errors.value = null;
}

function cleanTextAndResult() {
  cleanText();
  cleanResult();
}

function loadSelectedFile(event) {
  inputFile.value = event.target.files[0] || null;
}

function annotate() {
  cleanResult();
  inProgress.value = true;

  api
    .annotate(inputText.value, inputFile.value)
    .then((response) => {
      if (response.data.status === 'SUCCESS') {
        result.value = response.data.result;
        excerptText.value = response.data.excerpt;
        inProgress.value = false;
        VueScrollTo.scrollTo('#result', 1500);
      } else if (response.data.status === 'PROCESSING') {
        estimatedTime.value = response.data.estimated_time;
        setTimeout(() => {
          getAsyncResults(response.data.task_id);
        }, response.data.estimated_time * 1000);
      }
    })
    .catch((error) => {
      if (error?.response?.status === 429) {
        errors.value =
          'Has sobrepasado el límite de escaneos por hora. Vuelve a intentarlo de aquí a un rato.';
      } else if (error?.response?.status === 413) {
        errors.value =
          'Archivo demasiado pesado para procesarlo. Prueba con uno más ligero.';
      } else {
        errors.value = error?.response?.data?.message || 'Error desconocido';
      }
      inProgress.value = false;
    });
}

function getAsyncResults(taskID) {
  api
    .getScannerResult(taskID)
    .then((response) => {
      if (response.data.status === 'SUCCESS') {
        result.value = response.data.result;
        excerptText.value = response.data.excerpt;
        inProgress.value = false;

        const startBtn = document.getElementById('start');
        if (startBtn) {
          startBtn.textContent = t('scanner.form.start');
        }

        VueScrollTo.scrollTo('#result', 1500);
      } else if (response.data.status === 'PENDING') {
        setTimeout(() => {
          getAsyncResults(taskID);
        }, 3000);
      }
    })
    .catch(() => {
      setTimeout(() => {
        getAsyncResults(taskID);
      }, 3000);
    });
}

function saveResult() {
  Swal.fire({
    focusConfirm: true,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    confirmButtonAriaLabel: 'Guardar',
    confirmButtonColor: '#d64949',
    cancelButtonText: 'Cancelar',
    cancelButtonAriaLabel: 'Cancelar',
    html:
      '<label for="scan-name"><h4>Ponle nombre</h4></label>' +
      '<input id="scan-name" type="text" />' +
      '<label class="scan-expiration-label" for="scan-expiration"><h4>Se borrará en:</h4></label>' +
      '<select id="scan-expiration">' +
      '<option value="1m" selected>Un mes</option>' +
      '<option value="3m">Tres meses</option>' +
      '<option value="1y">Un año</option>' +
      '</select>',
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#scan-name').value;
      const expiry = Swal.getPopup().querySelector('#scan-expiration').value;

      if (!name || !expiry) {
        Swal.showValidationMessage('Por favor, rellena el formulario');
      }
      return { name, expiry };
    },
  })
    .then(({ value }) => {
      api
        .saveScanned(value.name, value.expiry, excerptText.value, result.value)
        .then((response) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Texto escaneado guardado satisfactoriamente',
            html:
              '<p>Texto escaneado guardado satisfactoriamente</p>' +
              `<input id="url-to-copy" value="${window.location.origin}/scanner/${response.data.id}" readonly />`,
            focusConfirm: false,
            confirmButtonClass: 'clipboard-button',
            confirmButtonText: 'Copiar enlace y continuar',
            confirmButtonAriaLabel: 'Copiar enlace y continuar',
            confirmButtonColor: '#d64949',
            type: 'success',
            onOpen: () => {
              const clipboard = new ClipboardJS('.clipboard-button', {
                target: () => document.getElementById('url-to-copy'),
              });
            },
          }).then(() => {
            scanned.value.title = response.data.title;
            scanned.value.excerpt = response.data.excerpt;

            router.replace({
              name: 'scanned',
              params: {
                id: response.data.id,
              },
            });
          });
        })
        .catch((error) => {
          const limited = error?.response?.status === 429;
          Swal.fire({
            title: limited
              ? 'Límite por hora excedido '
              : 'Error al guardar el texto escaneado',
            text: 'Intentalo de nuevo más tarde',
            focusConfirm: false,
            type: 'error',
          });
        });
    })
    .catch((error) => {
      errors.value = error;
    });
}
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
