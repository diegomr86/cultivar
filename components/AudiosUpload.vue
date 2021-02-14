<template>
  <div class="audios-upload">
    <b-form-group
      v-show="!isLoading"
      :label="'Áudio' + (multiple ? 's' : '')"
      :description="
        'Selecione um ' +
        (multiple ? 'ou mais arquivos' : 'arquivo') +
        ' de áudio no formato MP3, MP4 ou WAV com no máximo 32 MB.'
      "
    >
      <b-form-file
        :multiple="multiple"
        accept="audio/*"
        @change="uploadAudios"
      ></b-form-file>
      <span v-show="error" class="text-danger">{{ error }}</span>
    </b-form-group>
    <div v-if="!isLoading" class="row">
      <div v-if="Array.isArray(value) && value.length > 0">
        <div v-for="(audio, index) in value" :key="index" class="col-sm-12">
          <a :href="baseUrl + audio" target="_blank"
            ><i class="fa fa-music" /> &nbsp; {{ audio | filename }}</a
          >
          <br />
          <audio :src="baseUrl + audio" controls></audio>
          <a
            class="btn btn-secondary btn-sm pull-right"
            @click="deleteAudio(index)"
            ><i class="fa fa-trash"></i
          ></a>
        </div>
      </div>
      <div v-if="!Array.isArray(value) && value">
        <div class="col-sm-12">
          <a :href="baseUrl + value" target="_blank"
            ><i class="fa fa-music" /> &nbsp; {{ value | filename }}</a
          >
          <br />
          <audio :src="baseUrl + value" controls></audio>
          <a class="btn btn-secondary btn-sm pull-right" @click="deleteAudio()"
            ><i class="fa fa-trash"></i
          ></a>
        </div>
      </div>
    </div>
    <loading :loading="isLoading" msg="Enviando áudio" />
  </div>
</template>

<script>
import Loading from './Loading'

export default {
  name: 'AudiosUpload',
  components: {
    loading: Loading,
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
  },
  methods: {
    uploadAudios(e) {
      this.isLoading = true
      this.error = null
      const files = e.target.files

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('audio', file, file.name)
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
    deleteAudio(index) {
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
