<template>
  <div class="v-user-item">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h2 class="h6 font-w500 text-center mb-0">На этой странице можно посмотреть Вашу личную информацию</h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Личная информация" rounded header-bg content-full>

        <div v-if="isPassword === false">
          <BaseMessage
              v-for="item in messages_data.messages"
              :key="item.text"
              :message_data="{type: messages_data.type, item: item}"
          />
        </div>

        <b-form @submit.prevent="updateUser"
                class="mb-4"
        >
          <div class="py-3">
            <div class="form-group">
              <label class="form-check-label mb-2">Никнейм</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="username"
                            name="username"
                            placeholder="Никнейм"
                            aria-describedby="username-feedback"
                            v-model="user.username"
              >
              </b-form-input>
            </div>

            <div class="form-group">
              <label class="form-check-label mb-2">Телефон</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="phone"
                            name="phone"
                            placeholder="Телефон"
                            aria-describedby="phone-feedback"
                            v-model="user.phone"
              >
              </b-form-input>
            </div>

            <div class="form-group">
              <label class="form-check-label mb-2">Почтовый ящик</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="email"
                            name="email"
                            placeholder="Почтовый ящик"
                            aria-describedby="email-feedback"
                            v-model="user.email"
              >
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-info"
                        class="mr-1 mb-3"
                        block
              >
                <i class="si si-refresh mr-2"></i> Обновить данные
              </b-button>
            </b-col>
          </b-row>
        </b-form>

        <b-dropdown id="dropdown-form" text="Изменить пароль" ref="dropdown" class="m-2" menu-class="w-100" block
                    @show="messages_data = {type: 'warning', messages: []}">
          <b-dropdown-form @submit.prevent="updatePassword">
            <div v-if="isPassword === true">
              <BaseMessage
                  v-for="item in messages_data.messages"
                  :key="item.text"
                  :message_data="{type: messages_data.type, item: item}"
              />
            </div>
            <b-form-group label="Текущий пароль" label-for="currentPassword">
              <b-form-input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  size="lg"
                  placeholder="Текущий пароль"
                  aria-describedby="currentPassword-feedback"
                  v-model="currentPassword"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Новый пароль" label-for="newPassword">
              <b-form-input
                  type="password"
                  id="newPassword"
                  name="currentPassword"
                  size="lg"
                  placeholder="Новый пароль"
                  aria-describedby="newPassword-feedback"
                  v-model="newPassword"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Подтвердите новый пароль" label-for="confirmNewPassword">
              <b-form-input
                  type="password"
                  id="confirmNewPassword"
                  size="lg"
                  placeholder="Подтвердите новый пароль"
                  aria-describedby="confirmNewPassword-feedback"
                  v-model="confirmNewPassword"
              ></b-form-input>
            </b-form-group>
            <b-button type="submit"
                      variant="alt-info"
                      size="lg"
                      block
            >
              <i class="si si-refresh mr-2"></i> Обновить пароль
            </b-button>
          </b-dropdown-form>
        </b-dropdown>
      </base-block>
      <base-block title="Danger zone"
                  header-bg
                  content-full
                  rounded
      >
        <b-button variant="alt-danger"
                  size="lg"
                  block
                  @click="deleteUser"
        >
          <i class="fa fa-exclamation-triangle mr-2"></i> Удалить профиль
        </b-button>
      </base-block>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";
import {mapGetters, mapActions} from "vuex";
import store from "../../../vuex/store";

export default {
  name: "v-user-info",

  components: {
    BaseMessage
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.user = store.getters.USER;

    // this.$http
    //     .get("/user/retrieve-user/")
    //     .then(res => {
    //       if (res.data.status === "warning") {
    //         this.$router.push({
    //           name: 'retrieveProjects',
    //           params: {
    //             messages_data: {type: res.data.status, messages: res.data.messages}
    //           }
    //         });
    //       } else {
    //
    //       }
    //
    //     })
    //     .catch(err => console.error(err));
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      user: {
        username: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: ""
      },
      isPassword: false,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  },

  methods: {
    ...mapActions(["SET_USER"]),

    updatePassword() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.isPassword = true;
      const [rightPassword] = [/^[a-zA-Z0-9_-]+/];
      if (!this.currentPassword) {
        this.isPassword = true;
        this.messages_data.messages.push(
            {
              text: "Поле текущего пароля обязательно для заполнения!"
            }
        );
      }
      if (!this.newPassword) {
        this.messages_data.messages.push(
            {
              text: "Поле нового пароля обязательно для заполнения!"
            }
        );
      }
      if (!this.confirmNewPassword) {
        this.messages_data.messages.push(
            {
              text: "Поле подтверждения пароля обязательно для заполнения!"
            }
        );
      }

      if (this.newPassword && this.newPassword.length < 6) {
        this.messages_data.messages.push(
            {
              text: "Новый пароль не должен быть короче 6 символов!"
            }
        );
      }
      if (this.newPassword && this.confirmNewPassword && (this.newPassword !== this.confirmNewPassword)) {
        this.messages_data.messages.push(
            {
              text: "Новые пароли не совпадают!"
            }
        );
      }
      if (this.newPassword && !rightPassword.test(this.newPassword)) {
        this.messages_data.messages.push(
            {
              text: "Пароль должен состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/user/change-password/", {
              currentPassword: this.currentPassword,
              newPassword: this.newPassword,
              confirmNewPassword: this.confirmNewPassword
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages}
                this.currentPassword = "";
                this.newPassword = "";
                this.confirmNewPassword = "";
              }
            })
            .catch(err => console.error(err));
      }
    },

    updateUser() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.isPassword = false;
      let [rightUsername, rightPhone, rightEmail] = [
        /^[a-zA-Z0-9_]{3,16}$/,
        /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      ];
      if (!this.user.username) {
        this.messages_data.messages.push(
            {
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }

      if (!this.user.email) {
        this.messages_data.messages.push(
            {
              text: "Поле 'почта' обязательно для заполнения!"
            }
        );
      }
      if (!this.user.phone) {
        this.messages_data.messages.push(
            {
              text: "Поле 'телефон' обязательно для заполнения!"
            }
        );
      }
      if (this.user.username && !rightUsername.test(this.user.username)) {
        this.messages_data.messages.push(
            {
              text: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
      }
      if (this.user.phone && !rightPhone.test(this.user.phone)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат телефона!"
            }
        );
      }
      if (this.user.email && !rightEmail.test(this.user.email)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат почты!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/user/update-user/", {
              username: this.user.username,
              phone: this.user.phone,
              email: this.user.email
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
                if (res.data.status === "success") {
                  this.SET_USER({username: res.data.user.username, email: res.data.user.email, phone: res.data.user.phone})
                  this.user = store.getters.USER;
                }
              }
            })
            .catch(err => console.error(err));
      }
    },

    deleteUser() {
      console.log(this.messages_data);
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
        console.log(this.messages_data);
      }
      const username = prompt("Введите ваш никнейм", "");
      if (username === localStorage.getItem("username")) {
        const deleteMyAccount = prompt("Чтобы подтвердить, введите 'delete my account'", "");
        if (deleteMyAccount === "delete my account") {
          this.$http
              .get("/user/delete-user/")
              .then(res => {
                breakAuth.breakAuth(res);
              })
              .catch(err => console.error(err));
        } else {
          this.messages_data.messages.push({text: "Неверно введена фраза!"});
        }
      } else {
        this.messages_data.messages.push({text: "Неверно введен никнейм!"});
      }
    }
  }

}
</script>