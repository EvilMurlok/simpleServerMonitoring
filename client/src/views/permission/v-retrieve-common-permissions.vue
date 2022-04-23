<template>
  <div class="v-retrieve-common-permissions">
    <div v-if="userCommonPermissions.length > 0"
         class="content"
    >
      <h3 class="text-center mb-4">Общие права, которые у Вас есть</h3>
      <b-table-simple class="table-vcenter font-size-sm"
                      fixed
                      striped
                      hover
                      sticky-header="100%"
      >
        <b-thead head-variant="dark">
          <b-tr class="text-center">
            <b-th>
              <span class="ml-5"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'name'})"
              >
                Право
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeName === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeName === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-5"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'entity'})"
              >
                Сущность
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeEntity === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeEntity === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-2"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'action'})"
              >
                Действие
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeAction === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeAction === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-4"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'detail'})"
              >
                Подробности
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeDetail === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeDetail === 'DESC'">
                </i>
              </span>
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody class="text-center"
                 v-for="commonPermission in userCommonPermissions"
                 :key="commonPermission.abilityId"
        >
          <b-tr content-full
                rounded>
            <b-td>
              <b class="ml-3">{{ commonPermission.name }}</b>
            </b-td>
            <b-td>
              <b class="ml-3">{{ commonPermission.entity }}</b>
            </b-td>
            <b-td>
              <b class="ml-3">{{ commonPermission.action }}</b>
            </b-td>
            <b-td>
              <b class="ml-3">{{ commonPermission.detail || '-' }}</b>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-retrieve-common-permissions",

  created() {
    this.$http
        .get("/permission/retrieve-common-user-permissions/")
        .then(res => {
          for (let userCommonPermission of res.data.userAllCommonPermissions) {
            for (let ability of userCommonPermission.abilities) {
              this.userCommonPermissions.push({
                permissionId: userCommonPermission.id,
                abilityId: ability.id,
                name: userCommonPermission.name,
                entity: ability.entity,
                action: ability.action,
                detail: ability.detail
              });
            }
          }
        })
        .catch(err => console.error(err));
  },

  data() {
    return {
      userCommonPermissions: [],

      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortedField: "name",
        sortTypeName: "ASC",
        sortTypeEntity: "",
        sortTypeAction: "",
        sortTypeDetail: "",
      },
    }
  },

  methods: {
    sortField({sortedField = "name"}) {
      let sortedType = "DESC";
      this.sortData.sortedField = sortedField;
      if (sortedField === "entity") {
        sortedType = this.sortData.sortTypeEntity = this.sortData.sortChangeType[this.sortData.sortTypeEntity];
        [this.sortData.sortTypeName, this.sortData.sortTypeAction, this.sortData.sortTypeDetail] = ["", "", ""];
      } else if (sortedField === "action") {
        sortedType = this.sortData.sortTypeAction = this.sortData.sortChangeType[this.sortData.sortTypeAction];
        [this.sortData.sortTypeName, this.sortData.sortTypeEntity, this.sortData.sortTypeDetail] = ["", "", ""];
      } else if (sortedField === "detail") {
        sortedType = this.sortData.sortTypeDetail = this.sortData.sortChangeType[this.sortData.sortTypeDetail];
        [this.sortData.sortTypeName, this.sortData.sortTypeAction, this.sortData.sortTypeEntity] = ["", "", ""];
      } else {
        sortedType = this.sortData.sortTypeName = this.sortData.sortChangeType[this.sortData.sortTypeName];
        [this.sortData.sortTypeEntity, this.sortData.sortTypeAction, this.sortData.sortTypeDetail] = ["", "", ""];
      }

      this.userCommonPermissions.sort((lhs, rhs) => {
        if (lhs[this.sortData.sortedField] > rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + ">"];
        }
        if (lhs[this.sortData.sortedField] < rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + "<"];
        }
        return 0;
      });
    },
  }
}
</script>