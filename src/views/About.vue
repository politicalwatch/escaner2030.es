<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Fita"/>
      <div class="o-grid">
        <div class="o-grid__col u-8@sm u-offset-2@sm">
          <p>EscànerODS.ad és una innovadora eina que permet identificar, dins de textos o documents, aquelles expressions que es puguin relacionar amb part dels Objectius de Desenvolupament Sostenible (ODS). L'eina ha estat dissenyada per identificar dins dels textos, informació relacionada amb els ODS gràcies a un avançat sistema d'etiquetatge automàtic massiu. És aquesta una versió beta de l'eina, on només es tractaran els ODS 4, 5 i 10.</p>
          <h4>Com funciona?</h4>
          <p>EscànerODS.ad disposa d'una base de dades de terminologia associada als ODS que, mitjançant un procés automàtic d'etiquetatge massiu, classifica les expressions dels textos introduïts, d'acord amb la seva relació amb les fites dels ODS. Després, mitjançant una interfície intuïtiva, atractiva i accessible, ofereix tota la informació rellevant en format reutilitzable. Els usuaris poden carregar els seus textos o documents per realitzar un escaneig adaptat a les seves necessitats.</p>
          <h4>Pot adaptar-se a altres països?</h4>
          <p>Sí, l'eina ha estat dissenyada perquè la seva adaptació sigui possible. La tecnologia d'EscànerODS.ad utilitza programari lliure i codi obert, això permet la seva adaptació a altres països i nivells de l'administració pública, responent a les necessitats de cada context.</p>
          <h4>Qui som?</h4>
          <p>EscànerODS.ad és un projecte de CIECODE/Political Watch, un think and do tank espanyol, en col·laboració amb diferents institucions andorranes, com són Actua Innovació, Consell General d'Andorra, Institut d'Estudis Andorrans, Observatori de la Sostenibilitat d'Andorra i Govern d'Andorra. La tasca de les institucions andorranes ha estat la traducció i adaptació de la terminologia pròpia dels ODS, a la casuística de l'entorn andorrà. La missió de CIECODE/Political Watch és generar, allà on treballen, unes condicions favorables pel disseny, adopció i implementació de polítiques públiques que promoguin una societat més justa, equitativa i sostenible. CIECODE/Political Watch desenvolupa tecnologies innovadores que automàticament, rastregen l'activitat relacionada amb el desenvolupament sostenible i que ofereixen accés a aquesta informació de forma pública, directa i gratuïta.</p>
          <h4>D'on venim?</h4>
          <p>EscànerODS.ad és una adaptació de TiPi, una eina digital implementada a Espanya des del 2015, que monitora tota l'activitat parlamentària de 21 temàtiques relacionades amb la lluita contra la pobresa i la desigualtat. TiPi (que respon a les sigles de Transparència + Informació + Participació + Influència) és un altre projecte innovador de Political Watch que genera dades obertes i fomenta la transparència, l'accés a informació i la rendició de comptes polítics mitjançant el monitoratge parlamentari de les 21 temàtiques estratègicament seleccionades.</p>
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
