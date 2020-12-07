<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Acerca"/>
      <div class="o-grid">
        <div class="o-grid__col u-8@sm u-offset-2@sm">
          <p><b>Escáner2030</b> es una innovadora herramienta que permite identificar y etiquetar de manera automática textos y documentos en clave de Agenda 2030 y sus 17 Objetivos de Desarrollo Sostenible.</p>
          <h4>¿Cómo funciona?</h4>
          <p><b>Escáner2030</b> dispone de una base de conocimiento compuesta por terminología asociada a los ODS que permite, mediante un proceso automático de etiquetado masivo, clasificar las expresiones de los textos introducidos, de acuerdo con su relación con los ODS y sus respectivas metas.</p>
          <p>Una vez realizado este etiquetado, y a través de una interfaz intuitiva, atractiva y accesible, se ofrece toda la información en un formato reutilizable. Esto permite que los y las usuarias puedan cargar sus textos y/o documentos para realizar un escaneo adaptado a sus necesidades.</p>
          <h4>¿Puede adaptarse a otros países?</h4>
          <p>Sí, la herramienta ha sido diseñada para que su adaptación sea posible. La tecnología utilizada en <b>Escáner2030</b> está construida utilizando software libre y código abierto, lo cual permite que su adaptación a otros países o a otros contextos (académicos, administración pública, entre otros) sea posible de manera rápida y respondiendo a las necesidades propias de cada contexto.</p>
          <h4>¿Quiénes somos?</h4>
          <p><b>Escáner2030</b> es un proyecto de <a href="https://politicalwatch.es" target="_blank">Political Watch</a>, un think-and-do tank español. La misión de Political Watch es generar, allá donde trabajamos, unas condiciones favorables para el diseño, adopción e implementación de políticas públicas que promuevan una sociedad más justa, equitativa y sostenible. Political Watch desarrolla tecnologías innovadoras que permiten automatizar los procesos de búsqueda de información y actividad política relacionada con el desarrollo sostenible y que ofrecen acceso a esta información de forma pública, directa y gratuita.</p>
          <h4> ¿Quiénes nos han apoyado?</h4>
          <p>Para el desarrollo de este proyecto ha sido fundamental la colaboración de dos entidades: la <a href="http://www.exteriores.gob.es/Portal/es/Ministerio/SecretariosDeEstado/SecretariaDeEstadoCooperacionInternacional/Paginas/Inicio.aspx" target="_blank">Secretaría de Estado de Cooperación Internacional</a> del Ministerio de Asuntos Exteriores, Unión Europea y Cooperación del Gobierno de España y <a href="https://www.actua.ad/es/" target="_blank">Actua Innovació</a>, hub tecnológico y de conocimiento, que promueve la investigación y la innovación en Andorra.
          <h4>¿De dónde venimos?</h4>
          <p><b>Escáner2030</b> es una adaptación de <a href="https://tipiciudadano.es" target="_blank">TiPi Ciudadano</a>, una herramienta digital implementada en España desde 2015, que monitoriza toda la actividad parlamentaria del Congreso de los Diputados en relación a 22 temáticas ligadas a la lucha contra la pobreza y la desigualdad. Otras herramientas desarrolladas por Political Watch con la misma tecnología son <a href="https://parlamento2030.es" target="_blank">Parlamento2030</a> y <a href="http://ods.congreso.gov.py/" target="_blank">Congreso2030Py</a>.</p>
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
