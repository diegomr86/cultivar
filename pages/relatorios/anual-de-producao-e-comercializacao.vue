<template>
  <div class="label-and-term">
    <breadcrumb active="Relatório Anual de Produção e Comercialização" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-12">
            <h1>Relatório Anual de Produção e Comercialização</h1>
          </div>
        </div>
        <div class="info-content">
          <div class="filters gray">
            <div class="row">
              <div class="col-sm-3">
                <b-form-group label="Ano de Comercialização *">
                  <b-form-input
                    v-model="year"
                    v-validate="'required'"
                    name="year"
                  />
                  <field-error :msg="veeErrors" field="year" />
                </b-form-group>
              </div>
            </div>
          </div>
          <loading :loading="generating_report" msg="Carregando relatório" />
        </div>
        <div class="row">
          <div class="col-sm-5 main-actions" style="float: right">
            <a v-if="isSending" class="btn btn-primary btn-sm"
              ><i class="fa fa-spinner fa-spin" /> Gerando relatório...</a
            >
            <a v-if="!isSending" class="btn btn-primary btn-sm" @click="print()"
              ><i class="fa fa-print" style="margin-right: 1em"></i
              >Visualizar</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import Breadcrumb from '@/components/Breadcrumb'
import FieldError from '@/components/FieldError'
import JsPDF from 'jspdf'

