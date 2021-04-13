<template>
  <div class="pictures-upload">
    <div v-if="type === 'avatar'">
      <a @click="clicked">
        <b-avatar
          size="6rem"
          :src="value && value.thumb ? baseURL + value.thumb : null"
        >
          <template #badge><i class="fa fa-camera"></i></template>
        </b-avatar>
        <p>{{ labelText }}</p>
        <input
          v-show="false"
          ref="pictures-upload-input"
          :multiple="multiple"
          accept="image/*"
          type="file"
          @change="uploadImages"
        />
      </a>
    </div>
    <div v-else>
      <b-form-group v-show="!is_loading" :label="labelText">
        <b-form-file
          :multiple="multiple"
          accept="image/*"
          @change="uploadImages"
        ></b-form-file>
      </b-form-group>
      <div v-if="!is_loading" class="row images_preview">
        <template v-if="Array.isArray(value) && value.length > 0">
          <div v-for="(image, index) in value" :key="index" class="col-sm-3">
            <b-img :src="baseURL + image.thumb" fluid thumbnail />
            <div class="text-center">
              <a class="btn btn-secondary btn-sm" @click="deleteImage(index)"
                ><i class="fa fa-trash"></i
              ></a>
            </div>
          </div>
        </template>
        <template v-if="!Array.isArray(value) && value && value.thumb">
          <div class="col-sm-3">
            <b-img :src="baseURL + value.thumb" fluid thumbnail />
            <div class="text-center">
              <a class="btn btn-secondary btn-sm" @click="deleteImage()"
                ><i class="fa fa-trash"></i
              ></a>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="is_loading" class="text-center">
      <i class="fa fa-spinner fa-spin" />
    </div>
  </div>
</template>

<script>
export default {
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
      default: '/api/uploads/images',
    },
    label: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      is_loading: false,
    }
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
      this.is_loading = true
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
            this.is_loading = false
          })
          .catch(this.showError)
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
    clicked() {
      console.log(this.$refs['pictures-upload-input'])
      this.$refs['pictures-upload-input'].click()
    },
  },
}
</script>
