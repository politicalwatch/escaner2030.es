module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_variables.scss";`,
        implementation: require('sass'),
      },
    },
  },
};
