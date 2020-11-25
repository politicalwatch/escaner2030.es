<template>
  <div id="page404" class="o-container o-section u-margin-bottom-10">
    <div class="o-grid u-padding-top-10 u-padding-bottom-10">
      <div class="o-grid__col u-12 u-6@sm u-offset-3@sm u-text-center u-padding-top-10 u-padding-bottom-10">
        <h1>T'has perdut?</h1>
        <p>Torna a la pàgina d'inici per trobar el que realment estàs buscant</p>
        <router-link :to="{name:'search'}" class="btn btn-custom">Tornar l'inici</router-link>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Page404',
}
</script>

<style scoped lang="scss">
.container {
  padding: 80px 15px;
}
p {
  font-size: 1.2em;
}
</style>
