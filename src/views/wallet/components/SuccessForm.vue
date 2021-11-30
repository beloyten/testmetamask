<template>
  <div class="overlay">
    <div class="form success-form">
      <div class="form-title">
        {{message}}
      </div>
      <div class="form-image">
        <img src="/assets/images/success-image.svg" alt="" />
      </div>
      <div class="form-action">
        <div class="btn" @click="closePopup()">Done</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['message', 'openForm'],
  methods: {
    closePopup () {
      this.$emit('update:openForm', false)
    }
  }
}
</script>
