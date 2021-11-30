<template>
  <v-footer color="#304964" class="white--text px-15 pt-15 pb-10">
    <v-row>
      <v-col cols="12" md="6" lg="4"
        align-start
        class="pa-0"
      >
        <v-btn tile plain depressed class="logo px-0"
          :to="{name: 'home'}"
        >
          <img
            src='/assets/images/logo-grey.svg'
            :alt="configs.siteName"
          />
        </v-btn>
        <p class="white--text mt-15">© 2021 Hesman. All rights reserved.</p>
      </v-col>
      <v-col cols="12" md="6" lg="4" class="d-flex justify-center pa-0">
        <v-btn tile plain text rounded
          href="https://www.facebook.com"
          target="_"
        >
          <v-img src="/assets/icons/facebook-icon.svg" contain height="25" width="13" />
        </v-btn>
        <v-btn tile plain text rounded
          href="https://www.instagram.com"
          target="_"
        >
          <v-img src="/assets/icons/instagram-icon.svg" contain height="23" width="23" />
        </v-btn>
        <v-btn tile plain text rounded
          href="https://twitter.com"
          target="_"
        >
          <v-img src="/assets/icons/twitter-icon.svg" contain height="19" width="22" />
        </v-btn>
        <v-btn tile plain text rounded
          href="#"
        >
          <v-img src="/assets/icons/google-plus-icon.svg" contain height="19" width="28" />
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" lg="2" class="pa-0">
        <v-list flat color="#304964" class="py-0">
          <v-subheader class="white--text mb-5">
            ABOUT
          </v-subheader>

          <v-list-item href="#instroduction" dense :to="{name: 'introduction'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Introduction
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#advantages" dense :to="{name: 'advantages'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Advantages
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#case-studies" dense :to="{name: 'case-studies'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Case studies
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="6" lg="2" class="pa-0">
        <v-list flat color="#304964"  class="py-0">
          <v-subheader class="white--text mb-5">
            SUPPORT
          </v-subheader>

          <v-list-item href="#" dense :to="{name: 'privacy-policy'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Privacy Policy
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#" dense :to="{name: 'announcements'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Announcements
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#" dense :to="{name: 'terms-of-service'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Terms of Service
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#" dense :to="{name: 'contact-us'}">
            <v-list-item-content>
              <v-list-item-title class="white--text">
                Contact us
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

    </v-row>
  </v-footer>
</template>

<script>
import CONSTANT from '@/configs/constant'
export default {
  data () {
    return {
      SOCIALS: CONSTANT.URL_FANPAGES,
      FOOTER: CONSTANT.URL_LINK_MENU
    }
  },
  computed: {
    isHiddenHeader () {
      return this.$route.name === 'call-back-sso' ||
        this.$route.name === 'auth-call-back-sso' ||
        this.$route.name === 'call-back-registered' ||
        this.$route.name === 'login'
    },
    isLight () {
      return this.$store.getters.themeMode
    },
    configs () {
      return this.$store.getters.configs
    },
    domain () {
      return CONSTANT.HOME_PAGE_URL
    }
  }
}
</script>
