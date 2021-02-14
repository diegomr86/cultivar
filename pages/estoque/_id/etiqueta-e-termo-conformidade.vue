<template>
  <div class="label-and-term">
    <breadcrumb
      :links="[['Estoque', '/estoque']]"
      active="Etiqueta e termo de conformidade"
    />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-6">
            <h1>Etiqueta e termo de conformidade</h1>
          </div>
          <div class="col-sm-6 main-actions">
            <a
              v-if="showClearButton"
              class="btn btn-default btn-sm"
              @click="clearFilters"
            >
              Limpar filtros
            </a>
          </div>
        </div>
        <div class="info-content">
          <div v-if="filters_data" class="filters gray">
            <b-form-group label="Filtrar por:">
              <div class="row">
                <div
                  v-if="filters_data.buyers && filters_data.buyers.length"
                  class="col-sm-5"
                >
                  <filter-entity-select
                    v-model="filters.buyer"
                    :items="filters_data.buyers"
                    placeholder="Cliente"
                    item-text="title"
                    item-value="id"
                    @selected="applyFilters"
                  />
                </div>
                <div
                  v-if="filters_data.orders && filters_data.orders.length"
                  class="col-sm-5"
                >
                  <filter-entity-select
                    v-model="filters.order"
                    :items="filters_data.orders"
                    placeholder="Encomenda"
                    item-text="title"
                    item-value="id"
                    @selected="applyFilters"
                  />
                </div>
                <div class="col-sm-2">
                  <b-form-select
                    v-model="filters.year"
                    :options="years"
                    class="years-filter"
                    @input="yearChanged"
                  ></b-form-select>
                </div>
              </div>
            </b-form-group>
          </div>
          <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
          <loading :loading="!filters_data" msg="Carregando filtros" />
          <loading
            :loading="!movements && !error && filtered"
            msg="Carregando movimentações"
          />
          <div v-if="!filtered && filters_data">
            <p class="alert alert-warning text-center">
              Selecione um filtro para continuar
            </p>
          </div>
          <div v-if="movements && !movements.length">
            <p class="alert alert-warning text-center">
              Nenhuma saída encontrada
            </p>
          </div>
          <div v-if="movements && movements.length">
            <table class="table b-table b-table-stacked-md">
              <thead>
                <tr>
                  <th />
                  <th>Data</th>
                  <th>Casa de sementes</th>
                  <th>Comprador</th>
                  <th>Sementes</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(movement, i) in movements" :key="i">
                  <td>
                    <input v-model="movement.checked" type="checkbox" />
                  </td>
                  <td>
                    <div>
                      {{ movement.createdAt | moment('DD/MM/YYYY') }}
                      <a
                        v-if="movement.lot"
                        @click="setFilter('lot', movement.lot._id)"
                      >
                        {{ movement.lot.code }}
                      </a>
                    </div>
                  </td>
                  <td>
                    <a
                      v-if="movement.seeds_house"
                      @click="
                        setFilter('seeds_house', movement.seeds_house._id)
                      "
                    >
                      {{ movement.seeds_house.name }}
                    </a>
                    <span v-if="movement.seeds_house_code">
                      {{ movement.seeds_house_code }}
                    </span>
                  </td>
                  <td>
                    <div
                      v-for="(type, index) in ['group', 'collector', 'buyer']"
                      :key="index"
                    >
                      <a
                        v-if="movement[type]"
                        @click="setFilter(type, movement[type]._id)"
                      >
                        {{ movement[type].name }}
                      </a>
                    </div>
                  </td>
                  <td>
                    <span>
                      <a
                        v-if="movement.seed"
                        class="inline"
                        @click="setFilter('seed', movement.seed._id)"
                      >
                        {{ movement.seed.name }}
                      </a>
                      <span v-if="movement.seed_name">
                        {{ movement.seed_name }}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span>{{ movement.qtd | kg }}</span>
                  </td>
                  <td>
                    <span>{{ (movement.qtd * movement.price) | moeda }}</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="b-table-bottom-row">
                  <td />
                  <td />
                  <td />
                  <td />
                  <td><strong> Total</strong></td>
                  <td>
                    <strong>{{ total_qtd | kg }}</strong>
                  </td>
                  <td style="text-align: right !important">
                    <strong>{{ total_price | moeda }}</strong>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-5 main-actions" style="float: right">
            <a
              v-if="movements && movements.length"
              class="btn btn-primary btn-sm"
              @click="printEtiqueta()"
            >
              <i class="fa fa-print" style="margin-right: 1em" />Etiqueta
            </a>
            <a
              v-if="movements && movements.length"
              class="btn btn-primary btn-sm"
              @click="printTermoConformidade()"
            >
              <i class="fa fa-print" style="margin-right: 1em" />Termo de
              Conformidade
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FilterEntitySelect from '@/components/FilterEntitySelect'
import JsPDF from 'jspdf'

