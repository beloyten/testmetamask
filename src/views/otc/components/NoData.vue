<template>
  <div class="no-data mt-10 mb-5">
    <img src="/assets/images/no-data-box.svg" alt="" />
    <p class="mt-5">{{message}}</p>
  </div>
</template>
<script>
export default {
  props: ['message']
}
</script>
