<template>
  <div v-if="user.username">
    <div class="row justify-content-center">

      <div class="col-12 col-md-6 col-lg-5 text-center fs-5 lh-lg">

        <h2 class="mb-3"><strong>User details</strong></h2>
        <hr>

        <div class="row">
          
          <label for="username-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Username:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="user.username" class="form-control" id="username-input">
          </div>

          <label for="firstname-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>First name:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="user.firstName" class="form-control" id="firstname-input">
          </div>

          <label for="lastname-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Last name:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="user.lastName" class="form-control" id="lastname-input">
          </div>

          <label for="email-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Email:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input type="text" v-model="user.email" class="form-control" id="lastname-input">
          </div>

          <label for="address-input" class="col-5 col-sm-4 col-md-5 col-lg-4 col-form-label">
            <strong>Address:</strong>
          </label>
          <div class="col-7 col-sm-8 col-md-7 col-lg-8">
            <input v-if="user.address" type="text" v-model="user.address.address" class="form-control" id="lastname-input">
          </div>

        </div>

      </div>


      <!-- User image -->
      <div class="col-12 col-md-6 col-lg-5 text-center mt-3 mt-md-0 ">
        <img :src="user.image" class="border border-2 border-black rounded">
      </div>

      <!-- Controls -->
      <div class="col-12 text-center mt-3">
        <button @click="updateUser"
          :class="'btn btn-primary' + (disableButtons ? ' disabled' : '')"
        >
          <span v-if="!updating">
            Update user data
          </span>
          <template v-else>
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Updating...
          </template>
        </button>
        <button :class="'btn btn-danger' + (disableButtons ? ' disabled' : '')"
          type="button" data-bs-toggle="modal" data-bs-target="#delete-user-modal"
        >
          <template v-if="!deleting">
            Delete user
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


    <!-- User delete modal -->
    <div class="modal fade" id="delete-user-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete user</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this user?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteUser">
              Delete user
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>


  </div>

  <div v-else class="alert alert-danger alert-dismissible fade show" role="alert">
    There was an error retrieving user data.
  </div>

</template>

<script>
export default {

  async asyncData(context) {

    let dataObj = {
      deleted: false,
      deleting: false,
      updating: false,
      user: {},
      error: null
    }

    // Request user data
    await context.$axios({
      method: "GET",
      url: `/users/${context.params.id}`
    })
    .then((resp) => {
      dataObj.user = resp.data
    })
    .catch((err) => {
      dataObj.error = err
    })

    return dataObj

  },

  computed: {
    disableButtons() {
      return this.deleting || this.updating || this.deleted
    }
  },

  methods: {

    async updateUser() {
      let startTime = Date.now()
      this.updating = true

      // Request to update user data
      await this.$axios({
        method: "PUT",
        url: `/users/${this.user.id}`,
        data: this.user
      })
      .then((resp) => {
        let handleUpdateResp = function(vue) {
          vue.user = resp.data
          vue.updating = false

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              User data was successfully updated.
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
            There was an error updating user data.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    },

    async deleteUser() {
      let startTime = Date.now()
      this.deleting = true

      // Request to delete user data
      await this.$axios({
        method: "DELETE",
        url: `/users/${this.user.id}`
      })
      .then((resp) => {
        let handleDeleteResp = function(vue) {
          vue.user = resp.data
          vue.deleting = false
          vue.deleted = true

          // Show success alert
          let alertContainer = document.getElementById("alert-container")
          alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show mx-3" role="alert">
              User was successfully deleted. Redirecting you back to users page...
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `

          // Redirect
          setTimeout(() => {
              // First, dismiss modal
              let deleteModal = bootstrap.Modal.getInstance(document.getElementById("delete-user-modal"))
              deleteModal.hide()
              // then, redirect
              vue.$router.push("/users")
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
            There was an error deleting this user.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `
      })
    }
  }

}
</script>