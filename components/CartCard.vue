<template>
  <div class="col-12 col-sm-6 col-md-4">
    <div class="card my-2">
      <div class="card-body text-center">
        <h5 class="card-title"><strong>Cart {{cart.id}}</strong></h5>
        <nuxt-link :to="`carts/${cart.id}`"
          :class="'btn btn-primary mt-1' + (loading ? ' disabled' : '')"
        >
          <template v-if="!loading">Details</template>
          <template v-else>
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </template>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'cart',
    'loading'
  ]
}
</script>