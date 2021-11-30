<template>
  <div class="overlay">
    <div class="form transfer-form">
      <div class="form-title">
        Withdraw
      </div>
      <div class="form-sub-title">
        Complete the information to make the transaction.
      </div>
      <form>
        <select>
          <option value="1">Coin</option>
          <option value="2">Bit</option>
        </select>
        <input type="number" v-model="amount" placeholder="Enter amount..." />
        <div class="row">
          <div class="row-item">
            <div class="row-label">From</div>
            <div class="row-content">
              <p>OTC Account</p>
              <span>( Balance 0.0000 TLC)</span>
            </div>
          </div>
          <div class="row-item">
            <div class="row-label">To</div>
            <div class="row-content">
              <p>Main Account</p>
              <span>( Balance 0.0000 TLC)</span>
            </div>
          </div>
        </div>
        <div class="form-action">
          <div class="btn btn-cancel" @click="closePopup()">Cancel</div>
          <div class="btn btn-transfer" @click="transfer()">transfer</div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      amount: null
    }
  },
  props: ['openForm', 'success'],
  methods: {
    closePopup () {
      this.$emit('update:openForm', false)
    },
    transfer () {
      if (!this.amount) {
        this.$store.dispatch('showErrorMsg', 'Vui lòng nhập số lượng.')
      } else {
        this.$emit('update:success', true)
        this.$emit('update:openForm', false)
      }
    }
  }
}
</script>
