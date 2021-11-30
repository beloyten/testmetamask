<template>
  <div>
    <MainHeader/>
    <div class="page-error">
      <transition-page>
        <router-view/>
      </transition-page>
    </div>
    <MainFooter/>
  </div>
</template>

<script>
import TransitionPage from '@/components/TransitionPage.vue'
import MainFooter from '@/components/MainFooter'
import MainHeader from '@/components/MainHeader'
export default {
  name: 'Error',
  components: {
    TransitionPage,
    MainHeader,
    MainFooter
  },
  created () {
    // Get configs and language
    this.$store.dispatch('getSystemConfigs')
  }
}
</script>
