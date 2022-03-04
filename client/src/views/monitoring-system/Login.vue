<template>
  <!-- Page Content -->
  <div class="hero-static">
    <div class="content">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6" xl="4">
          <!-- Sign In Block -->
          <base-block rounded themed header-class="bg-primary-dark" class="mb-0" title="Sign In">
            <template #options>
              <router-link to="/register" class="btn-block-option" v-b-tooltip.hover.nofade.left="'New Account'">
                <i class="fa fa-user-plus"></i>
              </router-link>
            </template>
            <div class="p-sm-3 px-lg-4 py-lg-5">
              <h1 class="h2 mb-1">ServerMonitoring</h1>
              <p class="text-muted">
                Welcome, please login.
              </p>

              <b-alert v-if="error" variant="warning" show class="d-flex align-items-center justify-content-between">
                <div class="flex-fill mr-3">
                  <p class="mb-0">{{error_message}}</p>
                </div>
                <div class="flex-00-auto">
                  <i class="fa fa-fw fa-exclamation-circle"></i>
                </div>
              </b-alert>

              <b-alert v-if="success" variant="success" show class="d-flex align-items-center">
                <div class="flex-00-auto">
                  <i class="fa fa-fw fa-check"></i>
                </div>
                <div class="flex-fill ml-3">
                  <p class="mb-0">{{success_message}}</p>
                </div>
              </b-alert>

              <!-- Sign In Form -->
              <b-form @submit.stop.prevent="login">
                <div class="py-3">
                  <div class="form-group">
                    <b-form-input size="lg" class="form-control-alt" id="username" name="username"
                                  placeholder="Username" aria-describedby="username-feedback"
                                  v-model="username">
                    </b-form-input>
                  </div>
                  <div class="form-group">
                    <b-form-input type="password" size="lg" class="form-control-alt" id="password"
                                  name="password" placeholder="Password" aria-describedby="password-feedback">
                    </b-form-input>
                  </div>
                </div>
                <b-row class="form-group">
                  <b-col md="6" xl="5">
                    <b-button type="submit" variant="alt-primary" block>
                      <i class="fa fa-fw fa-sign-in-alt mr-1"></i> Sign In
                    </b-button>
                  </b-col>
                </b-row>
              </b-form>
              <!-- END Sign In Form -->
            </div>
          </base-block>
          <!-- END Sign In Block -->
        </b-col>
      </b-row>
    </div>
    <div class="content content-full font-size-sm text-muted text-center">
      <strong>{{ 'Simple Server Monitoring 0.0.1' }}</strong> &copy; {{ '2022' }}
    </div>
  </div>
  <!-- END Page Content -->
</template>

<script>
// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate

export default {
  data () {
    return {
      username: null,
      error: false,
      error_message: null,
      success: false,
      success_message: null
    }
  },
  methods: {
    async login () {

    }
  }
}
</script>
