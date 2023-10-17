import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import VueGtag from 'vue-gtag';
import '@politicalwatch/tipi-uikit/src/styles/main.scss';
import messages from '@/i18n/messages';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

let SENTRY_DSN = import.meta.env.VUE_APP_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });
}

const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE || 'es',
  messages,
});

const app = createApp(App);
app.use(i18n);
app.use(router);
app.use(createPinia());
app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_GA_ID },
    boootstrap: false,
  },
  router
);

app.mount('#app');
