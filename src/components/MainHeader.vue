<template>
    <v-app-bar app flat
      clipped-right
      class="px-15"
      color='#304964'>
      <v-btn tile plain depressed class="logo"
        :ripple="false"
        :to="{name: 'home'}"
      >
        <v-img
          src='/assets/images/logo-homepage.svg'
          :alt="configs.siteName"
        />
      </v-btn>

      <v-spacer></v-spacer>

      <div v-if="logged" class="button-area">
        <v-btn tile text plain class="white--text create-ads-button"
          :to="{ name: 'post-new-ad'}"
          :ripple="false"
        >
          <v-img src="/assets/icons/create-ads-icon.svg" max-height="20" max-width="20" class="mr-2" left />
          Post New Ad
        </v-btn>
        <v-btn tile text plain class="white--text"
          :to="{ name: 'otc-my-ads'}"
        >
          My Ad
        </v-btn>
        <v-btn tile text plain class="white--text"
          :to="{ name: 'otc-my-orders'}"
        >
          My Orders
        </v-btn>
        <v-menu offset-y
          content-class="menu-header"
          nudge-bottom="6"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              icon
              v-bind="attrs"
              v-on="on"
              class="small-button"
              width="50"
            >
              <v-img
                max-height="18"
                max-width="18"
                src="/assets/icons/user-icon.svg"
              />
            </v-btn>
          </template>

          <v-list nav
            color="#1D3147"
            class=""
          >
            <v-list-item two-line class="py-5 px-0">
              <v-avatar class="ml-5" color="primary">
                <span class="white--text">{{user && user.nickname ? user.nickname.charAt(0).toUpperCase() : ''}}</span>
              </v-avatar>
              <v-list-item-content class="pl-5 profile-content">
                <v-list-item-title class="white--text mb-5"
                  >{{user.email}}</v-list-item-title
                >
                <v-list-item-subtitle class="white--text"
                  >UID {{user.id}}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider style="background-color: rgba(255, 255, 255, 0.1); margin: auto;" />

            <v-list-item-group class="pl-5 py-10">
              <v-list-item :to="{ name: 'post-new-ad'}" class="">
                <v-list-item-icon class="white--text">
                  <v-img src="/assets/icons/create-ads-icon.svg"></v-img>
                </v-list-item-icon>
                <v-list-item-content class="white--text py-0">
                  <v-list-item-title>Post New Ad</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{ name: 'otc-my-ads'}" class="">
                <v-list-item-icon class="white--text">
                  <v-img
                    max-width="20"
                    src="/assets/icons/my-ads-icon.svg"
                  ></v-img>
                </v-list-item-icon>
                <v-list-item-content class="white--text">
                  <v-list-item-title>My ads</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{ name: 'otc-my-orders'}" class="">
                <v-list-item-icon class="white--text">
                  <v-img
                    max-width="20"
                    src='/assets/icons/my-orders-icon.svg'
                  ></v-img>
                </v-list-item-icon>
                <v-list-item-content class='white--text'>
                  <v-list-item-title>My orders</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>

            <v-divider inset style="background-color: rgba(255, 255, 255, 0.1); margin: auto;" />

            <v-list-item-group class="pl-5 py-10">
              <v-list-item :to="{ name: 'otc-account-wallet'}">
                <v-list-item-icon class="">
                  <v-icon color="white">mdi-wallet-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content class='white--text'>
                  <v-list-item-title>{{ $t('OTC Wallet') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :to="{ name: 'otc-setting'}" class="">
                <v-list-item-icon class="white--text">
                  <v-icon color="white">mdi-cog-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content class='white--text'>
                  <v-list-item-title>{{ $t('OTC Settings') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :to="{ name: 'change-password'}">
                <v-list-item-icon class="">
                  <v-icon color="white">mdi-account-lock-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content class='white--text'>
                  <v-list-item-title>{{ $t('Account & Security') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>

            <v-divider style="background-color: rgba(255, 255, 255, 0.1); margin: auto;" />

            <v-list-item class="px-0 logout-content">
              <v-btn tile text plain
                class="white--text logout-button"
                @click="logout()"
              >
                {{ $t('LOG OUT') }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <template v-else>
        <v-btn rounded outlined large
          color="#304964"
          class='white--text'
          elevation="0"
          @click.prevent="login()"
        >
          Connect
        </v-btn>
      </template>
    </v-app-bar>
</template>

<script>
import CONSTANT from '@/configs/constant'
// import SelectLang from '@/components/LanguageSelection'
import DOM from '@/utils/DomSelector.js'
import _ from 'lodash'
import CONFIG from '@/configs/config'

export default {
  // components: {
  //   SelectLang
  // },
  data () {
    return {
      isShowNavUser: false,
      isShowNavBalance: false,
      isShowNavOrder: false,
      defaultPair: CONSTANT.DEFAULT_PAIR,
      registerLink: CONFIG.BASE_URL_OAUTH + '/Account/Register',
      EXTERNAL_URL: CONFIG.EXTERNAL_URL,
      selected: ''
    }
  },
  computed: {
    configs () {
      return this.$store.getters.configs
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    currentUser () {
      return this.$store.getters.user
    },
    isLight () {
      return this.$store.getters.themeMode
    },
    logged () {
      // return LocalStorage.getItem('isLoggedIn')
      return this.$keycloak.authenticated && this.$store.getters.isLoggedIn
    },
    routeName () {
      return this.$route.name
    },
    showSubMenu () {
      return this.$store.getters.showSubMenu
    },
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    isLight (n) {
      this.initTheme(n)
    }
  },
  async created () {
    if (!this.user) {
      await this.$store.dispatch('getUser')
    }
    this.initTheme(this.isLight)
    // click outside
    document.addEventListener('click', evt => {
      if (this.$refs['headerLeft'] &&
        _.indexOf(this.$refs['headerLeft'].classList, 'menu-active') !== -1
      ) {
        var target = evt.target
        if (target && _.indexOf(target.classList, 'menu-hamburger') === -1) {
          var parent = DOM.getClosest(target, 'nav')
          parent === null && this.menuHamburger()
        }
      }
    })
  },
  methods: {
    toggleShowMenu () {
      this.$store.dispatch('toggleShowSubMenu')
    },
    toProfile () {
      this.$router.push('/profile')
    },
    login () {
      // OidcService.signinRedirect()
      // this.$keycloak.login()
      this.$store.dispatch('startConnectWalletProcess', true)
    },
    initTheme (is) {
      var root = document.getElementsByTagName('html')[0]
      !0 === !!is
        ? root.classList.add('html-light-version')
        : root.classList.remove('html-light-version')
    },
    menuHamburger () {
      const $menu = this.$refs['headerLeft']
      $menu && $menu.classList.toggle('menu-active')
    },
    doLogout () {
      this.$store.dispatch('logOut')
      // OidcService.signoutRedirect()
    },
    changeThemeMode () {
      this.$store.dispatch('setThemeMode', !this.isLight)
    },
    logout () {
      // Keycloak logout session
      // this.$keycloak.logout()
      this.$store.dispatch('startDisconnectWalletProcess', true)
    },
    register () {
      // Redirect to account system
      this.$keycloak.register()
    }
  }
}
</script>

<style lang='scss'>
#login-pc {
  display: flex !important;
  align-items: center !important;
}
</style>
