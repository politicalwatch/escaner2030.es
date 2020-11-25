<template>
  <div>
    <div id="footer" class="o-container o-container--fluid o-section u-bg-white">

      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-7@sm u-margin-top-4">
            <!--<p class="u-text-overline">Impulsat per</p>-->
            <!--<div class="o-grid">-->
              <!--<div class="o-grid__col u-4@sm">-->
                <!--<a href="http://www.consellgeneral.ad/" target="_blank"><img src="/img/logo-consellgeneral-color.jpg" class="big" alt="Logo del Consell General del Principat d'Andorra"></a>-->
              <!--</div>-->
            <!--</div>-->
          </div>
          <div class="o-grid__col u-4@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">Desarrollado por</p>
            <a href="http://politicalwatch.es" target="_blank"><img src="/img/logo-politicalwatch.png" class="big" alt="Logo de Political Watch" width="75%"></a>
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">Escáner2030.es &copy; {{ (new Date() ).getFullYear() }}</p>
          </div>
        </div>
      </div>

    </div>

    <div class="c-decorator" style="background-image: url('/img/multicolor.jpg')"></div>

    <cookie-law theme="base" buttonText="Entès" buttonClass="c-button c-button--primary" message="Esta página utiliza cookies para asegurarte una mejor experiencia web."></cookie-law>

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
