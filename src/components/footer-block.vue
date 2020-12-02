<template>
  <div>
    <div id="footer" class="o-container o-container--fluid o-section u-bg-white">

      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-3@sm u-margin-top-4">
            <p class="u-text-overline">Desarrollado por</p>
            <a href="http://politicalwatch.es" target="_blank"><img src="/img/logo-politicalwatch.png" class="big" alt="Logo de Political Watch"></a>
          </div>
          <div class="o-grid__col u-8@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">Con el apoyo de</p>
            <div class="o-grid">
              <div class="o-grid__col u-7@sm">
                <a href="http://www.exteriores.gob.es/Portal/es/Ministerio/SecretariosDeEstado/SecretariaDeEstadoCooperacionInternacional/Paginas/Inicio.aspx" target="_blank"><img src="/img/maeuec-seci.jpg" class="big" alt="Logo de la Secretaria de Estado de Cooperación (Ministerio de Asuntos Exteriores, Unión Europea y Cooperación) del Gobierno de España"></a>
              </div>
              <div class="o-grid__col u-5@sm">
                <a href="https://www.actua.ad/es/" target="_blank"><img src="/img/logo-actua-color.jpg" class="big" alt="Logo de ACTUA Tech"></a>
              </div>
            </div>
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">{{ (new Date() ).getFullYear() }} Political Watch - Algunos derechos reservados</p>
          </div>
        </div>
      </div>

    </div>

    <div class="c-decorator" style="background-image: url('/img/multicolor.jpg')"></div>

    <cookie-law theme="base" buttonText="Entendido" buttonClass="c-button c-button--primary" message="Esta página utiliza cookies para asegurarte una mejor experiencia web."></cookie-law>

  </div>
</template>

<script>
  import CookieLaw from 'vue-cookie-law';
  import { TipiIcon } from 'tipi-uikit';

  export default {
    name: "footer-block",
    components: {
      CookieLaw,
      TipiIcon
    }
  }
</script>

<style scoped lang="scss">
#footer {
  .o-container {
    border-top: 1px solid #ddd;
  }
}
</style>
