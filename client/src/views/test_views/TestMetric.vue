<template>
  <b-button variant="danger" class="mr-1" @click.prevent="incCounter" v-click-ripple>
    CLICK ME NOW!
  </b-button>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "TestMetric",
  methods: {
    ...mapActions(['SET_USERNAME', 'SET_USER_ID', 'SET_LOGGED_IN']),
    incCounter() {
      this.$http.post(`/increment-counter`)
    }
  },

}
</script>