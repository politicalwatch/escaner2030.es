export default {
  SHORTNAME: process.env.VUE_APP_SHORTNAME || 'p2030',
  URL: process.env.VUE_APP_BACKEND_URL || 'http://localhost:5000',
  USE_ALERTS: process.env.VUE_APP_USE_ALERTS || false,
  MENU: [
    {
      route: 'scanner',
      name: 'Escáner',
      condition: true,
    },
    {
      route: 'about',
      name: 'Acerca',
      condition: true,
    },
  ],
  DISCLAIMER: {
    name: '',
  },
  LOGO: '/img/logo.png',

  DEFAULT_PAGE_TITLE: 'Escáner2030 - Escanea cualquier texto en clave ODS',
  DEFAULT_METATAGS: [
    {
      name: 'description',
      content: 'Escáner2030 analiza y etiqueta en segundos cualquier texto que le proporciones en clave de Agenda 2030, ofreciendo visualizaciones sobre la presencia de los diferentes Objetivos de Desarrollo Sostenible (ODS).'
    },
    {
      name: 'keywords',
      content: 'Agenda 2030, ODS, Objetivos de Desarrollo Sostenible, Escáner2030, Naciones Unidas'
    },
    {
      itemprop: 'image',
      content: 'http://escaner2030.es/img/logo.png'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:url',
      content: 'http://escaner2030.es'
    },
    {
      name: 'twitter:title',
      content: 'Escáner2030 - Escanea cualquier texto en clave ODS'
    },
    {
      name: 'twitter:description',
      content: 'Escáner2030 analiza y etiqueta en segundos cualquier texto que le proporciones en clave de Agenda 2030, ofreciendo visualizaciones sobre la presencia de los diferentes Objetivos de Desarrollo Sostenible (ODS).'
    },
    {
      name: 'twitter:creator',
      content: '@_PoliticalWatch'
    },
    {
      name: 'twitter:image:src',
      content: 'http://escaner2030.es/img/logo.png'
    },
    {
      property: 'og:title',
      content: 'Escáner2030 - Escanea cualquier texto en clave ODS'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://www.escaner2030.es'
    },
    {
      property: 'og:image',
      content: 'http://escaner2030.es/img/logo.png'
    },
    {
      property: 'og:description',
      content: 'Escáner2030 analiza y etiqueta en segundos cualquier texto que le proporciones en clave de Agenda 2030, ofreciendo visualizaciones sobre la presencia de los diferentes Objetivos de Desarrollo Sostenible (ODS).'
    },
    {
      property: 'og:site_name',
      content: 'Escáner2030'
    },
  ],
  STYLES: {
    topics: {
      "ODS 1 Fin de la pobreza": {
        shortname: "ODS 1",
        color: "#eb1c2d",
        image: "ods-1.svg",
      },
      "ODS 2 Hambre cero": {
        shortname: "ODS 2",
        color: "#d3a029",
        image: "ods-2.svg",
      },
      "ODS 3 Salud y bienestar": {
        shortname: "ODS 3",
        color: "#4c9f38",
        image: "ods-3.svg",
      },
      "ODS 4 Educación de calidad": {
        shortname: "ODS 4",
        color: "#c52333",
        image: "ods-4.svg",
      },
      "ODS 5 Igualdad de género": {
        shortname: "ODS 5",
        color: "#ed4135",
        image: "ods-5.svg",
      },
      "ODS 6 Agua limpia y saneamiento": {
        shortname: "ODS 6",
        color: "#00aed9",
        image: "ods-6.svg",
      },
      "ODS 7 Energía asequible y no contaminante": {
        shortname: "ODS 7",
        color: "#fdb713",
        image: "ods-7.svg",
      },
      "ODS 8 Trabajo decente y crecimiento económico": {
        shortname: "ODS 8",
        color: "#8f1838",
        image: "ods-8.svg",
      },
      "ODS 9 Industria, innovación e infraestructura": {
        shortname: "ODS 9",
        color: "#f06a38",
        image: "ods-9.svg",
      },
      "ODS 10 Reducción de las desigualdades": {
        shortname: "ODS 10",
        color: "#dd1367",
        image: "ods-10.svg",
      },
      "ODS 11 Ciudades y comunidades sostenibles": {
        shortname: "ODS 11",
        color: "#f69c39",
        image: "ods-11.svg",
      },
      "ODS 12 Producción y consumo responsables": {
        shortname: "ODS 12",
        color: "#cf8d2a",
        image: "ods-12.svg",
      },
      "ODS 13 Acción por el clima": {
        shortname: "ODS 13",
        color: "#48773e",
        image: "ods-13.svg",
      },
      "ODS 14 Vida submarina": {
        shortname: "ODS 14",
        color: "#007dbc",
        image: "ods-14.svg",
      },
      "ODS 15 Vida de ecosistemas terrestres": {
        shortname: "ODS 15",
        color: "#5cb84d",
        image: "ods-15.svg",
      },
      "ODS 16 Paz, justicia e instituciones sólidas": {
        shortname: "ODS 16",
        color: "#02558b",
        image: "ods-16.svg",
      },
      "ODS 17 Alianzas para lograr los objetivos": {
        shortname: "ODS 17",
        color: "#183668",
        image: "ods-17.svg",
      },
      "no-topic": {
        shortname: "Sin relación con la Agenda2030"
      }
    },
    subtopics: {
      "1.1 Erradicar la pobreza extrema": {
        color: "#eb1c2d",
        image: "ods-01.svg",
      },
      "1.2 Niveles nacionales de pobreza": {
        color: "#eb1c2d",
        image: "ods-01.svg",
      },
    },
    defaultColor: "#cecece",
    defaultImage: "placeholder.png",
  },
}
