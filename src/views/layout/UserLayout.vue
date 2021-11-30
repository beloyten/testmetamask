<template>
  <div>
    <MainHeader/>
    <div id="wrapper">
      <section class="account-info section bg-gray-color full-height" id="page-cms-user">
        <div class="section-container">
          <div class="section-title" v-if="$route.meta && $route.meta.title">
            <h2 class="title shorten-text">{{ $t($route.meta.title) }}</h2>
          </div>
          <!-- End system notify -->
          <transition-page>
            <router-view/>
          </transition-page>
        </div>
      </section>
      <!-- Account Info -->
    </div>
    <MainFooter/>
  </div>
</template>
<script>
import TransitionPage from '@/components/TransitionPage.vue'
import MainFooter from '@/components/MainFooter'
import MainHeader from '@/components/MainHeader'
export default {
  components: {
    TransitionPage,
    MainHeader,
    MainFooter
  }
}
</script>
