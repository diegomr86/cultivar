<template>
  <div class="request-item-form">
    <breadcrumb
      :links="[['Pedidos para coletores', '/pedidos']]"
      active="Cadastrar"
    />
    <div class="panel">
      <div class="panel-body">
        <form-headline name="pedido para coletores" />
        <loading :loading="isLoading" />
        <b-form v-if="!isLoading" @submit.prevent="save">
          <div class="row">
            <div class="col-sm-6">
              <b-form-group label="Selecione a semente">
                <form-entity-select
                  v-model="form.seed"
                  type="seeds"
                  @selected="seedChanged"
                />
              </b-form-group>
            </div>
          </div>
          <div v-if="requests && potentials && groups && form.seed" class="row">
            <div class="col-sm-12">
              <table class="table b-table b-table-stacked-md">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Potencial</th>
                    <th>Já pedido</th>
                    <th>Adicionar</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(request, index) in form.request_items">
                    <tr :key="index">
                      <td>
                        {{ request.group.name }}
                      </td>
                      <td>
                        {{ request.potential | kg }}
                      </td>
                      <td>
                        {{ request.requested | kg }}
                      </td>
                      <td class="text-right">
                        <div v-if="request.potential - request.requested > 0">
                          <b-form-input
                            v-model="form.request_items[index].qtd"
                            class="weight"
                            type="number"
                            step="0.01"
                            lang="nb"
                            min="0"
                            :max="request.potential - request.requested"
                            @input="calcTotal"
                          />
                          <div
                            v-if="
                              form.request_items[index].qtd >
                              request.potential - request.requested
                            "
                            class="error"
                          >
                            Máximo:
                            {{ (request.potential - request.requested) | kg }}
                          </div>
                        </div>
                        <small v-else>Sem potencial</small>
                      </td>
                    </tr>
                  </template>
                  <tr>
                    <td><strong> Total</strong></td>
                    <td>
                      <strong>{{
                        form.request_items.reduce((a, b) => a + b.potential, 0)
                          | kg
                      }}</strong>
                    </td>
                    <td>
                      <strong>{{
                        form.request_items.reduce((a, b) => a + b.requested, 0)
                          | kg
                      }}</strong>
                    </td>
                    <td>
                      <strong>{{ total | kg }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <form-submit
            v-if="form.seed && total > 0"
            :errors="error"
            :sending="isSending"
          />
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Loading from '@/components/Loading'
import FormHeadline from '@/components/FormHeadline'
import FormEntitySelect from '@/components/FormEntitySelect'
import FormSubmit from '@/components/FormSubmit'

export default {
  name: 'RequestForm',
  components: {
    Breadcrumb,
    Loading,
    FormHeadline,
    FormEntitySelect,
    FormSubmit,
  },
  data() {
    return {
      requests: null,
      potentials: null,
      groups: null,
      seed: null,
      total: 0,
      form: {
        seed: null,
        createdBy: this.$auth.user._id,
        request_items: [],
      },
    }
  },
  async created() {
    this.groups = await this.loadList('groups')
  },
  methods: {
    save() {
      this.form.request_items.forEach(async (requestItem) => {
        if (
          requestItem.qtd > 0 &&
          requestItem.qtd <= requestItem.potential - requestItem.requested
        ) {
          const request = {
            seed: this.form.seed,
            compensation_collect: this.seed.compensation_collect,
            wholesale_price: this.seed.wholesale_price,
            price: this.seed.price,
            createdBy: this.form.createdBy,
            group: requestItem.group,
            qtd: requestItem.qtd,
          }
          await this.$axios.post('requests', request)
        }
      })
      this.notify('Pedidos cadastrados com sucesso')
      this.$router.replace('/pedidos')
    },
    calcRequest(group) {
      return this.requests
        .filter((request) => request.group === group._id)
        .reduce((a, b) => a + b.qtd, 0)
    },
    calcPotential(group) {
      return this.potentials
        .filter((potential) => potential.group === group._id)
        .reduce((a, b) => a + b.qtd, 0)
    },
    async seedChanged(seed) {
      this.seed = seed
      if (this.form.seed) {
        this.requests = await this.loadList('requests', {
          filters: {
            seed: this.form.seed,
            year: new Date().getFullYear().toString(),
          },
        })
        this.potentials = await this.loadList('potentials', {
          filters: {
            seed: this.form.seed,
            year: new Date().getFullYear().toString(),
          },
        })
      } else {
        this.requests = null
        this.potentials = null
      }

      this.form.request_items = []
      this.groups.forEach((group) => {
        this.form.request_items.push({
          group,
          potential: this.calcPotential(group),
          requested: this.calcRequest(group),
          qtd: 0,
        })
      })
    },
    calcTotal() {
      this.total = 0
      this.total = this.form.request_items.reduce(
        (a, b) => a + Number(b.qtd),
        0
      )
    },
  },
}
</script>