export default {
  name: 'YearlyProductionTradeReport',
  components: {
    Loading,
    Breadcrumb,
    FieldError,
  },
  data() {
    return {
      isSending: false,
      year: new Date().getFullYear().toString(),
      generating_report: false,
    }
  },
  methods: {
    print() {
      this.$validator.validate().then(async (isValid) => {
        if (isValid) {
          this.isSending = true
          const data = await this.loadList(
            'print_production_trade_report',
            this.year
          )

          const doc = new JsPDF('landscape', 'mm', 'a4')
          const pageHeight =
            doc.internal.pageSize.height || doc.internal.pageSize.getHeight()
          const pageWidth =
            doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
          const margin = 10

          doc.setLineWidth(0.3)

          // imprime o título
          doc.setFontSize(11)
          let line = margin
          doc.text('Anexo I', pageWidth / 2, line, 'center')
          line += 6
          doc.text(
            'RELATÓRIO ANUAL DE PRODUÇÃO E COMERCIALIZAÇÃO DE SEMENTES',
            pageWidth / 2,
            line,
            'center'
          )

          // imprime o cabeçalho do relatório
          line += 4
          doc.rect(margin, line, pageWidth - margin * 2, 15)
          doc.line(margin + 186, line, margin + 186, line + 15)
          doc.line(margin + 226, line, margin + 226, line + 15)
          doc.setFontSize(9)
          line += 5
          doc.text('Produtor:', margin + 5, line)
          doc.text('RENASEM Nº:', margin + 190, line)
          doc.text('Ano referência da produção:', margin + 230, line)
          line += 6
          doc.text(data.network_name, margin + 5, line)
          doc.text(data.network_renasem || '', margin + 190, line)
          doc.text('' + this.year, margin + 230, line)

          // imprime o cabeçalho do detalhe
          line += 10
          doc.rect(margin, line, pageWidth - margin * 2, 18)
          doc.line(margin + 47, line, margin + 47, line + 18)
          doc.line(margin + 102, line, margin + 102, line + 18)
          doc.line(margin + 132, line, margin + 132, line + 18)
          doc.line(margin + 152, line, margin + 152, line + 18)
          doc.line(margin + 171, line, margin + 171, line + 18)
          doc.line(margin + 191, line, margin + 191, line + 18)
          doc.line(margin + 217, line, margin + 217, line + 18)
          doc.line(margin + 236, line, margin + 236, line + 18)
          doc.line(margin + 253, line, margin + 253, line + 18)
          doc.setFontSize(7)
          line += 5
          doc.text('Município da Coleta de Sementes (1)', margin + 5, line)
          doc.text('Nome científico', margin + 50, line)
          doc.text('Nome comum (2)', margin + 105, line)
          doc.text('Categoria (3)', margin + 135, line)
          doc.text(
            ['Saldo do', 'ano', 'anterior', '(kg)'],
            margin + 160,
            line,
            'center'
          )
          doc.text(['Produção', '(kg)'], margin + 180, line, 'center')
          doc.text(['Comercialização', '(kg)'], margin + 203, line, 'center')
          doc.text(['Outros', 'destinos', '(kg)'], margin + 225, line, 'center')
          doc.text(['Saldo', '(kg) (4)'], margin + 242, line, 'center')
          doc.text(
            ['Previsão de', 'produção (kg)', 'para o', 'próximo', 'Ano (5)'],
            margin + 264,
            line,
            'center'
          )

          // imprime os detalhes
          // eslint-disable-next-line no-unused-vars
          let totalLastYearBalance = 0
          // eslint-disable-next-line no-unused-vars
          let totalProduction = 0
          // eslint-disable-next-line no-unused-vars
          let totalCommercialization = 0
          // eslint-disable-next-line no-unused-vars
          let totalOthers = 0
          // eslint-disable-next-line no-unused-vars
          let totalBalance = 0
          // eslint-disable-next-line no-unused-vars
          let totalNextYearForecast = 0

          line += 9
          for (let i = 0; i < data.details.length; i++) {
            const detail = data.details[i]
            const textoMunicipioColeta = doc.splitTextToSize(
              detail.cities.join(', ').replace('’', ''),
              35
            )
            const textoNomeCientifico = doc.splitTextToSize(
              detail.seed_scientific_name,
              49
            )
            const textoNomeComum = doc.splitTextToSize(detail.seed_name, 25)
            const quantLinhasDetalhe = Math.max(
              textoMunicipioColeta.length,
              textoNomeCientifico.length,
              textoNomeComum.length
            )
            const alturaDetalhe = quantLinhasDetalhe * 3 + 2 /* margem */
            line += 4

            if (line + alturaDetalhe + 4 >= pageHeight - margin + 5) {
              line = margin - 4
              doc.addPage()
            }

            doc.rect(margin, line, pageWidth - margin * 2, alturaDetalhe)
            doc.line(margin + 47, line, margin + 47, line + alturaDetalhe)
            doc.line(margin + 102, line, margin + 102, line + alturaDetalhe)
            doc.line(margin + 132, line, margin + 132, line + alturaDetalhe)
            doc.line(margin + 152, line, margin + 152, line + alturaDetalhe)
            doc.line(margin + 171, line, margin + 171, line + alturaDetalhe)
            doc.line(margin + 191, line, margin + 191, line + alturaDetalhe)
            doc.line(margin + 217, line, margin + 217, line + alturaDetalhe)
            doc.line(margin + 236, line, margin + 236, line + alturaDetalhe)
            doc.line(margin + 253, line, margin + 253, line + alturaDetalhe)

            line += 3
            doc.text(textoMunicipioColeta, margin + 5, line)
            doc.text(textoNomeCientifico, margin + 50, line)
            doc.text(textoNomeComum, margin + 105, line)
            doc.setFontSize(6)
            doc.text(detail.seed_category, margin + 135, line)
            doc.setFontSize(7)
            doc.text('' + detail.last_year_balance, margin + 167, line, 'right')
            doc.text('' + detail.production, margin + 187, line, 'right')
            doc.text('' + detail.commercialization, margin + 213, line, 'right')
            doc.text('' + detail.others, margin + 232, line, 'right')
            doc.text('' + detail.balance, margin + 249, line, 'right')
            doc.text(
              '' + detail.next_year_forecast,
              margin + 273,
              line,
              'right'
            )

            line += alturaDetalhe - 7 /* margem superior e inferior do detail */

            totalLastYearBalance += detail.last_year_balance
            totalProduction += detail.production
            totalCommercialization += detail.commercialization
            totalOthers += detail.others
            totalBalance += detail.balance
            totalNextYearForecast += detail.next_year_forecast
          }

          // imprime os totalizadores do relatório
          line += 4
          const totalizationHeight = 7
          if (line + totalizationHeight >= pageHeight - margin + 5) {
            // nova página se necessário
            line = margin - 4
            doc.addPage()
          }

          doc.rect(margin, line, pageWidth - margin * 2, totalizationHeight)
          doc.line(margin + 152, line, margin + 152, line + totalizationHeight)
          doc.line(margin + 171, line, margin + 171, line + totalizationHeight)
          doc.line(margin + 191, line, margin + 191, line + totalizationHeight)
          doc.line(margin + 217, line, margin + 217, line + totalizationHeight)
          doc.line(margin + 236, line, margin + 236, line + totalizationHeight)
          doc.line(margin + 253, line, margin + 253, line + totalizationHeight)

          // arredonda para duas casas decimais
          totalLastYearBalance =
            Math.round((totalLastYearBalance + Number.EPSILON) * 100) / 100
          totalProduction =
            Math.round((totalProduction + Number.EPSILON) * 100) / 100
          totalCommercialization =
            Math.round((totalCommercialization + Number.EPSILON) * 100) / 100
          totalOthers = Math.round((totalOthers + Number.EPSILON) * 100) / 100
          totalBalance = Math.round((totalBalance + Number.EPSILON) * 100) / 100
          totalNextYearForecast =
            Math.round((totalNextYearForecast + Number.EPSILON) * 100) / 100

          line += 4
          doc.setFontSize(9)
          doc.text('TOTAL', margin + 135, line, 'center')
          doc.setFontSize(7)
          doc.text('' + totalLastYearBalance, margin + 167, line, 'right')
          doc.text('' + totalProduction, margin + 187, line, 'right')
          doc.text('' + totalCommercialization, margin + 213, line, 'right')
          doc.text('' + totalOthers, margin + 232, line, 'right')
          doc.text('' + totalBalance, margin + 249, line, 'right')
          doc.text('' + totalNextYearForecast, margin + 273, line, 'right')

          // imprime o sumário do relatório
          const summaryHeight = 45
          if (line + summaryHeight >= pageHeight - margin) {
            // nova página se necessário
            line = margin - 4
            doc.addPage()
          }

          line += 7
          doc.text(
            'OBSERVAÇÕES: (1) nome do município, onde as sementes foram coletadas, conforme a declaração de fonte de sementes; (2) Informar Cultivar, se for o caso; (3) Informar a Categoria: Identificada (I), Selecionada (S), Qualificada',
            margin,
            line
          )
          line += 4
          doc.text(
            '(Q) ou Testada (T); (4) Saldo = saldo do ano anterior + produção - (comercialização + outros destinos); (5) Informar a estimativa de produção de sementes (kg) para o ano seguinte ao ano referência deste Relatório.',
            margin,
            line
          )

          line += 4
          doc.rect(margin, line, pageWidth - margin * 2, 30)
          doc.line(pageWidth / 2, line, pageWidth / 2, line + 30)

          line += 4
          doc.setFontSize(9)
          doc.text('Local e Data:', margin + 5, line)
          doc.text('Assinatura do Produtor:', pageWidth / 2 + 5, line)

          line += 4
          const today = new Date().toLocaleDateString('pt-BR', {
            dateStyle: 'long',
          })
          doc.text(`${data.network_city}, ${today}`, margin + 5, line)

          // imprime a paginação
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFont('helvetica', 'italic')
          doc.setFontSize(8)
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.text(
              `Página ${i} de ${pageCount}`,
              pageWidth - margin - 18,
              pageHeight - margin + 5
            )
          }

          // doc.save('relatorio-anual-producao-comercializacao-sementes.pdf');

          window.open(doc.output('bloburl'))
          this.isSending = false
        }
      })
    },
  },
}
</script>
