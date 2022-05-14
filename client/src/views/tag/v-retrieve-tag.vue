<template>
  <div class="v-retrieve-tag">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h2 class="h6 font-w500 text-muted mb-0">
            На этой странице можно посмотреть информацию о теге
          </h2>
        </div>
      </div>
    </div>

    <div class="content">
      <b-row class="my-3 m-3" v-if="isAbleToDeleteTag === true">
        <b-col sm="8"></b-col>
        <b-col sm="4">
          <div class="d-flex justify-content-end">
            <b-button type="submit"
                      variant="alt-danger"
                      class="mr-1 mb-3"
                      @click="deleteTag"
            >
              <i class="si si-close mr-2"></i> Удалить тег
            </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-3 m-3">
        <b-col sm="6">
          <base-block title="Информация о теге"
                      rounded
                      header-bg
                      content-full
          >
            <div class="py-3">
              <div class="form-group">
                <label class="form-check-label mb-2">Наименование тега</label>
                <b-form-input size="lg"
                              id="tagNameInfo"
                              name="tagNameInfo"
                              v-model="tag.name"
                              disabled
                >
                </b-form-input>
              </div>
              <div class="form-group">
                <label class="form-check-label mb-2">Цвет тега</label>
                <div :style="{
                    'width': '100%',
                    'height': '2em',
                    'background': tag.color,
                    'border-radius': '10px',
                  }"
                >
                </div>
              </div>
              <div class="form-group">
                <label class="form-check-label mb-2">Время создания</label>
                <h2 class="mb-3">
                  <b-badge variant="primary">{{ new Date(tag.created).toLocaleString() }}</b-badge>
                </h2>
              </div>
            </div>
          </base-block>
        </b-col>
        <b-col sm="6" v-if="isAbleToUpdateTag === true">
          <base-block title="Форма редактирования тега"
                      rounded
                      header-bg
                      content-full
          >
            <BaseMessage
                v-for="item in messages_data.messages"
                :key="item.text"
                :message_data="{type: messages_data.type, item: item}"
            />
            <b-form @submit.prevent="updateTag">
              <div class="py-3">
                <div class="form-group">
                  <label class="form-check-label mb-2">Наименование тега</label>
                  <b-form-input size="lg"
                                id="tag"
                                name="tag"
                                placeholder="Имя тега"
                                v-model="tag.name"
                  >
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Цвет тега</label>
                  <b-form-input size="lg"
                                id="color"
                                name="color"
                                v-model="tag.color"
                                type="color"
                  >
                  </b-form-input>
                </div>
                <b-button type="submit" variant="alt-info" class="mr-1 mb-3">
                  <i class="si si-refresh mr-2"></i> Обновить данные
                </b-button>
              </div>
            </b-form>
          </base-block>
        </b-col>
      </b-row>

    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";

export default {
  name: "retrieve-tag",
  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      tag: {
        id: 0,
        name: "",
        color: "",
        created: "",
      },
      isAbleToUpdateTag: false,
      isAbleToDeleteTag: false,
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get(`/tag/retrieve-tag/${this.$route.params.tagId}/`)
        .then(res => {
          if (res.data.status === "warning") {
            this.$router.push({
              name: 'retrieveServers',
              params: {
                messages_data: {type: res.data.status, messages: res.data.messages}
              }
            });
          } else {
            this.tag = res.data.tagInfo[0];
            this.isAbleToUpdateTag = res.data.tagInfo[1];
            this.isAbleToDeleteTag = res.data.tagInfo[2];
          }
        })
        .catch(err => console.error(err));

  },

  methods: {
    updateTag() {
      if (this.$route.params.messages_data !== undefined) {
        this.messages_data = this.$route.params.messages_data;
      } else {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .post(`/tag/edit-tag/${this.tag.id}/`, {
            name: this.tag.name,
            color: this.tag.color,
          })
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.messages_data = {type: res.data.status, messages: res.data.messages}
            }
          })
          .catch(err => console.error(err));
    },

    deleteTag() {
      this.$http
          .get(`/tag/delete-tag/${this.tag.id}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.$router.push({
                name: 'retrieveProjects',
                params: {
                  messages_data: {type: res.data.status, messages: res.data.messages}
                }
              });
            }
          })
          .catch(err => console.error(err));
    }
  },
}
</script>