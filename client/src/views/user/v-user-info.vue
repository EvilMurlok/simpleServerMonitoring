<template>
  <div class="v-user-item">
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">{{user.username}}</h1>
          <h2 class="h6 font-w500 text-muted mb-0">На этой странице можно посмотреть Вашу личную информацию</h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Личная информация" rounded header-bg content-full>

        <BaseMessage
            v-for="item in messages_data.messages"
            :key="item.text"
            :message_data="{type: messages_data.type, item: item}"
        />
        <b-form @submit.prevent="updateServer">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="hostname" name="hostname"
                            placeholder="Hostname" aria-describedby="hostname-feedback"
                            v-model="server.hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_number" name="CPU_number"
                            placeholder="CPU cores" aria-describedby="CPU_number-feedback"
                            v-model="server.CPU_number">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_load" name="CPU_load"
                            placeholder="CPU load" aria-describedby="CPU_load-feedback"
                            v-model="server.CPU_load" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_load" name="memory_load"
                            placeholder="Memory load" aria-describedby="memory_load-feedback"
                            v-model="server.memory_load" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_usage" name="memory_usage"
                            placeholder="Memory usage" aria-describedby="memory_usage-feedback"
                            v-model="server.memory_usage" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="requests_amount" name="requests_amount"
                            placeholder="Requests amount" aria-describedby="requests_amount-feedback"
                            v-model="server.requests_amount" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="latency" name="latency"
                            placeholder="Latency" aria-describedby="latency-feedback"
                            v-model="server.latency" disabled readonly>
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit" variant="alt-warning" class="mr-1 mb-3">
                <i class="fa fa-fw fa-exclamation-triangle mr-1"></i> Обновить данные
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </base-block>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-user-info"
}
</script>

<style scoped>

</style>