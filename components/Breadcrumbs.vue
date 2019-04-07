<template>
  <v-breadcrumbs dark :items="items">
    <template slot="item" slot-scope="props">
      <nuxt-link :to="props.item.to" exact>{{ props.item.text }}</nuxt-link>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: ["items"]
};
</script>
<style lang="scss" scoped>
.v-breadcrumbs {
  display: inline-flex;
  justify-content: center;
  background: rgba(17, 51, 58, 0.65);
  border-radius: 5px;
  padding: 15px;
  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
  }
  a.nuxt-link-active {
    color: #19bcdb !important;
    font-weight: 700;
  }
}
</style>

