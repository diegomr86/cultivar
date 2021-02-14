<template>
  <div class="receipt">
    <loading :loading="isLoading" />
    <div v-if="stock_in" class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="5">
            <table>
              <tr>
                <td class="title">
                  <div class="brand">
                    <h1 class="logo">
                      <a><span>REDE</span> de <strong>sementes</strong></a>
                    </h1>
                  </div>
                </td>

                <td>
                  <h4><strong>Recibo de entrega</strong></h4>
                  Data: {{ stock_in.createdAt | moment('DD/MM/YYYY H:mm')
                  }}<br />
                  Cód: <small>{{ stock_in._id }}</small
                  ><br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="5">
            <table>
              <tr>
                <td>
                  <strong>Recebido por:</strong><br />
                  <span v-if="stock_in.seeds_house"
                    >{{ stock_in.seeds_house.name }}<br
                  /></span>
                  <span v-if="stock_in.createdBy"
                    >{{ stock_in.createdBy.name }}<br
                  /></span>
                </td>

                <td>
                  <strong>Entregue por:</strong><br />
                  <span v-if="stock_in.group"
                    >{{ stock_in.group.name }}<br
                  /></span>
                  <span v-if="stock_in.collector"
                    >{{ stock_in.collector.name }}<br
                  /></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr class="heading">
          <td>Espécie</td>
          <td>Lote</td>
          <td>Valor/kg</td>
          <td>Quantidade</td>
          <td>Total</td>
        </tr>
        <tr class="details">
          <td>
            {{ stock_in.seed.name }}
            <small v-if="stock_in.number_of_matrixes"
              ><br />{{ stock_in.number_of_matrixes }} matrizes</small
            >
            <small v-if="stock_in.collection_date"
              ><br />Colhido em
              {{ stock_in.collection_date | moment('DD/MM/YYYY') }}</small
            >
          </td>
          <td>
            <small>{{ stock_in.lot.code }}</small>
          </td>
          <td>{{ stock_in.compensation_collect | moeda }}</td>
          <td>{{ stock_in.qtd | kg }}</td>
          <td>{{ (stock_in.compensation_collect * stock_in.qtd) | moeda }}</td>
        </tr>
        <tr class="total">
          <td></td>
          <td></td>
          <td>Total:</td>
          <td>{{ stock_in.qtd | kg }}</td>
          <td>{{ (stock_in.compensation_collect * stock_in.qtd) | moeda }}</td>
        </tr>
      </table>
      <div class="signature">
        <p v-if="stock_in.collector">{{ stock_in.collector.name }}<br /></p>
        <p v-if="stock_in.group">{{ stock_in.group.name }}<br /></p>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading'

export default {
  name: 'StockInReceipt',
  components: {
    loading: Loading,
  },

  data() {
    return {
      stock_in: null,
    }
  },
  created() {
    this.isLoading = true
    this.$axios
      .get('stock_in/' + this.$route.params.id, {
        params: {
          populate: 'seeds_house group collector seed lot createdBy',
        },
      })
      .then((response) => {
        this.stock_in = response.data
        this.isLoading = false
        setTimeout(() => {
          // window.print();
        }, 2000)
      })
      .catch(this.showError)
  },
}
</script>
