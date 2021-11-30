<template>
  <div>
    <MainHeader/>
    <div id='wrapper'>
      <router-view/>
    </div>
    <MainFooter/>
  </div>
</template>

<script>
import MainFooter from '@/components/MainFooter'
import MainHeader from '@/components/MainHeader'
import CheckSocket from '@/mixin/checksocket'
export default {
  components: {
    MainHeader,
    MainFooter
  },
  mixins: [ CheckSocket ]
}
</script>
