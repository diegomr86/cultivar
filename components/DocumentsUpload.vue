<template>
  <div class="documents-upload">
    <b-form-group
      v-show="!isLoading"
      :label="'Documento' + (multiple ? 's' : '')"
      :description="
        'Selecione um ' +
        (multiple ? 'ou mais arquivos' : 'arquivo') +
        ' no formato PDF, JPG, JPEG, KMZ ou DOC, com no máximo 32 MB.'
      "
    >
      <b-form-file
        id="files"
        ref="files"
        :multiple="multiple"
        accept="application/msword, application/vnd.google-earth.kml+xml, image/*, application/pdf"
        @change="uploadDocuments"
      ></b-form-file>
      <span v-show="error" class="text-danger">{{ error }}</span>
    </b-form-group>
    <div v-if="!isLoading" class="row">
      <div v-if="Array.isArray(value) && value.length > 0">
        <div v-for="(doc, index) in value" :key="index" class="col-sm-12">
          <a :href="baseUrl + doc" target="_blank"
            ><i class="fa fa-download" /> {{ doc | filename }}</a
          >
          <a
            class="btn btn-secondary btn-sm pull-right"
            @click="deleteDocument(index)"
            ><i class="fa fa-trash"></i
          ></a>
        </div>
      </div>
      <div v-if="!Array.isArray(value) && value">
        <div class="col-sm-12">
          <a :href="baseUrl + value" target="_blank"
            ><i class="fa fa-download" /> {{ value | filename }}</a
          >
          <a
            class="btn btn-secondary btn-sm pull-right"
            @click="deleteDocument()"
            ><i class="fa fa-trash"></i
          ></a>
        </div>
      </div>
    </div>
    <loading :loading="isLoading" msg="Enviando documento" />
  </div>
</template>

<script>
import Loading from './Loading'

export default {
  name: 'DocumentsUpload',
  components: {
    loading: Loading,
  },
  props: {
    value: {
      type: [Object, Array],
      default: () => null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: null,
    },
  },
  methods: {
    uploadDocuments(e) {
      this.error = null
      this.isLoading = true
      const files = e.target.files || e.dataTransfer.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('document', file, file.name)
        this.$axios
          .$post(this.url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            if (this.multiple) {
              this.$emit('input', this.value.concat(response))
            } else {
              this.$emit('input', response)
            }
            this.isLoading = false
          })
          .catch((error) => {
            this.isLoading = false
            this.showError(error)
          })
      }
    },
    deleteDocument(index) {
      if (this.multiple) {
        this.$emit(
          'input',
          this.value.filter((item, i) => i !== index)
        )
      } else {
        this.$emit('input', null)
      }
    },
    fileName(doc) {
      if (doc) {
        const docUrl = doc.split('/')
        return docUrl[docUrl.length - 1]
      }
    },
  },
}
</script>
