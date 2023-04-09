<template>
  <div v-if="product.id">
    <div class="row justify-content-center">

      <div class="col-12 col-lg-6 text-center fs-5 lh-lg">

        <h2 class="mb-3"><strong>Product details</strong></h2>
        <hr>

        <div class="row">

          <label for="brand-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Brand:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="product.brand" class="form-control" id="brand-input">
          </div>
          
          <label for="title-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Title:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="product.title" class="form-control" id="title-input">
          </div>

          <label for="description-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Description:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <textarea v-model="product.description" class="form-control mb-1"
              id="description-input" rows="6"
            />
          </div>

          <label for="price-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Price:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="number" min="1" v-model="product.price" class="form-control" id="price-input">
          </div>

        </div>

      </div>


      <!-- Product images -->
      <div class="col-12 col-lg-6 text-center mt-3 mt-lg-0 ">
        <div id="productCarousel" class="carousel slide bg-gray"
          data-bs-ride="carousel" data-bs-theme="dark"
        >
          <div class="carousel-inner">

            <div v-for="(image, index) in product.images" :key="index"
              :class="'carousel-item' + (index == 0 ? ' active' : '')"
            >
              <img :src="image" alt="Product image"
                class="d-block mx-auto border border-black border-3 rounded carousel-img"
              >
            </div>

          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon border border-3 border-white rounded opacity-75 bg-black" aria-hidden="true" />
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon border border-3 border-white rounded opacity-75 bg-black" aria-hidden="true" />
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        
        <!--<img :src="user.image" class="border border-2 border-black rounded">-->

      </div>

      <hr class="my-3">

      <!-- Controls -->
      <div class="col-12 text-center">
        <button @click="updateProduct"
          :class="'btn btn-primary btn-lg' + (disableButtons ? ' disabled' : '')"
        >
          <span v-if="!updating">
            Update product data
          </span>
          <template v-else>
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Updating...
          </template>
        </button>
        <button :class="'btn btn-danger btn-lg' + (disableButtons ? ' disabled' : '')"
          type="button" data-bs-toggle="modal" data-bs-target="#delete-product-modal"
        >
          <template v-if="!deleting">
            Delete product
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


    <!-- Product delete modal -->
    <div class="modal fade" id="delete-product-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this product?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteProduct">
              Delete product
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>


  </div>

  <div v-else class="alert alert-danger alert-dismissible fade show" role="alert">
    There was an error retrieving product data.
  </div>

</template>


<style scoped>

.carousel-inner {
  max-height: 400px;
}

.carousel-img {
  max-height: 396px;
  width: auto;
  max-width: 100%;
}

</style>


<script>
export default {

  async asyncData(context) {

    let dataObj = {
      deleted: false,
      deleting: false,
      updating: false,
      product: {},
      error: null
    }

    // Request product data
    await context.$axios({
      method: "GET",
      url: `/products/${context.params.id}`
    })
    .then((resp) => {
      dataObj.product = resp.data
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

    async updateProduct() {
      let startTime = Date.now()
      this.updating = true

      // Request to update product data
      await this.$axios({
        method: "PUT",
        url: `/products/${this.product.id}`,
        data: this.product
      })
      .then((resp) => {
        let handleUpdateResp = function(vue) {
          vue.product = resp.data
          vue.updating = false

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              Product data was successfully updated.
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
            There was an error updating product data.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    },

    async deleteProduct() {
      let startTime = Date.now()
      this.deleting = true

      // Request to delete product data
      await this.$axios({
        method: "DELETE",
        url: `/products/${this.product.id}`
      })
      .then((resp) => {
        let handleDeleteResp = function(vue) {
          vue.deleting = false
          vue.deleted = true

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show mx-3" role="alert">
              Product was successfully deleted. Redirecting you back to products page...
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `

          // Redirect
          setTimeout(() => {
              // First, dismiss modal
              let deleteModal = bootstrap.Modal.getInstance(document.getElementById("delete-product-modal"))
              deleteModal.hide()
              // then, redirect
              vue.$router.push("/products")
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
            There was an error deleting this product.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    }
  }

}
</script>