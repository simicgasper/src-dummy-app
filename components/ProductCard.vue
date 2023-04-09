<template>
  <div class="col-12 col-lg-6 col-xl-4">
    <div class="card my-2">
      <img :src="product.thumbnail" class="card-img-top" alt="Product thumbnail">
      <div class="card-body text-center">
        <h5 class="card-title">{{`${product.brand} ${product.title}`}}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">
          {{truncateDescription(product.description)}}
        </h6>
        <nuxt-link :to="`products/${product.id}`"
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


<style scoped>

.card-img-top {
    width: 100%;
    height: 25svw;
    object-fit: cover;
}

.card-title {
  height: 48px;
}

.card-subtitle {
  height: 77px;
}

</style>


<script>
export default {
  props: [
    'product',
    'loading'
  ],

  methods: {

    truncateDescription(description) {
      if (typeof description !== "string") return description

      if (description.length > 150) {
        return description.substring(0, 147) + "..."
      }
      return description
    }

  }
}
</script>