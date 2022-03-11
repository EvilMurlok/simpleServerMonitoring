<template>
  <p>HERE WILL BE SIDEBAR!</p>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "v-sidebar",
  computed: {
    ...mapGetters(["IS_LOGGED_IN"])
  },

}
</script>

<style>

</style>