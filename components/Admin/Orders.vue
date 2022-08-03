<template>
  <div>
    <AdminOrderDetails ref="order-details"/>
    <b-table
      sticky-header="800px"
      class="text-capitalize h-100"
      tbody-tr-class="isClickable"
      hover
      @row-clicked="rowClicked"
      :items="orderInfo"
      :fields="fields"
      :striped="true"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc">
      <template #cell(datePlaced)="data">
        {{ data.value.toLocaleTimeString([], {year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit'}) }}
      </template>
      <template #cell(total)="data">
        ${{ data.value || 0 }}
      </template>
      <template #cell(status)="data">
        <b-badge :variant="badgeVariant(data.value)">{{ data.value }}</b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      fields: [
        { key: 'id', sortable: true },
        { key: 'datePlaced', sortable: true },
        { key: 'customerName', sortable: true },
        { key: 'total', sortable: true },
        { key: 'type', sortable: true },
        { key: 'status', sortable: true },
      ],
      sortBy: 'datePlaced',
      sortDesc: true,
      selectedOrder: null
    }
  },
  computed: {
    ...mapGetters({ orders: "order/data"}),
    orderInfo() {
      let info = []
      for (const [id, attr] of Object.entries(this.orders)) {
        let date = ''
        info.push(
          {
            id: id,
            customerName: attr?.order_data?.contactInfo?.name,
            total: attr?.total,
            datePlaced: attr?.createdAt,
            status: attr?.status || 'New',
            type: attr?.order_data?.delivery?.type
          }
        )
      }
      return info;
    },
  },
  methods: {
      rowClicked(item, index, event) {
        this.$refs["order-details"].show(this.orders[item.id])
      },
      badgeVariant(status) {
        switch(status) {
          case 'complete':
            return 'success'
          case 'rejected':
            return 'danger'
          case 'accepted':
            return 'primary'
          return 'info'
        }
      }
    }
}

</script>