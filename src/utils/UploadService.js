import Vue from 'vue'
export default new Vue({
  methods: {
    upload (formData) {
      const photos = formData.getAll('photos')
      const promises = photos.map((x) => this.getImage(x)
        .then(img => ({
          id: img,
          originalName: x.name,
          fileName: x.name,
          url: img
        })))
      return Promise.all(promises)
    },
    getImage (file) {
      return new Promise((resolve, reject) => {
        const fReader = new FileReader()
        const img = document.createElement('img')
        fReader.onload = () => {
          img.src = fReader.result
          resolve(this.getBase64Image(img))
        }
        fReader.readAsDataURL(file)
      })
    },
    getBase64Image (img) {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const dataURL = img.src
      return dataURL
    },
    wait (ms) {
      return (x) => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms))
      }
    }
  }
})
