<template>
  <div>
    <!-- Hero -->
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            My Servers
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            Welcome <b>{{name}}</b>.
            This is a list of your servers
          </h2>
        </div>
        <div class="mt-3 mt-sm-0 ml-sm-3">
          <b-button variant="alt-primary" class="mr-1" to="/add-server" v-click-ripple>
            <i class="fa fa-plus-square opacity-50 mr-1"></i> Add Server
          </b-button>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div v-if="servers.length > 0" class="content">
      <!-- Latest Orders -->
      <base-block v-for="server in servers" :key="server.id" rounded :title=server.hostname header-bg content-full>
        <b-table-simple striped hover borderless class="table-vcenter font-size-sm mb-0">
          <b-thead>
            <b-tr>
              <b-th>CPU cores</b-th>
              <b-th>Status</b-th>
              <b-th>Date_Added</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>
                <b class="ml-3">{{ server.CPU_number }}</b>
              </b-td>
              <b-td class="col-2">
                <span v-if="server.status === `on`" class="font-w600" :class="`text-success`">online</span>
                <span v-else class="font-w600" :class="`text-danger`">offline</span>
              </b-td>
              <b-td class="d-none d-sm-table-cell">
                <b-badge variant="primary">{{ server.createdAt }}</b-badge>
              </b-td>
              <b-td class="text-center">
                <b-button :to="'/my-servers/' + server.id" size="sm" variant="light">
                  <i class="fa fa-fw fa-info-circle" ></i>
                </b-button>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </base-block>
      <!-- END Latest Orders -->
    </div>
    <div v-else class="content">
      You haven't added any server yet!
    </div>


    <!-- END Page Content -->
  </div>
</template>

<script>

export default {
  data () {
    return {
      name: "Max",
      servers: [
        {
          id: 1,
          hostname: 'alpha',
          CPU_number: '8',
          status: 'on',
          createdAt: '2001-09-28 23:00',
        },
        {
          id: 2,
          hostname: 'beta',
          CPU_number: '4',
          status: 'off',
          createdAt: '2002-09-28 21:00',
        },
        {
          id: 3,
          hostname: 'gamma',
          CPU_number: '6',
          status: 'on',
          createdAt: '2001-10-28 0:00',
        },
        {
          id: 4,
          hostname: 'delta',
          CPU_number: '1',
          status: 'off',
          createdAt: '2012-09-30 13:00',
        },
      ]
    }
  }
}
</script>
