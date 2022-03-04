<template>
  <div>
    <!-- Hero -->
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            {{hostname}}
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            On this page you can view information about your server and edit it
          </h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Configuration" rounded header-bg content-full>

        <b-form @submit.stop.prevent="edit_server">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="hostname" name="hostname"
                            placeholder="Hostname" aria-describedby="hostname-feedback"
                            v-model="hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_number" name="CPU_number"
                            placeholder="CPU cores" aria-describedby="CPU_number-feedback"
                            v-model="hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_load" name="CPU_load"
                            placeholder="CPU load" aria-describedby="CPU_load-feedback"
                            v-model="CPU_load">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_load" name="memory_load"
                            placeholder="Memory load" aria-describedby="memory_load-feedback"
                            v-model="memory_load">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_usage" name="memory_usage"
                            placeholder="Memory usage" aria-describedby="memory_usage-feedback"
                            v-model="memory_usage">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="requests_amount" name="requests_amount"
                            placeholder="Requests amount" aria-describedby="requests_amount-feedback"
                            v-model="requests_amount">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="latency" name="latency"
                            placeholder="Latency" aria-describedby="latency-feedback"
                            v-model="latency">
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button variant="alt-warning" class="mr-1 mb-3">
                <i class="fa fa-fw fa-exclamation-triangle mr-1"></i> Edit Servers
              </b-button>
            </b-col>
            <div class="mr-sm-3">
              <b-button variant="alt-danger" :to="'/delete-server/' + id" v-click-ripple>
                <i class="fa fa-plus-square opacity-50 mr-1"></i> Delete Server
              </b-button>
            </div>
          </b-row>
        </b-form>
      </base-block>
    </div>

    <!-- END Page Content -->
  </div>
</template>

<script>

export default {
  data () {
    return {
      id: 4,
      hostname: "test_hostname",
      CPU_number: "3",
      CPU_load: "1283.09",
      memory_load: "647.78",
      memory_usage: "16.3",
      requests_amount: "88",
      latency: "0.16"
    }
  },
  methods: {
    async edit_server () {

    },
    async delete_server() {

    }
  }
}
</script>
