<template>
  <v-main class="not-found-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="py-15 d-flex flex-column justify-center align-center">
        <p class="text-h5 mb-10">Error 404</p>
        <img class="mb-15" src="/assets/images/404-image.svg" alt="" />
        <v-btn class="my-15" color="primary" outlined @click="reloadPage()">Reload page</v-btn>
      </v-card>
    </section>
  </v-main>
</template>
<script>
export default {
  methods: {
    reloadPage () {
      window.location.reload()
    }
  }
}
</script>
