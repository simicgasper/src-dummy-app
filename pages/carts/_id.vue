<template>
  <div v-if="cart.id">
    <div class="row justify-content-center">

      <div class="col-12 text-center">
        <h2 class="mb-3"><strong>Cart {{cart.id}}</strong></h2>
        <h3 class="mb-3"><strong>Products:</strong></h3>
      </div>

      <div v-for="product in cart.products" :key="product.id" class="col-12 col-md-6 my-2">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{product.title}}</h5>
            <p class="card-text">
              Quantity: {{product.quantity}}
              <br>
              <nuxt-link class="btn btn-primary mt-2" :to="`/products/${product.id}`">
                Go to product
              </nuxt-link>
              <button class="btn btn-danger mt-2" @click="removeProduct(product.id)">
                Remove from cart
              </button>
            </p>
          </div>
        </div>
      </div>

      <hr class="my-3">

      <!-- Controls -->
      <div class="col-12 text-center">
        <button @click="updateCart"
          :class="'btn btn-primary btn-lg' + (disableButtons ? ' disabled' : '')"
        >
          <span v-if="!updating">
            Update cart data
          </span>
          <template v-else>
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Updating...
          </template>
        </button>
        <button :class="'btn btn-danger btn-lg' + (disableButtons ? ' disabled' : '')"
          type="button" data-bs-toggle="modal" data-bs-target="#delete-cart-modal"
        >
          <template v-if="!deleting">
            Delete cart
          </template>
          <template v-if="deleting">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Deleting...</span>
            </div>
            Deleting...
          </template>
        </button>
      </div>

    </div>

    
    <!-- Alert container -->
    <div class="col-12 mt-3" id="alert-container" />


    <!-- Cart delete modal -->
    <div class="modal fade" id="delete-cart-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete cart</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this cart?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteCart">
              Delete cart
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>


  </div>

  <div v-else class="alert alert-danger alert-dismissible fade show" role="alert">
    There was an error retrieving cart data.
  </div>

</template>

<script>
export default {

  async asyncData(context) {

    let dataObj = {
      deleted: false,
      deleting: false,
      updating: false,
      cart: {},
      error: null
    }

    // Request cart data
    await context.$axios({
      method: "GET",
      url: `/carts/${context.params.id}`
    })
    .then((resp) => {
      dataObj.cart = resp.data
    })
    .catch((err) => {
      dataObj.error = err
    })

    return dataObj

  },

  beforeMount() {
    if (!this.$checkLogin()) {
      window.location = '/login'
    }
  },

  computed: {
    disableButtons() {
      return this.deleting || this.updating || this.deleted
    }
  },

  methods: {

    async updateCart() {
      let startTime = Date.now()
      this.updating = true

      // Request to update cart data
      await this.$axios({
        method: "PUT",
        url: `/carts/${this.cart.id}`,
        data: this.cart
      })
      .then((resp) => {
        let handleUpdateResp = function(vue) {
          vue.cart = resp.data
          vue.updating = false

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              Cart data was successfully updated.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `
        }

        // Handle delay
        setTimeout(() => {
            handleUpdateResp(this)
          },
          750 - Date.now() + startTime
        )
      })
      .catch((err) => {
        this.error = err
        this.updating = false

        // Show error alert
        let alertContainer = document.getElementById("alert-container")
        alertContainer.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            There was an error updating cart data.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    },

    async deleteCart() {
      let startTime = Date.now()
      this.deleting = true

      // Request to delete cart data
      await this.$axios({
        method: "DELETE",
        url: `/carts/${this.cart.id}`
      })
      .then((resp) => {
        let handleDeleteResp = function(vue) {
          //vue.cart = resp.data
          vue.deleting = false
          vue.deleted = true

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show mx-3" role="alert">
              Cart was successfully deleted. Redirecting you back to carts page...
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `

          // Redirect
          setTimeout(() => {
              // First, dismiss modal
              let deleteModal = bootstrap.Modal.getInstance(document.getElementById("delete-cart-modal"))
              deleteModal.hide()
              // then, redirect
              vue.$router.push("/carts")
            },
            2500
          )
        }

        // Handle delay
        setTimeout(() => {
            handleDeleteResp(this)
          },
          Math.max(1000 - Date.now() + startTime, 0)
        )
      })
      .catch((err) => {
        this.error = err
        this.deleting = false

        // Show error alert
        let alertContainer = document.getElementById("alert-container")
        alertContainer.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show mx-3" role="alert">
            There was an error deleting this cart.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    },

    removeProduct(productId) {
      this.cart.products = this.cart.products.filter((elem) => {
        if (elem.id === productId) return false
        return true
      })

    }
  }

}
</script>