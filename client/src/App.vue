<template>
  <div id="app">
    <v-nav></v-nav>
    <FlashMessage :position="'right top'"></FlashMessage>
    <img class="monitoring-icon" alt="Vue logo" src="./assets/monitoring_icon.png">
    <v-main-wrapper></v-main-wrapper>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vMainWrapper from './components/v-main-wrapper';
import VNav from "./components/partials/v-nav";
import VFooter from "./components/partials/v-footer";

export default {
  name: 'App',
  components: {
    vMainWrapper,
    VNav,
    VFooter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.monitoring-icon {
  max-width: 300px;
  max-height: 300px;
  margin: 30px;
}

</style>
