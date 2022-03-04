<template>
  <div>
    <!-- Hero -->
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            Add Server
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            On this page you can add your own server
          </h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Configuration" rounded header-bg content-full>

        <b-form @submit.stop.prevent="add_server">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="hostname" name="hostname"
                            placeholder="Hostname" aria-describedby="hostname-feedback"
                            v-model="hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_number"
                            name="CPU_number" placeholder="CPU cores" aria-describedby="CPU_number-feedback"
                            v-model="CPU_number">
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit" variant="alt-success" block>
                <i class="fa fa-fw fa-plus mr-1"></i> Add Server
              </b-button>
            </b-col>
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
      hostname: "test_host",
      CPU_number: 3
    }
  },
  methods: {
    async add_server () {

    }
  }
}
</script>
