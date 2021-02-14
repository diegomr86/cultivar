<template>
  <div class="order">
    <breadcrumb
      :links="[['Encomendas', '/encomendas']]"
      active="Dados da encomenda"
    />
    <div class="panel">
      <div class="panel-body">
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <loading :loading="isLoading" />
        <div v-if="order && !isLoading">
          <div class="row item-title">
            <div class="col-md-12">
              <n-link
                v-if="!isSuper"
                :to="'/encomendas/' + order._id + '/editar'"
                class="btn btn-default btn-sm pull-right"
              >
                <i class="fa fa-edit" aria-hidden="true" />
                Editar encomenda
              </n-link>
              <h1>
                Encomenda {{ order.code }}
                <small v-if="order.contract && !order.close"
                  >(Contrato {{ order.contract.toLowerCase() }})</small
                >
                <small v-if="order.close">(Entrega concluída)</small>
              </h1>
              <p>
                <span v-if="order.date_receiving"
                  >Data de recebimento:
                  {{ order.date_receiving | moment('DD/MM/YYYY') }}</span
                >
                <span v-if="order.deadline"
                  >Prazo final:
                  {{ order.deadline | moment('DD/MM/YYYY') }}</span
                >
              </p>
              <p>
                <n-link
                  v-if="order.client"
                  :to="'/usuarios/' + order.client._id"
                >
                  &bull; {{ order.client.name }}</n-link
                >
              </p>
              <p>
                <span v-if="order.restored_area"
                  >{{ order.restored_area }} hectares</span
                >
                <span v-if="order.vegetation">{{ order.vegetation }}</span>
              </p>
              <p>
                <span v-if="order.comments">{{ order.comments }}</span>
              </p>
              <div>
                <b-badge v-if="order.flood" pill
                  ><i class="fa fa-check" /> Alaga</b-badge
                >
                <b-badge v-if="order.bog" pill
                  ><i class="fa fa-check" /> Brejo</b-badge
                >
              </div>
            </div>
          </div>
          <hr class="clearfix" />
          <b-card-group deck>
            <b-card
              v-if="order.seed_items && order.seed_items.length"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Quantidade"
            >
              <b-card-title>{{
                order.seed_items
                  .map((seed_item) => seed_item.qtd)
                  .reduce((a, b) => a + b, 0) | kg
              }}</b-card-title>
            </b-card>
            <b-card
              v-if="order.seed_items && order.seed_items.length"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              :header="'Total ' + order.purchase_type.toLowerCase()"
            >
              <b-card-title>{{
                order.seed_items
                  .map(
                    (seed_item) =>
                      seed_item.qtd *
                      (order.purchase_type === 'Atacado'
                        ? seed_item.wholesale_price
                        : seed_item.price)
                  )
                  .reduce((a, b) => a + b, 0) | moeda
              }}</b-card-title>
            </b-card>
            <b-card
              v-if="order.amount_paid >= 0"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Pago"
            >
              <b-card-title>{{ order.amount_paid | moeda }}</b-card-title>
            </b-card>
            <b-card
              v-if="order.amount_remain >= 0"
              bg-variant="dark"
              text-variant="white"
              class="text-center"
              header="Restante"
            >
              <b-card-title>{{ order.amount_remain | moeda }}</b-card-title>
            </b-card>
          </b-card-group>
          <br />
          <div class="row">
            <div v-if="order" class="col-sm-12">
              <table class="table b-table b-table-stacked-md">
                <thead>
                  <tr>
                    <th>Espécie</th>
                    <th>
                      Valor
                      <span v-if="order.purchase_type">{{
                        order.purchase_type.toLowerCase()
                      }}</span>
                      / Kg
                    </th>
                    <th>Quantidade</th>
                    <th>
                      Total
                      <span v-if="order.purchase_type">{{
                        order.purchase_type.toLowerCase()
                      }}</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(seed_item, index) in order.seed_items"
                    :key="index"
                  >
                    <td>
                      <n-link :to="'/sementes/' + seed_item.seed._id">{{
                        seed_item.seed.name
                      }}</n-link>
                    </td>
                    <td>
                      {{
                        (order.purchase_type === 'Atacado'
                          ? seed_item.wholesale_price
                          : seed_item.price) | moeda
                      }}
                    </td>
                    <td>
                      {{ seed_item.qtd | kg }}
                    </td>
                    <td>
                      {{
                        ((order.purchase_type === 'Atacado'
                          ? seed_item.wholesale_price
                          : seed_item.price) *
                          seed_item.qtd)
                          | moeda
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Order',
  components: {
    Loading,
    Breadcrumb,
  },

  data() {
    return {
      order: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('orders/' + this.$route.params.id, {
        params: {
          populate: 'client seed_items.seed',
        },
      })
      .then((response) => {
        this.order = response.data
        this.isLoading = false
      })
      .catch(this.showError)
  },
}
</script>
