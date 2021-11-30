<template>
  <div>
    <form v-if="isInitial || isSaving" enctype="multipart/form-data" novalidate>
      <div :class="{ 'loading': isSaving }" class="add_btn display-flex-space-bt display-flex-align-center">
        <input
          :name="uploadFieldName"
          :disabled="isSaving"
          type="file"
          accept="image/*"
          class="input-file"
          @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
          ref="fileInput"
        >
        <p v-if="isInitial">
          <span><i class="hb_icon_add"/>{{ title }}</span>
        </p>
        <img :src="imgSrc" alt="PhotoID">
      </div>
    </form>
    <!--SUCCESS-->
    <div v-if="isSuccess" class="add_btn btn-relative display-flex-align-center display-flex-center">
      <div v-for="(item, index) in uploadedFiles" :key="index">
        <img :src="item.url" :alt="item.originalName" class="img-responsive">
      </div>
      <div class="action-btn">
        <a href="javascript:void(0)" @click="newImg()">{{ $t('TEXT_UPLOAD_AGAIN') }}</a>
      </div>
    </div>
    <!--FAILED-->
    <div v-if="isFailed">
      <h2>{{ $t('TEXT_UPLOAD_FAILED') }}</h2>
      <p>
        <a href="javascript:void(0)" @click="reset()">{{ $t('TEXT_TRY_AGAIN') }}</a>
      </p>
      <pre>{{ uploadError }}</pre>
    </div>
  </div>
</template>
<script>
// swap as you need
import UploadService from '@/utils/UploadService' // fake service
import CONSTANT from '@/configs/constant'
const STATUS_INITIAL = 0; const STATUS_SAVING = 1; const STATUS_SUCCESS = 2; const STATUS_FAILED = 3
export default {
  name: 'App',
  props: ['title', 'imgSrc', 'imgKey'],
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos',
      isProcessing: false
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
      this.$store.dispatch('setImages', null)
    },
    newImg () {
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
      const image = {}
      image.key = this.imgKey
      image.base64Img = ''
      this.$store.dispatch('setImages', image)
    },
    save (formData) {
      // upload data to the server
      this.uploadError = 'test'
      this.currentStatus = STATUS_SAVING
      UploadService.upload(formData)
        .then(UploadService.wait(1500)) // DEV ONLY: wait for 1.5s
        .then(x => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
          const image = {}
          image.key = this.imgKey
          image.base64Img = this.uploadedFiles.length ? this.uploadedFiles[0].url : ''
          this.$store.dispatch('setImages', image)
        })
        .catch(err => {
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
        })
    },
    filesChange (fieldName, fileList) {
      // handle file changes
      const formData = new FormData()
      if (!fileList.length) return
      let file = fileList[0]
      if (file) {
        if (file.size > CONSTANT.MAX_IMAGE_SIZE) {
          const input = this.$refs.fileInput
          input.value = ''
          this.$store.dispatch('showErrorMsg', this.$t('MSG_OVER_MAX_IMAGE_SIZE'))
          return
        }
      }
      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
      // save it
      this.save(formData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add_btn {
    padding: 0 10px;
    img {
      margin-left: 5px;
    }
    &.btn-relative {
      .action-btn {
        line-height: 1.4em;
        font-size: 14px;
        width: 100px;
      }
    }
  }
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
  img {
    max-height: 100px;
  }
</style>
