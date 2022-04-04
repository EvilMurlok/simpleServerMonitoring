<template>
  <div id="page-messages"
       style="cursor: pointer"
       @click="visibility = false"
  >
    <b-alert v-if="message_data.type === 'warning' && visibility === true"
             variant="warning"
             class="d-flex align-items-center justify-content-between"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-exclamation-circle mr-3"></i>
      </div>
      <div class="flex-fill mr-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>

    <b-alert v-else-if="message_data.type === 'success' && visibility === true"
             variant="success"
             class="d-flex align-items-center"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-check mr-3"></i>
      </div>
      <div class="flex-fill ml-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>

    <b-alert v-else-if="message_data.type === 'info' && visibility === true"
             variant="info"
             class="d-flex align-items-center"
             show
    >
      <div class="flex-00-auto">
        <i class="fa fa-fw fa-info-circle mr-3"></i>
      </div>
      <div class="flex-fill ml-3">
        <p class="mb-0">{{ message_data.item.text }}</p>
      </div>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: "BaseMessage",
  props: {
    message_data: {
      type: Object,
      default() {
        return {type: "warning", item: {}};
      }
    }
  },
  data() {
    return {
      visibility: true
    }
  },

  created() {
    this.visibility = true;
  }
}
</script>