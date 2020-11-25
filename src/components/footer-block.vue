<template>
  <div>
    <div id="footer" class="o-container o-container--fluid o-section u-bg-white">

      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-7@sm u-margin-top-4">
            <p class="u-text-overline">Impulsat per</p>
            <div class="o-grid">
              <div class="o-grid__col u-4@sm">
                <a href="http://www.consellgeneral.ad/" target="_blank"><img src="/img/logo-consellgeneral-color.jpg" class="big" alt="Logo del Consell General del Principat d'Andorra"></a>
              </div>
              <div class="o-grid__col u-4@sm">
                <a href="https://www.govern.ad/" target="_blank"><img src="/img/logo-governandorra-color.jpg" class="big" alt="Logo del Govern d'Andorra"></a>
              </div>
              <div class="o-grid__col u-4@sm">
                <a href="https://www.iea.ad/" target="_blank"><img src="/img/logo-IEA-color.jpg" class="big" alt="Logo de l'Institut d'Estudis Andorrans"></a>
              </div>
              <div class="o-grid__col u-4@sm">
                <a href="https://www.observatorisocial.ad/" target="_blank"><img src="/img/logo-observatori-color.jpg" class="big" alt="Logo de l'Observatori Social d'Andorra"></a>
              </div>
              <div class="o-grid__col u-4@sm">
                <a href="https://www.actua.ad/" target="_blank"><img src="/img/logo-actua-color.jpg" class="big" alt="Logo de la Iniciativa Actua"></a>
              </div>
            </div>
          </div>
          <div class="o-grid__col u-4@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">Desenvolupat per</p>
            <a href="http://politicalwatch.es" target="_blank"><img src="/img/logo-politicalwatch.png" class="big" alt="Logo de Political Watch" width="75%"></a>
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">EscànerODS.ad &copy; {{ (new Date() ).getFullYear() }}</p>
          </div>
        </div>
      </div>

    </div>

    <div class="c-decorator" style="background-image: url('/img/multicolor.jpg')"></div>

    <cookie-law theme="base" buttonText="Entès" buttonClass="c-button c-button--primary" message="Aquesta pàgina utilitza cookies per assegurar-vos una millor experiència web."></cookie-law>

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
