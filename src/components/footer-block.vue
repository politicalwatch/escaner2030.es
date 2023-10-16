<template>
  <div>
    <div
      id="footer"
      class="o-container o-container--fluid o-section u-bg-white"
    >
      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-3@sm u-margin-top-4">
            <p class="u-text-overline">{{ $t('common.footer.developedBy') }}</p>
            <a href="http://politicalwatch.es" target="_blank"
              ><img
                src="/img/logo-politicalwatch.png"
                class="big"
                alt="Logo de Political Watch"
            /></a>
          </div>
          <div class="o-grid__col u-8@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">{{ $t('common.footer.supportedBy') }}</p>
            <div class="o-grid">
              <div class="o-grid__col u-7@sm">
                <a
                  href="http://www.exteriores.gob.es/Portal/es/Ministerio/SecretariosDeEstado/SecretariaDeEstadoCooperacionInternacional/Paginas/Inicio.aspx"
                  target="_blank"
                  ><img
                    src="/img/maeuec-seci.jpg"
                    class="big"
                    alt="Logo de la Secretaria de Estado de Cooperación (Ministerio de Asuntos Exteriores, Unión Europea y Cooperación) del Gobierno de España"
                /></a>
              </div>
              <div class="o-grid__col u-5@sm">
                <a href="https://www.actua.ad/es/" target="_blank"
                  ><img
                    src="/img/logo-actua-color.jpg"
                    class="big"
                    alt="Logo de ACTUA Tech"
                /></a>
              </div>
            </div>
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">
              {{ new Date().getFullYear() }} Political Watch - Algunos derechos
              reservados
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="c-decorator"
      style="background-image: url('/img/multicolor.jpg')"
    ></div>

    <vue-cookie-accept-decline
      :debug="false"
      :disableDecline="true"
      :showPostponeButton="false"
      elementId="cookiePanel"
      ref="cookiePanel"
      transitionName="slideFromBottom"
      type="floating"
    >
      <template #message>
        {{ $t('common.cookies.info') }}
      </template>
      <template #acceptContent>{{ $t('common.cookies.accept') }}</template>
    </vue-cookie-accept-decline>
  </div>
</template>

<script>
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import { TipiIcon } from '@politicalwatch/tipi-uikit';

export default {
  name: 'footer-block',
  components: {
    VueCookieAcceptDecline,
    TipiIcon,
  },
};
</script>

<style scoped lang="scss">
.cookie {
  position: fixed;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 9999;
  background: #f1f1f1;
  color: #232323;
  padding: 1.25em;
  bottom: 0;
  left: 0;
  right: 0;
}
.cookie__floating__wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row;
}

#footer {
  .o-container {
    border-top: 1px solid #ddd;
  }
}
</style>