export default {
  name: 'LabelAndTerm',
  components: {
    Loading,
    Breadcrumb,
    FilterEntitySelect,
  },
  data() {
    return {
      movements: null,
      filtered: false,
      filters_data: null,
      filters: {
        buyer: null,
        order: null,
        year: new Date().getFullYear().toString(),
      },
      total_qtd: 0,
      total_price: 0,
    }
  },
  computed: {
    showClearButton() {
      return Object.keys(this.filters).find((k) => this.filters[k])
    },
  },
  created() {
    this.list()
  },
  methods: {
    async list() {
      this.filters_data = await this.loadList('label_and_term_stock_filters')
      if (this.$route.params.id) {
        const orderItem = this.filters_data.orders.find(
          (order) => order.id === this.$route.params.id
        )
        if (orderItem) {
          this.filters.order = orderItem.id
        }
      }
      this.applyFilters()
    },
    onFiltered() {
      if (this.movements) {
        this.total_qtd = 0
        this.total_price = 0
        this.movements.forEach((item) => {
          this.total_qtd += item.qtd
          this.total_price += item.qtd * item.price
          this.checked = false
        })
      }
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.applyFilters()
    },
    async applyFilters() {
      this.filters.type = 'stock_out'
      this.movements = null
      this.movements = await this.loadList('stock', this.filters)
      this.filtered = true
      this.onFiltered()
    },
    clearFilter(filter) {
      this.filters[filter] = null
      this.applyFilters()
    },
    clearFilters() {
      Object.keys(this.filters).forEach((filter) => {
        this.filters[filter] = null
      })
      this.applyFilters()
    },
    printEtiqueta() {
      // TODO: falta implementar
    },
    async printTermoConformidade() {
      const ids = []
      this.movements.forEach(function (x) {
        if (x.checked) {
          ids.push(x._id)
        }
      })

      if (ids.length === 0) {
        alert('precisa selecionar ao menos uma saída de semente.')
      } else {
        const dados = await this.loadList('label_and_term', ids)
        const network = dados[0].network
        const networkAddress = network.address || {
          address: '',
          city: '',
          uf: '',
          postal_code: '',
        }
        const responsibleTechnician = network.responsible_technician || {
          name: '',
          crea: '',
          renasem: '',
          contact: '',
          email: '',
        }
        const responsibleTechnicianAddress = responsibleTechnician.address || {
          address: '',
          city: '',
          uf: '',
          postal_code: '',
        }

        const doc = new JsPDF('p', 'mm', 'a4')

        // imprime o título
        doc.setFontSize(9)
        doc.text(
          'TERMO DE CONFORMIDADE DE SEMENTES FLORESTAIS Nº:______/_____________',
          20,
          20
        )

        // imprime os dados da rede de sementes (produtor)
        doc.setFontSize(8)
        doc.setLineWidth(0.3)
        doc.roundedRect(20, 24, 170, 36, 2, 2, 'S')
        doc.text('IDENTIFICADOR DO PRODUTOR DE SEMENTES', 26, 28)
        doc.line(20, 30, 190, 30)
        doc.text(network.name, 26, 36)
        doc.text('CNPJ: ' + network.cnpj, 26, 41)
        doc.text('Inscrição do RENASEM Nº: ' + network.renasem, 26, 46)
        doc.text('Telefone: ' + network.contact, 26, 51)
        doc.text(
          `Endereço: ${networkAddress.address} - ${networkAddress.city}-${networkAddress.uf} - CEP: ${networkAddress.postal_code}`,
          26,
          56
        )

        // imprime os dados do responsável técnico
        doc.roundedRect(20, 63, 170, 40, 2, 2, 'S')
        doc.text('IDENTIFICADOR DO RESPONSÁVEL TÉCNICO', 26, 67)
        doc.line(20, 69, 190, 69)
        doc.text(responsibleTechnician.name, 26, 74)
        doc.text('CREA: ' + responsibleTechnician.crea, 26, 79)
        doc.text(
          'Inscrição do RENASEM Nº: ' + responsibleTechnician.renasem,
          26,
          84
        )
        doc.text('Telefone: ' + responsibleTechnician.contact, 26, 89)
        doc.text(
          `Endereço: ${responsibleTechnicianAddress.address} - ${responsibleTechnicianAddress.city}-${responsibleTechnicianAddress.uf} - CEP: ${responsibleTechnicianAddress.postal_code}`,
          26,
          94
        )
        doc.text('E-mail: ' + responsibleTechnician.email, 26, 99)

        // imprime as observações
        const texto = doc.splitTextToSize(
          'Atesto que os lotes de sementes, abaixo discriminadas, foram produzidos de acordo com as normas e padrões estabelecidos pelo Ministério da Agricultura, Pecuária e Abastecimento (MAPA), pelos quais assumo a responsabilidade pela identidade e qualidade.',
          170
        )
        doc.text(texto, 20, 109)

        // imprime o título das sementes contidas no termo de conformidade
        doc.setFontSize(5)
        doc.text('ESPÉCIE', 23, 119)
        doc.text('NOME COMUM', 36, 119)
        doc.text('CATEGORIA', 51, 119)
        doc.text('PROCEDÊNCIA', 65, 119)
        doc.text('Nº DO LOTE', 81, 119)
        doc.text(['Nº DE MATRIZES', 'QUE COMPÕE', 'O LOTE'], 96, 119)
        doc.text(['PESO', 'TOTAL (KG)'], 115, 119)
        doc.text(['BOLETIM DE', 'ANÁLISE'], 130, 119)
        doc.text('PUREZA (%)', 145, 119)
        doc.text('GERMINAÇÃO (%)', 157, 119)
        doc.text('VALIDADE', 174, 119)
        doc.line(20, 124, 190, 124)

        // imprime os dados de cada semente
        let linhaInicial = 127
        dados.forEach(function (x) {
          let texto = doc.splitTextToSize(x.seed.name, 14)
          doc.text(texto, 23, linhaInicial)

          texto = doc.splitTextToSize(x.seed.scientific_name, 15)
          doc.text(texto, 36, linhaInicial)

          texto = doc.splitTextToSize(x.lot.code, 14)
          doc.text(texto, 81, linhaInicial)

          doc.text('' + x.qtd, 115, linhaInicial)

          linhaInicial += 6
        })

        // imprime o grid das sementes
        linhaInicial = 115
        const alturaDados = 11 + dados.length * 5
        doc.roundedRect(20, linhaInicial, 170, alturaDados, 2, 2, 'S')
        doc.line(35, linhaInicial, 35, linhaInicial + alturaDados)
        doc.line(50, linhaInicial, 50, linhaInicial + alturaDados)
        doc.line(64, linhaInicial, 64, linhaInicial + alturaDados)
        doc.line(80, linhaInicial, 80, linhaInicial + alturaDados)

        doc.line(95, linhaInicial, 95, linhaInicial + alturaDados)
        doc.line(114, linhaInicial, 114, linhaInicial + alturaDados)
        doc.line(129, linhaInicial, 129, linhaInicial + alturaDados)
        doc.line(144, linhaInicial, 144, linhaInicial + alturaDados)
        doc.line(156, linhaInicial, 156, linhaInicial + alturaDados)
        doc.line(173, linhaInicial, 173, linhaInicial + alturaDados)

        // imprime o rodapé
        doc.setFontSize(9)
        doc.text(
          networkAddress.city + ', ______ de __________ de _______',
          20,
          alturaDados + 125
        )
        doc.text('________________________________', 130, alturaDados + 125)
        doc.setFontSize(10)
        doc.text(responsibleTechnician.name, 130, alturaDados + 130)
        doc.setFontSize(9)
        doc.text('Eng. Agrônomo - Responsável Técnico', 130, alturaDados + 135)

        window.open(doc.output('bloburl'))
      }
    },
    yearChanged() {
      this.applyFilters()
    },
  },
}
</script>
