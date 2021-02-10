<template>
  <div id="app">
    <DesignCenter />
  </div>
</template>

<script>
  import DesignCenter from './components/design-center'

  export default {
    name: 'App',
    components: {
      DesignCenter
    }
  }
</script>

<style lang="scss">
  // Normalize default styles across browsers,
  // https://necolas.github.io/normalize.css/
  @import '~normalize.css/normalize.css';

  html {
    overflow-x: auto !important;
  }

  html,
  body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  // ===
  // Vendor
  // ===

  #nprogress .bar {
    background: #ffd46b;
  }

  #app {
    display: flex;
    width: 100%;
    height: 100%;
    transition: 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  #app > div:only-child {
    width: 100%;
    min-width: 100%;
    min-height: 100%;
  }
</style>
