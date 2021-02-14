<template>
  <div class="label-and-term">
    <breadcrumb active="Declaração de Fonte de Sementes" />
    <div class="panel">
      <div class="panel-body">
        <div class="row panel-title">
          <div class="col-sm-12">
            <h1>Declaração de Fonte de Sementes</h1>
          </div>
        </div>
        <div class="info-content">
          <div class="filters gray">
            <div class="row">
              <div class="col-sm-3">
                <b-form-group label="Ano de Comercialização *">
                  <b-form-input
                    v-model="form.year"
                    v-validate="'required'"
                    name="year"
                  />
                  <field-error :msg="veeErrors" field="year" />
                </b-form-group>
              </div>
              <div class="col-sm-9">
                <b-form-group label="Cidades">
                  <form-entity-select v-model="form.city" :items="cities" />
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
import FormEntitySelect from '@/components/FormEntitySelect'
import meses from '@/data/meses.json'
import categoriasDeMatrizes from '@/data/categorias-de-matrizes.json'
import origensDeMatrizes from '@/data/origens-de-matrizes.json'
import JsPDF from 'jspdf'

export default {
  name: 'DeclarationOfSeedsSourceReport',
  components: {
    Loading,
    Breadcrumb,
    FieldError,
    FormEntitySelect,
  },
  data() {
    return {
      isSending: false,
      generating_report: false,
      cities: [],
      form: {
        year: new Date().getFullYear().toString(),
        city: '',
      },
    }
  },
  async created() {
    this.cities = (await this.loadList('collection_areas/cities'))
      .map((city) => ({
        id: city,
        title: city,
      }))
      .sort(function (a, b) {
        return a.title.localeCompare(b.title)
      })
  },
  methods: {
    print() {
      this.$validator.validate().then(async (isValid) => {
        if (isValid) {
          this.isSending = true
          const data = await this.loadList(
            'print_declaration_of_seeds_source_report',
            { year: this.form.year, city: this.form.city }
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
          doc.text('Anexo IV', pageWidth / 2, line, 'center')
          line += 6
          doc.text(
            'DECLARAÇÃO DE FONTE DE SEMENTES',
            pageWidth / 2,
            line,
            'center'
          )

          // imprime o cabeçalho do relatório
          line += 4
          doc.rect(margin, line, pageWidth - margin * 2, 16)
          doc.line(margin, line + 8, margin + 226, line + 8)
          doc.line(margin + 146, line, margin + 146, line + 16)
          doc.line(margin + 226, line, margin + 226, line + 16)
          doc.setFontSize(9)
          line += 5
          doc.text('Produtor:', margin + 5, line)
          doc.text('RENASEM Nº:', margin + 150, line)
          doc.text('Anos de produção:', margin + 230, line)
          doc.text(data.network_name, margin + 20, line)
          doc.text(data.network_renasem || '', margin + 172, line)
          line += 8
          doc.text('Responsável Técnico:', margin + 5, line)
          doc.text('RENASEM Nº:', margin + 150, line)
          doc.text(data.responsible_technician_name, margin + 40, line)
          doc.text(
            data.responsible_technician_renasem || '',
            margin + 172,
            line
          )
          doc.text('' + this.year, margin + 230, line)

          // **************************************************************
          // imprime o cabeçalho da área "MATRIZ (utilizado para plantas isoladas)"
          line += 12
          doc.text('MATRIZ (utilizado para plantas isoladas)', margin, line)
          line += 2
          doc.rect(margin, line, pageWidth - margin * 2, 15)
          doc.line(margin + 45, line, margin + 45, line + 15)
          doc.line(margin + 83, line, margin + 83, line + 15)
          doc.line(margin + 117, line, margin + 117, line + 15)
          doc.line(margin + 144, line, margin + 144, line + 15)
          doc.line(margin + 166, line, margin + 166, line + 15)
          doc.line(margin + 188, line, margin + 188, line + 15)
          doc.line(margin + 227, line, margin + 227, line + 15)
          doc.line(margin + 253, line, margin + 253, line + 15)
          doc.line(margin + 188, line + 9, margin + 227, line + 9)
          doc.line(margin + 207, line + 9, margin + 207, line + 15)

          line += 5
          doc.text(
            ['Município da', 'Coleta de', 'Sementes (1)'],
            margin + 23,
            line,
            'center'
          )
          doc.text('Nome científico', margin + 65, line, 'center')

          doc.text('Nome comum (2)', margin + 100, line, 'center')
          doc.text('Categoria (3)', margin + 130, line, 'center')
          doc.text(['Critério de', 'Seleção (4)'], margin + 155, line, 'center')
          doc.text(['Natural ou', 'Plantada (5)'], margin + 177, line, 'center')
          doc.text(
            ['Coordenadas Geográficas', "(xxºxx'xx')"],
            margin + 207,
            line,
            'center'
          )
          line += 7
          doc.text('Latitude', margin + 198, line, 'center')
          doc.text('Longitude', margin + 215, line, 'center')
          line -= 7
          doc.text(
            ['Identificação', 'da Matriz (6)'],
            margin + 240,
            line,
            'center'
          )
          doc.text(
            ['Meses', 'prováveis', 'de coleta'],
            margin + 264,
            line,
            'center'
          )

          // imprime as matrizes
          line += 10
          for (let i = 0; i < data.matrixes.length; i++) {
            const matrix = data.matrixes[i]
            const categoria = categoriasDeMatrizes.find(
              (cat) => cat.value === matrix.category
            ).text
            const origem = origensDeMatrizes.find(
              (orig) => orig.value === matrix.source
            ).text
            const collecMonths = doc.splitTextToSize(
              matrix.collec_months
                .map((month) => meses.find((m) => m.value === month).text)
                .join(', '),
              20
            )
            const lat = doc.splitTextToSize(matrix.geolocation.lat, 15)
            const lng = doc.splitTextToSize(matrix.geolocation.lng, 15)
            const textCodigo = doc.splitTextToSize(matrix.code, 20)
            const textoCidade = doc.splitTextToSize(matrix.city, 45)
            const textoNomeCientifico = doc.splitTextToSize(
              matrix.scientific_name,
              30
            )
            const textoNomeComum = doc.splitTextToSize(matrix.name, 30)
            const quantLinhasDetalhe = Math.max(
              textoCidade.length,
              textoNomeCientifico.length,
              textoNomeComum.length,
              collecMonths.length,
              lat.length,
              lng.length,
              textCodigo.length
            )

            let alturaDetalhe = 5 /* conteúdo */
            if (quantLinhasDetalhe > 1) {
              // caso o texto tenha mais de uma linha, da segunda linha em diante, a altura é 3 (pois tem menos espaçamento)
              alturaDetalhe += (quantLinhasDetalhe - 1) * 4
            }

            if (line + alturaDetalhe * 2 >= pageHeight - margin + 5) {
              line = margin
              doc.addPage()
              doc.line(margin, line, pageWidth - margin, line)
            }

            doc.line(margin, line, margin, line + alturaDetalhe)
            doc.line(
              pageWidth - margin,
              line,
              pageWidth - margin,
              line + alturaDetalhe
            )
            doc.line(
              margin,
              line + alturaDetalhe,
              pageWidth - margin,
              line + alturaDetalhe
            )
            doc.line(margin + 45, line, margin + 45, line + alturaDetalhe)
            doc.line(margin + 83, line, margin + 83, line + alturaDetalhe)
            doc.line(margin + 117, line, margin + 117, line + alturaDetalhe)
            doc.line(margin + 144, line, margin + 144, line + alturaDetalhe)
            doc.line(margin + 166, line, margin + 166, line + alturaDetalhe)
            doc.line(margin + 188, line, margin + 188, line + alturaDetalhe)
            doc.line(margin + 227, line, margin + 227, line + alturaDetalhe)
            doc.line(margin + 253, line, margin + 253, line + alturaDetalhe)
            doc.line(margin + 207, line, margin + 207, line + alturaDetalhe)

            const marginText = 4
            doc.text(textoCidade, margin + 5, line + marginText)
            doc.text(textoNomeCientifico, margin + 50, line + marginText)
            doc.text(textoNomeComum, margin + 87, line + marginText)
            doc.text(categoria, margin + 119, line + marginText)
            doc.text(origem, margin + 168, line + marginText)
            doc.text(lat, margin + 190, line + marginText)
            doc.text(lng, margin + 209, line + marginText)
            doc.text(textCodigo, margin + 230, line + marginText)
            doc.text(collecMonths, margin + 255, line + marginText)

            line += alturaDetalhe
          }

          line += 8
          const textoObs1 = [
            'OBSERVAÇÕES: (1) nome do município onde as sementes serão coletadas ou produzidas; (2) Informar Cultivar, se for o caso; (3) Informar a Categoria: Identificada (I), Selecionada (S), Qualificada (Q) ou Testada (T); (4) Para os',
            'casos das categorias Selecionada, Qualificada e Testada; (5) No caso de a Matriz ter sido plantada, o produtor deverá apresentar, quando solicitado, a nota fiscal e o Termo de Conformidade ou declaração do Responsável Técnico',
            'sobre a procedência do material de propagação; (6) Nome ou código de identificação da Matriz.',
          ]
          doc.setFontSize(7)
          doc.text(textoObs1, margin, line, 'left')
          doc.setFontSize(9)

          // **************************************************************
          // imprime o cabeçalho da área "ÁREA DE COLETA DE SEMENTES - ACS (CATEGORIA IDENTIFICADA)"
          line += 12
          doc.text(
            'ÁREA DE COLETA DE SEMENTES - ACS (CATEGORIA IDENTIFICADA)',
            margin,
            line
          )
          line += 2

          // cidades das áreas de coleta
          const cities = []
          data.collection_areas.forEach((collectionArea) => {
            if (
              collectionArea.city &&
              !cities.find((city) => city === collectionArea.city)
            ) {
              cities.push(collectionArea.city)
            }
          })

          cities.forEach((city) => {
            // filtra áreas de coleta conforme cada cidade
            const collectionAreas = []
            data.collection_areas.forEach((collectionArea) => {
              if (collectionArea.city === city) {
                collectionAreas.push(collectionArea)
              }
            })

            doc.rect(margin, line, pageWidth - margin * 2, 5)
            doc.line(margin + 117, line, margin + 117, line + 5)
            line += 3.5
            doc.text('Área total da ACS (ha):', margin + 5, line)
            doc.text('Município da Coleta de Sementes (1):', margin + 122, line)

            const estimatedArea = collectionAreas.reduce(
              (total, area) => (total += area.estimatedArea),
              0
            )
            doc.text(estimatedArea.toString(), margin + 40, line)

            const cidade =
              collectionAreas.length > 0 ? collectionAreas[0].city : ''
            doc.text(cidade, margin + 180, line)

            line += 1.5
            doc.line(margin, line, margin, line + 5)
            doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
            doc.line(margin, line + 5, pageWidth - margin, line + 5)
            doc.line(margin + 117, line, margin + 117, line + 5)
            doc.line(margin + 167, line, margin + 167, line + 5)
            line += 3
            doc.text('Coordenadas Geográficas (xxºxx\'xx")', margin + 5, line)
            doc.text('Latitude: em anexo (1)', margin + 122, line)
            doc.text('Longitude: em anexo (1)', margin + 172, line)

            line += 2
            doc.line(margin, line, margin, line + 5)
            doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
            doc.line(margin, line + 5, pageWidth - margin, line + 5)
            doc.line(margin + 117, line, margin + 117, line + 5)
            doc.line(margin + 167, line, margin + 167, line + 5)
            doc.line(margin + 197, line, margin + 197, line + 5)
            doc.line(margin + 227, line, margin + 227, line + 5)
            line += 3
            doc.text('Nome científico', margin + 55, line, 'center')
            doc.text('Nome comum (2)', margin + 142, line, 'center')
            doc.setFontSize(7)
            doc.text('Nº de Matrizes na ACS', margin + 182, line, 'center')
            doc.text('Natural ou Plantada (3)', margin + 212, line, 'center')
            doc.setFontSize(9)
            doc.text('Meses prováveis de coleta', margin + 252, line, 'center')

            // imprime as áreas de coleta
            line += 2
            for (let i = 0; i < collectionAreas.length; i++) {
              const collectionArea = collectionAreas[i]
              const origem = collectionArea.source
                ? origensDeMatrizes.find(
                    (orig) => orig.value === collectionArea.source
                  ).text
                : ''
              const collecMonths =
                collectionArea.collec_months.length > 0
                  ? doc.splitTextToSize(
                      collectionArea.collec_months
                        .map(
                          (month) => meses.find((m) => m.value === month).text
                        )
                        .join(', '),
                      50
                    )
                  : ''
              const textoCidade = doc.splitTextToSize(collectionArea.city, 45)
              const textoNomeCientifico = doc.splitTextToSize(
                collectionArea.scientific_name,
                100
              )
              const textoNomeComum = doc.splitTextToSize(
                collectionArea.name,
                40
              )
              const quantLinhasDetalhe = Math.max(
                textoCidade.length,
                textoNomeCientifico.length,
                textoNomeComum.length,
                collecMonths.length
              )

              let alturaDetalhe = 5 /* conteúdo */
              if (quantLinhasDetalhe > 1) {
                // caso o texto tenha mais de uma linha, da segunda linha em diante, a altura é 3 (pois tem menos espaçamento)
                alturaDetalhe += (quantLinhasDetalhe - 1) * 4
              }

              if (line + alturaDetalhe * 2 >= pageHeight - margin + 5) {
                line = margin
                doc.addPage()
                doc.line(margin, line, pageWidth - margin, line)
              }

              doc.line(margin, line, margin, line + alturaDetalhe)
              doc.line(
                pageWidth - margin,
                line,
                pageWidth - margin,
                line + alturaDetalhe
              )
              doc.line(
                margin,
                line + alturaDetalhe,
                pageWidth - margin,
                line + alturaDetalhe
              )
              doc.line(margin + 117, line, margin + 117, line + alturaDetalhe)
              doc.line(margin + 167, line, margin + 167, line + alturaDetalhe)
              doc.line(margin + 197, line, margin + 197, line + alturaDetalhe)
              doc.line(margin + 227, line, margin + 227, line + alturaDetalhe)

              const marginText = 4
              doc.text(textoNomeCientifico, margin + 5, line + marginText)
              doc.text(textoNomeComum, margin + 121, line + marginText)
              doc.text(origem, margin + 200, line + marginText)
              doc.text(collecMonths, margin + 230, line + marginText)

              line += alturaDetalhe + 2
            }
          })

          line += 3
          const textoObs2 = [
            'OBSERVAÇÕES: (1) nome do município onde as sementes serão coletadas ou produzidas; (2) Informar Cultivar, se for o caso; (3) No caso de a Matriz ter sido plantada, o produtor deverá apresentar, quando solicitado, a nota fiscal',
            'e o Termo de Conformidade ou declaração do Responsável Técnico sobre a procedência do material de propagação.',
          ]
          doc.setFontSize(7)
          doc.text(textoObs2, margin, line)
          doc.setFontSize(9)

          // **************************************************************
          // imprime o cabeçalho da área "ÁREA DE COLETA DE SEMENTES COM MATRIZES SELECIONADAS - ACS-MS (CATEGORIA SELECIONADA)"
          line += 10
          let totalizationHeight = 32
          if (line + totalizationHeight >= pageHeight - margin + 5) {
            // nova página se necessário
            line = margin
            doc.addPage()
          }

          doc.text(
            'ÁREA DE COLETA DE SEMENTES COM MATRIZES SELECIONADAS - ACS-MS (CATEGORIA SELECIONADA)',
            margin,
            line
          )
          line += 2
          doc.rect(margin, line, pageWidth - margin * 2, 5)
          doc.line(margin + 117, line, margin + 117, line + 5)
          line += 3.5
          doc.text('Área total da ACS-MS (ha):', margin + 5, line)
          doc.text('Município da Coleta de Sementes (1):', margin + 122, line)
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 117, line, margin + 117, line + 5)
          doc.line(margin + 180, line, margin + 180, line + 5)
          line += 3
          doc.text('Coordenadas Geográficas (xxºxx\'xx")', margin + 5, line)
          doc.text('Latitude:', margin + 122, line)
          doc.text('Longitude:', margin + 185, line)

          line += 2
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 60, line, margin + 60, line + 5)
          doc.line(margin + 117, line, margin + 117, line + 5)
          doc.line(margin + 149, line, margin + 149, line + 5)
          doc.line(margin + 180, line, margin + 180, line + 5)
          doc.line(margin + 208, line, margin + 208, line + 5)
          doc.line(margin + 240, line, margin + 240, line + 5)
          line += 3
          doc.text('Nome científico', margin + 30, line, 'center')
          doc.text('Nome comum (2)', margin + 90, line, 'center')
          doc.setFontSize(7)
          doc.text('Nº de Matrizes na ACS', margin + 133, line, 'center')
          doc.text('Natural ou Plantada (3)', margin + 164, line, 'center')
          doc.text('Critério de seleção', margin + 194, line, 'center')
          doc.text('Intensidade de seleção', margin + 224, line, 'center')
          doc.text('Meses prováveis de coleta', margin + 258, line, 'center')
          doc.setFontSize(9)

          // imprime as linhas em branco
          line += 2
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 60, line, margin + 60, line + 5)
          doc.line(margin + 117, line, margin + 117, line + 5)
          doc.line(margin + 149, line, margin + 149, line + 5)
          doc.line(margin + 180, line, margin + 180, line + 5)
          doc.line(margin + 208, line, margin + 208, line + 5)
          doc.line(margin + 240, line, margin + 240, line + 5)
          line += 5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 60, line, margin + 60, line + 5)
          doc.line(margin + 117, line, margin + 117, line + 5)
          doc.line(margin + 149, line, margin + 149, line + 5)
          doc.line(margin + 180, line, margin + 180, line + 5)
          doc.line(margin + 208, line, margin + 208, line + 5)
          doc.line(margin + 240, line, margin + 240, line + 5)

          line += 8
          const textoObs3 = [
            'OBSERVAÇÕES: (1) nome do município onde as sementes serão coletadas ou produzidas; (2) Informar Cultivar, se for o caso; (3) No caso de a Matriz ter sido plantada, o produtor deverá apresentar, quando solicitado, a nota fiscal',
            'e o Termo de Conformidade ou declaração do Responsável Técnico sobre a procedência do material de propagação.',
          ]
          doc.setFontSize(7)
          doc.text(textoObs3, margin, line, 'left')
          doc.setFontSize(9)

          // **************************************************************
          // imprime o cabeçalho da área "ÁREA DE PRODUÇÃO DE SEMENTES - APS (CATEGORIA QUALIFICADA)"
          line += 10
          totalizationHeight = 35
          if (line + totalizationHeight >= pageHeight - margin + 5) {
            // nova página se necessário
            line = margin
            doc.addPage()
          }

          doc.text(
            'ÁREA DE PRODUÇÃO DE SEMENTES - APS (CATEGORIA QUALIFICADA)',
            margin,
            line
          )
          line += 2
          doc.rect(margin, line, pageWidth - margin * 2, 5)
          doc.line(margin + 65, line, margin + 65, line + 5)
          line += 3.5
          doc.text('Área total da APS (ha):', margin + 5, line)
          doc.text('Município da Coleta de Sementes (1):', margin + 68, line)
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 65, line, margin + 65, line + 5)
          doc.line(margin + 155, line, margin + 155, line + 5)
          doc.line(margin + 210, line, margin + 210, line + 5)
          line += 3
          doc.text('Coordenadas Geográficas (xxºxx\'xx")', margin + 5, line)
          doc.text('Latitude:', margin + 68, line)
          doc.text('Longitude:', margin + 160, line)
          doc.text('Altitude (m):', margin + 215, line)

          line += 2
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 35, line, margin + 35, line + 5)
          doc.line(margin + 65, line, margin + 65, line + 5)
          doc.line(margin + 95, line, margin + 95, line + 5)
          doc.line(margin + 126, line, margin + 126, line + 5)
          doc.line(margin + 155, line, margin + 155, line + 5)
          doc.line(margin + 187, line, margin + 187, line + 5)
          doc.line(margin + 234, line, margin + 234, line + 5)
          line += 3
          doc.text('Nome científico', margin + 17, line, 'center')
          doc.text('Nome comum (2)', margin + 49, line, 'center')
          doc.setFontSize(7)
          doc.text('Nº de Matrizes na ACS', margin + 80, line, 'center')
          doc.text('Natural ou Plantada (3)', margin + 111, line, 'center')
          doc.text('Critério de seleção', margin + 140, line, 'center')
          doc.text('Intensidade de seleção', margin + 171, line, 'center')
          doc.text(
            'Geração da Produção da Semente (4)',
            margin + 210,
            line,
            'center'
          )
          doc.text('Meses prováveis de coleta', margin + 256, line, 'center')
          doc.setFontSize(9)

          // imprime as linhas em branco
          line += 2
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 35, line, margin + 35, line + 5)
          doc.line(margin + 65, line, margin + 65, line + 5)
          doc.line(margin + 95, line, margin + 95, line + 5)
          doc.line(margin + 126, line, margin + 126, line + 5)
          doc.line(margin + 155, line, margin + 155, line + 5)
          doc.line(margin + 187, line, margin + 187, line + 5)
          doc.line(margin + 234, line, margin + 234, line + 5)
          line += 5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 35, line, margin + 35, line + 5)
          doc.line(margin + 65, line, margin + 65, line + 5)
          doc.line(margin + 95, line, margin + 95, line + 5)
          doc.line(margin + 126, line, margin + 126, line + 5)
          doc.line(margin + 155, line, margin + 155, line + 5)
          doc.line(margin + 187, line, margin + 187, line + 5)
          doc.line(margin + 234, line, margin + 234, line + 5)

          line += 8
          const textoObs4 = [
            'OBSERVAÇÕES: (1) nome do município onde as sementes serão coletadas ou produzidas; (2) Informar Cultivar, se for o caso; (3) No caso de a Matriz ter sido plantada, o produtor deverá apresentar, quando solicitado, a nota fiscal',
            'e o Termo de Conformidade ou declaração do Responsável Técnico sobre a procedência do material de propagação; (4) Informar qual é a geração da produção de sementes, quando a APS for plantada: 1ª Geração, 2ª Geração, 3ª',
            'Geração',
          ]
          doc.setFontSize(7)
          doc.text(textoObs4, margin, line)
          doc.setFontSize(9)

          // **************************************************************
          // imprime o cabeçalho da área "POMAR DE SEMENTES - PS (utilizar uma planilha por pomar para cada espécie/cultivar)"
          line += 10
          totalizationHeight = 35
          if (line + totalizationHeight >= pageHeight - margin + 5) {
            // nova página se necessário
            line = margin
            doc.addPage()
          }

          doc.text(
            'POMAR DE SEMENTES - PS (utilizar uma planilha por pomar para cada espécie/cultivar)',
            margin,
            line
          )
          line += 2
          doc.rect(margin, line, pageWidth - margin * 2, 5)
          doc.line(margin + 63, line, margin + 63, line + 5)
          doc.line(margin + 120, line, margin + 120, line + 5)
          line += 3.5
          doc.text('Tipo de Pomar', margin + 5, line)
          doc.setFontSize(8)
          doc.text('( ) Pomar de Sementes por Mudas - PSM', margin + 65, line)
          doc.setFontSize(9)
          doc.text(
            '( ) Pomar de Sementes por Mudas TESTADO - PSMt',
            margin + 123,
            line
          )
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 63, line, margin + 63, line + 5)
          doc.line(margin + 120, line, margin + 120, line + 5)
          line += 3.5
          doc.setFontSize(8)
          doc.text('( ) Pomar Clonal de Sementes - PCS', margin + 65, line)
          doc.setFontSize(9)
          doc.text(
            '( ) Pomar Clonal de Sementes TESTADO - PCSt',
            margin + 123,
            line
          )
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 73, line, margin + 73, line + 5)
          doc.line(margin + 150, line, margin + 150, line + 5)
          line += 3.5
          doc.text('Área total do PS (ha):', margin + 5, line)
          doc.text('Município onde está instalado o PS (1):', margin + 77, line)
          doc.text(
            'Procedência do material utilizado no PS (2):',
            margin + 153,
            line
          )
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 73, line, margin + 73, line + 5)
          doc.line(margin + 135, line, margin + 135, line + 5)
          doc.line(margin + 200, line, margin + 200, line + 5)
          line += 3.5
          doc.text('Coordenadas Geográficas (xxºxx\'xx")', margin + 5, line)
          doc.text('Latitude:', margin + 77, line)
          doc.text('Longitude:', margin + 138, line)
          doc.text('Altitude (m)', margin + 203, line)
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 90, line, margin + 90, line + 5)
          doc.line(margin + 190, line, margin + 190, line + 5)
          line += 3.5
          doc.text('Espécie:', margin + 5, line)
          doc.text('Nome Comum:', margin + 93, line)
          doc.text('Cultivar:', margin + 193, line)
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 90, line, margin + 90, line + 5)
          doc.line(margin + 190, line, margin + 190, line + 5)
          line += 3.5
          doc.text('Nº de Matrizes no PS:', margin + 5, line)
          doc.text('Data do Plantio:', margin + 93, line)
          doc.text(
            'Categoria: ( ) Qualificada / ( ) Testada',
            margin + 193,
            line
          )
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 90, line, margin + 90, line + 5)
          doc.line(margin + 190, line, margin + 190, line + 5)
          line += 3.5
          doc.text(
            'Município(s) onde o material foi testado (3):',
            margin + 5,
            line
          )
          doc.text('Geração da Produção da Semente (4):', margin + 93, line)
          doc.text('Mês da Coleta:', margin + 193, line)
          line += 1.5
          doc.line(margin, line, margin, line + 5)
          doc.line(pageWidth - margin, line, pageWidth - margin, line + 5)
          doc.line(margin, line + 5, pageWidth - margin, line + 5)
          doc.line(margin + 90, line, margin + 90, line + 5)
          doc.line(margin + 190, line, margin + 190, line + 5)
          line += 3.5
          doc.text('Critério de Seleção:', margin + 5, line)
          doc.text('Intensidade de Seleção:', margin + 93, line)
          doc.text('Tipo de Isolamento:', margin + 193, line)

          line += 4.5
          const textoObs5 = [
            'OBSERVAÇÕES: (1) nome do município onde o Pomar de Sementes foi instalado; (2) Informar o município ou o país de procedência do material de propagação utilizado para a implantação do PS e, quando solicitado pela',
            'fiscalização, o produtor deverá apresentar: - a nota fiscal e o Termo de Conformidade; ou - a documentação de internalização; ou - declaração do Responsável Técnico sobre a procedência do material de propagação; (3) Informar,',
            'para a semente da categoria Testada, o(s) município(s) onde o(s) teste(s) de progênies foi(foram) instalados; (4) Informar qual é a geração da produção de sementes: 1ª Geração, 2ª Geração, 3ª Geração...',
          ]
          doc.setFontSize(7)
          doc.text(textoObs5, margin, line)
          doc.setFontSize(9)

          // **************************************************************
          // sumário do relatório
          line += 12
          totalizationHeight = 35
          if (line + totalizationHeight >= pageHeight - margin + 5) {
            // nova página se necessário
            line = margin
            doc.addPage()
          }

          const textoObs6 = [
            'Apresentar:',
            'I - Croqui ou roteiro de acesso à Fonte de Semente, na primeira declaração ou quando houver mudança de local; e',
            'II - Autorização do detentor dos direitos da propriedade intelectual da cultivar protegida no Brasil, quando for o caso.',
          ]
          doc.text(textoObs6, margin, line, 'left')

          line += 9
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

          // **************************************************************
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

          window.open(doc.output('bloburl'))
          this.isSending = false
        }
      })
    },
  },
}
</script>
