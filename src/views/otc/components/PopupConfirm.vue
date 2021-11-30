<template>
  <div class="overlay">
    <div class="form confirm-form">
      <div class="form-title">
        {{message}}
      </div>
      <div class="form-action">
        <div class="btn" @click="closePopup()">Confirm</div>
        <div class="btn btn-cancel" @click="closePopup()">Close</div>
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
