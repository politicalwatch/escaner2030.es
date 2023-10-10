import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import '@politicalwatch/tipi-uikit/src/styles/main.scss';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

let SENTRY_DSN = import.meta.env.VUE_APP_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });
}

const app = createApp(App);
app.use(router);
app.use(store);

app.mount('#app');
