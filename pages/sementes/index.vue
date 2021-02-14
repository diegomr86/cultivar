<template>
  <div class="seeds">
    <breadcrumb active="Sementes" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Sementes</h1>
          </div>
          <div class="col-sm-6 main-actions">
            <a
              v-if="seeds && seeds.length"
              class="btn btn-primary btn-sm"
              @click="downloadXLS"
            >
              <i class="fa fa-download" /> Exportar
            </a>
            <a
              v-if="seeds && seeds.length"
              class="btn btn-primary btn-sm"
              @click="print()"
            >
              <i class="fa fa-print" /> Imprimir
            </a>
            <n-link to="/sementes/cadastrar" class="btn btn-primary btn-sm">
              <i class="fa fa-plus" /> Cadastrar
            </n-link>
          </div>
        </div>
        <div class="info-content">
          <div class="text-right">
            <input
              v-model="filters.search"
              type="search"
              placeholder="Buscar"
              class="form-control search-input"
            />
          </div>
          <br />
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading
            :loading="!seeds && !error"
            msg="Carregando lista de sementes"
          />
          <no-item :list="seeds" />
          <div v-if="seeds && seeds.length">
            <b-table
              stacked="md"
              :fields="table_fields"
              :items="seeds"
              :sort-by="'name'"
              :filter="filters.search"
            >
              <template #cell(name)="data">
                <n-link :to="'/sementes/' + data.item._id">{{
                  data.item.name
                }}</n-link>
              </template>
              <template #cell(compensation_collect)="data">
                {{ data.item.compensation_collect | moeda }}
              </template>
              <template #cell(wholesale_price)="data">
                {{ data.item.wholesale_price | moeda }}
              </template>
              <template #cell(price)="data">
                {{ data.item.price | moeda }}
              </template>
              <template #cell(actions)="data">
                <n-link
                  v-if="!isSuper"
                  :to="'/sementes/' + data.item._id + '/editar'"
                  class="fa fa-edit btn btn-secondary btn-sm"
                ></n-link>
                <a
                  v-if="!isSuper"
                  class="fa fa-trash btn btn-danger btn-sm"
                  @click="remove(data.item._id)"
                ></a>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ExcellentExport from 'excellentexport'
import Loading from '@/components/Loading'
import NoItem from '@/components/NoItem'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Seeds',

  components: {
    Loading,
    NoItem,
    Breadcrumb,
  },

  data() {
    return {
      filters: {
        search: null,
      },
      seeds: null,
      table_fields: [
        {
          key: 'name',
          label: 'Semente',
          sortable: true,
        },
        {
          key: 'scientific_name',
          label: 'Nome científico',
          sortable: true,
        },
        {
          key: 'compensation_collect',
          label: 'Remuneração',
          sortable: true,
        },
      ],
    }
  },

  created() {
    if (this.isManagerOrAbove) {
      this.table_fields = this.table_fields.concat([
        {
          key: 'wholesale_price',
          label: 'Preço Atacado',
          sortable: true,
        },
        {
          key: 'price',
          label: 'Preço Varejo',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ações',
          class: 'actions',
        },
      ])
    } else {
      this.table_fields = this.table_fields.concat([
        {
          key: 'seeds_kg',
          label: 'Sementes / Kg',
          sortable: true,
        },
      ])
    }
    this.list()
  },
  methods: {
    async list() {
      this.error = null
      this.seeds = await this.loadList('seeds')
    },
    remove(id) {
      if (confirm('Tem certeza que deseja excluír?')) {
        this.$axios
          .delete('seeds/' + id)
          .then(() => {
            this.list()
          })
          .catch(this.showError)
      }
    },
    downloadXLS(event) {
      const sheetname = 'Sementes'
      const title = sheetname
      const sheet = [['Espécie', 'Nome científico', 'Remuneração']]
      if (this.isManagerOrAbove) {
        sheet[0].push('Preço Atacado')
        sheet[0].push('Preço Varejo')
      } else {
        sheet[0].push('Sementes / Kg')
      }
      this.seeds.forEach((seed) => {
        const data = [
          seed.name,
          seed.scientific_name,
          seed.compensation_collect,
        ]
        if (this.isManagerOrAbove) {
          data.push(seed.wholesale_price)
          data.push(seed.price)
        } else {
          data.push(seed.seeds_kg)
        }
        sheet.push(data)
      })

      return ExcellentExport.convert(
        {
          anchor: event.target,
          filename:
            title + ' - ' + this.$moment(new Date()).format('DD-MM-YYYY'),
          format: 'xls',
        },
        [
          {
            name: sheetname,
            from: {
              array: sheet,
              arrayHasHeader: true,
            },
          },
        ]
      )
    },

    print() {
      window.print()
    },
  },
}
</script>
