import { createRouter, createWebHistory } from 'vue-router';
import Scanner from '@/views/Scanner.vue';
import Scanned from '@/views/Scanned.vue';
import About from '@/views/About.vue';
import Page404 from '@/views/Page404.vue';
import config from '@/config';

const routes = [
  {
    path: '/',
    name: 'scanner',
    component: Scanner,
  },
  {
    path: '/scanner/:id',
    name: 'scanned',
    component: Scanned,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Page404',
    component: Page404,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;
  else document.title = config.DEFAULT_PAGE_TITLE[config.DEFAULT_LOCALE];

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
    (el) => el.parentNode.removeChild(el)
  );

  let metaTags = !nearestWithMeta
    ? config.DEFAULT_METATAGS[config.DEFAULT_LOCALE]
    : nearestWithMeta.meta.metaTags;

  if (nearestWithMeta) {
    metaTags = metaTags.filter((obj, pos, arr) => {
      return (
        arr.map((mapObj) => mapObj['name']).indexOf(obj['name']) === pos ||
        arr.map((mapObj) => mapObj['property']).indexOf(obj['property']) === pos
      );
    });
  }

  metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
