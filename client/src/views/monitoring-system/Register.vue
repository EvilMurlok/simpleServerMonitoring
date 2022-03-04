<template>
  <!-- Page Content -->
  <div class="hero-static">
    <div class="content">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6" xl="4">
          <!-- Sign Up Block -->
          <base-block rounded themed class="mb-0" header-class="bg-primary-dark" title="Create Account">
            <template #options>
              <router-link to="/login" class="btn-block-option" v-b-tooltip.hover.nofade.left="'Sign In'">
                <i class="fa fa-sign-in-alt"></i>
              </router-link>
            </template>
            <div class="p-sm-3 px-lg-4 py-lg-5">
              <h1 class="h2 mb-1">ServerMonitoring</h1>
              <p class="text-muted">
                Please fill the following details to create a new account.
              </p>

              <b-alert v-if="error" variant="warning" show class="d-flex align-items-center justify-content-between">
                <div class="flex-fill mr-3">
                  <p class="mb-0">{{error_message}}</p>
                </div>
                <div class="flex-00-auto">
                  <i class="fa fa-fw fa-exclamation-circle"></i>
                </div>
              </b-alert>

              <!-- Sign Up Form -->
              <b-form @submit.stop.prevent="register">
                <div class="py-3">
                  <div class="form-group">
                    <b-form-input size="lg" class="form-control-alt" id="username" name="username"
                                  placeholder="Username" aria-describedby="username-feedback"
                                  v-model="username">
                    </b-form-input>
                  </div>
                  <div class="form-group">
                    <b-form-input type="password" size="lg" class="form-control-alt" id="password" name="password" placeholder="Password" aria-describedby="password-feedback"></b-form-input>
                  </div>
                  <div class="form-group">
                    <b-form-input type="password" size="lg" class="form-control-alt" id="password2" name="password2" placeholder="Confirm Password" aria-describedby="password2-feedback"></b-form-input>
                  </div>
                </div>
                <b-row class="form-group">
                  <b-col md="6" xl="5">
                    <b-button type="submit" variant="alt-success" block>
                      <i class="fa fa-fw fa-plus mr-1"></i> Sign Up
                    </b-button>
                  </b-col>
                </b-row>
              </b-form>
              <!-- END Sign Up Form -->
            </div>
          </base-block>
          <!-- END Sign Up Block -->
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

import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      username: null,
      error: false,
      error_message: null
    }
  },
  methods: {
    async register () {
      try {
        await AuthenticationService.register({
          username: this.username,
          password: this.password,
          password2: this.password2
        })
      } catch (error) {
        this.error = true;
        this.error_message = error.response.data.error;
      }
    }
  }
}
</script>
