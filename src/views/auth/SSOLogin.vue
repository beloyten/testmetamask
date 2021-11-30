<template>
  <div class="authentication-page">
    <span>{{ $tt('TEXT_PLEASE_WAITING_FOR_AUTHENTICATION', 'Please waiting for authentication') }}</span>
    <div>
      <span class="l-1"></span>
      <span class="l-2"></span>
      <span class="l-3"></span>
      <span class="l-4"></span>
      <span class="l-5"></span>
      <span class="l-6"></span>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import OidcService from '@/api/user/OidcService'
export default {
  data () {
    return {
      mgr: null,
      isProcessing: false
    }
  },
  mounted () {
    let code = this.$route.query.code
    if (!code) this.$router.push({ name: 'home' })
    let data = {}
    this.isProcessing = true
    OidcService.getSigninResponseState().then(async signState => {
      data.codeVerify = signState.state._code_verifier
      data.code = this.$route.query.code
      data.origin = window.location.origin + '/auth/callback'
      data.reCaptcha = await this.$google.getCaptcha('loginSSO')
      this.$store.dispatch('loginSSO', data).then(rs => {
        OidcService.endSigninCallback(signState, rs.data.accessToken, rs.data.idToken).then(user => {
          this.isProcessing = false
          rs && this.$store.dispatch('getUser') && router.push({ name: 'home' })
        })
      })
    }).catch(e => {
      console.log(e)
    })
  }
}
</script>

<style type="text/css" lang="less" scoped>
  .authentication-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: #f6f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    span {
      display: block;
      margin: 0 auto;
    }

    span[class*="l-"] {
      height: 4px; width: 4px;
      background: #000;
      display: inline-block;
      margin: 12px 2px;

      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;

      -webkit-animation: loader 4s infinite;
      -webkit-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
      -webkit-animation-fill-mode: both;
      -moz-animation: loader 4s infinite;
      -moz-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
      -moz-animation-fill-mode: both;
      -ms-animation: loader 4s infinite;
      -ms-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
      -ms-animation-fill-mode: both;
      animation: loader 4s infinite;
      animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
      animation-fill-mode: both;
    }

    span.l-1 {-webkit-animation-delay: 1s;animation-delay: 1s;-ms-animation-delay: 1s;-moz-animation-delay: 1s;}
    span.l-2 {-webkit-animation-delay: 0.8s;animation-delay: 0.8s;-ms-animation-delay: 0.8s;-moz-animation-delay: 0.8s;}
    span.l-3 {-webkit-animation-delay: 0.6s;animation-delay: 0.6s;-ms-animation-delay: 0.6s;-moz-animation-delay: 0.6s;}
    span.l-4 {-webkit-animation-delay: 0.4s;animation-delay: 0.4s;-ms-animation-delay: 0.4s;-moz-animation-delay: 0.4s;}
    span.l-5 {-webkit-animation-delay: 0.2s;animation-delay: 0.2s;-ms-animation-delay: 0.2s;-moz-animation-delay: 0.2s;}
    span.l-6 {-webkit-animation-delay: 0;animation-delay: 0;-ms-animation-delay: 0;-moz-animation-delay: 0;}

    @-webkit-keyframes loader {
      0% {-webkit-transform: translateX(-30px); opacity: 0;}
      25% {opacity: 1;}
      50% {-webkit-transform: translateX(30px); opacity: 0;}
      100% {opacity: 0;}
    }

    @-moz-keyframes loader {
      0% {-moz-transform: translateX(-30px); opacity: 0;}
      25% {opacity: 1;}
      50% {-moz-transform: translateX(30px); opacity: 0;}
      100% {opacity: 0;}
    }

  @-keyframes loader {
    0% {-transform: translateX(-30px); opacity: 0;}
    25% {opacity: 1;}
    50% {-transform: translateX(30px); opacity: 0;}
    100% {opacity: 0;}
  }

    @-ms-keyframes loader {
      0% {-ms-transform: translateX(-30px); opacity: 0;}
      25% {opacity: 1;}
      50% {-ms-transform: translateX(30px); opacity: 0;}
      100% {opacity: 0;}
    }
  }
</style>
