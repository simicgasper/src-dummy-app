<template>
  <div class="col-12 col-sm-6 col-md-4">
    <div class="card my-2">
      <img :src="user.image" class="card-img-top" alt="User profile image">
      <div class="card-body text-center">
        <h5 class="card-title">{{user.username}}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">
          {{`${user.firstName} ${user.lastName}`}}
        </h6>
        <nuxt-link :to="`users/${user.id}`"
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
    'user',
    'loading'
  ]
}
</script>