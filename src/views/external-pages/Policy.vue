<template>
  <div class="tb-container">
    <div class="external-page">
      <div class="white-box">
        <h2 v-html="$t('TEXT_POLICY_TITLE', { name: broker.toUpperCase() })"></h2>
        <div v-html="$t('TEXT_POLICY_BLOCK_1', { name: broker.toUpperCase() })"></div>
        <div v-html="$t('TEXT_POLICY_BLOCK_2', { name: broker.toUpperCase() })"></div>
        <div v-html="$t('TEXT_POLICY_BLOCK_3', { name: broker.toUpperCase() })"></div>
        <div v-html="$t('TEXT_POLICY_BLOCK_4', { name: broker.toUpperCase() })"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    broker () {
      return this.$store.getters.configs.broker || ''
    }
  }
}
</script>
