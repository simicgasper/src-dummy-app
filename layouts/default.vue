<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="text-center mt-3 mb-2"><strong>SRC Dummy App</strong></h1>
      </div>
    </div>

    <div class="row">
      <div class="col">
        
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/users">Users</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/carts">Carts</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/products">Products</nuxt-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout"><strong>Logout</strong></a>
          </li>
        </ul>

      </div>
    </div>

    <hr>
    
    <Nuxt/>
  
  </div>
</template>


<script>
export default {
  
  methods: {
    logout() {
      this.$logout()
      window.location = "/login"
    }
  },

  beforeMount() {
    if (!this.$checkLogin()) {
      window.location = '/login'
    }
  },

}
</script>