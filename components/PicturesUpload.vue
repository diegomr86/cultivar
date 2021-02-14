<template>
  <div class="pictures-upload">
    <b-form-group
      v-show="!isLoading"
      :label="labelText"
      :description="
        'Selecione um ' +
        (multiple ? 'ou mais arquivos' : 'arquivo') +
        ' no formato PNG, GIF, JPG ou JPEG, com no máximo 32 MB.'
      "
    >
      <b-form-file
        :multiple="multiple"
        accept="image/*"
        @change="uploadImages"
      ></b-form-file>
      <span v-show="error" class="text-danger">{{ error }}</span>
    </b-form-group>
    <div v-if="!isLoading" class="row images_preview">
      <template v-if="Array.isArray(value) && value.length > 0">
        <div v-for="(image, index) in value" :key="index" class="col-sm-3">
          <b-img :src="baseUrl + image.thumb" fluid thumbnail />
          <div class="text-center">
            <a class="btn btn-secondary btn-sm" @click="deleteImage(index)"
              ><i class="fa fa-trash"></i
            ></a>
          </div>
        </div>
      </template>
      <template v-if="!Array.isArray(value) && value && value.thumb">
        <div class="col-sm-3">
          <b-img :src="baseUrl + value.thumb" fluid thumbnail />
          <div class="text-center">
            <a class="btn btn-secondary btn-sm" @click="deleteImage()"
              ><i class="fa fa-trash"></i
            ></a>
          </div>
        </div>
      </template>
    </div>
    <loading :loading="isLoading" msg="Enviando foto" />
  </div>
</template>

<script>
import Loading from './Loading'

export default {
  name: 'PicturesUpload',
  components: {
    Loading,
  },
  inject: ['$validator'],
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
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    labelText() {
      if (this.label) {
        return this.label
      } else {
        return 'Foto' + (this.multiple ? 's' : '')
      }
    },
  },
  methods: {
    uploadImages(e) {
      this.isLoading = true
      this.error = null
      const files = e.target.files

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('image', file, file.name)
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
    deleteImage(index) {
      if (this.multiple) {
        this.$emit(
          'input',
          this.value.filter((item, i) => i !== index)
        )
      } else {
        this.$emit('input', null)
      }
    },
  },
}
</script>
