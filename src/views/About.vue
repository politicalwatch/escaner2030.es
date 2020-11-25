<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Acerca"/>
      <div class="o-grid">
        <div class="o-grid__col u-8@sm u-offset-2@sm">
          <p>Escáner2030.es es una innovadora herramienta que permite identificar, dentro de textos o documentos, aquellas expressionss que es puedan relacionar con parte de los Objectivos de Desarrollo Sostenible (ODS). La herramienta ha sido diseñada para identificar dentro de los textos, información relacionada con los ODS gracias a un avanzado sistema de etiquetado automático masivo.</p>
          <h4>¿Cómo funciona?</h4>
          <p>Escáner2030.es dispone de una base de datos de terminología asociada a los ODS que, mediante un proceso automático de etiquetado masivo, clasifica las expresiones de los textos introducidos, de acuerdo con su relación con los temas de los ODS. Después,mediantemitjançant una interfaz intuitiva, atractiva y accesible, ofrece tota la información relevante en formato reutilitzable. Los usuarios pueden cargar sus textos o documentos para realizar un escaneo adaptado a sus necesidades.</p>
          <h4>¿Puede adaptarse a otros países?</h4>
          <p>Sí, la herramienta ha sido diseñada para que su adaptación sea posible. La tecnología utilizada en Parlamento 2030 está construida utilizando software libre y código abierto, lo cual permite que su adaptación a otros países o a otros niveles de la administración pública sea posible de manera rápida y respondiendo a las necesidades propias de cada contexto.</p>
          <h4>¿Quiénes somos?</h4>
          <p>Escáner2030.es es un proyecto de Political Watch, un think and do tank español. La misión de Political Watch es generar, allá donde trabajamos, unas condicions favorables para el diseño, adopción e implementación de políticas públicas que promuevan una sociedad más justa, equitativa y sostenible. Political Watch desarrolla tecnologías innovadoras que automàticamente, rastrean la actividad relacionada con el desarrollo sostenible y que ofrecen acceso a esta información de forma pública, directa y gratuita.</p>
          <h4>¿De dónde venimos?</h4>
          <p>Escáner2030.es es una adaptación de TiPi, una herramienta digital implementada en España desde 2015, que monitoriza toda la actividad parlamentaria de 21 temáticas relacionadas con la lucha contra la pobreza y la desigualdad. TiPi (que responde a las siglas de Transparencia + Información + Participación + Influencia) es otro innovador proyecto de Political Watch que genera datos abiertos y fomenta la transparencia, el acceso a información y la rendición de cuentas política a través de la monitorización parlamentaria de las 21 temáticas estratégicamente seleccionadas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { TipiHeader } from 'tipi-uikit';

export default {
  name: 'about',
  components: {
    TipiHeader,
  },
}
</script>

<style scoped lang="scss">
</style>
