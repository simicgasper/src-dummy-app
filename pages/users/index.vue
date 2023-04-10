<template>
  <div class="row">
    
    <div class="col-12 text-center">
      <h2 class="my-2"><strong>Users</strong></h2>
    </div>

    <div class="col-0 col-md-6 col-xl-7" />
    <div class="col-12 col-md-6 col-xl-5 my-2 text-center">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Search"
          aria-label="Search" v-model="searchQuery"
        >
        <button class="btn btn-outline-secondary pb-2" type="button" @click="clearSearch">
          Clear
        </button>
        <button class="btn btn-outline-primary pb-2" type="button" @click="searchUsers">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
    </div>
    

    <UserCard v-for="user in users" :key="user.id" :user="user" :loading="loading" />

    <ItemPagination :pagesCount="pagesCount" :currentPage="page"
      @pageNavigation="getUsersPage" v-if="pagesCount > 1"
    />

    <div class="alert alert-danger alert-dismissible fade show" role="alert"
      v-if="users.length == 0"
    >
      No users could be retrieved or found.
    </div>

  </div>

</template>

<script>
export default {
  async asyncData(context) {

    // Data object structure
    let dataObj = {
      page: 1,
      users: [],
      pagesCount: 0,
      searchQuery: "",
      loading: false,
      error: null
    }
    
    // Request for initial user data
    await context.$axios({
      method: "GET",
      url: "/users",
      params: {
        limit: 12
      }
    })
    .then((resp) => {
      dataObj.users = (resp.data && resp.data.users) ? resp.data.users : []
      dataObj.pagesCount =
        (resp.data && resp.data.total) ? Math.ceil(resp.data.total/12) : 0
    })
    .catch((err) => {
      dataObj.error = err
    })

    return dataObj
  },

  methods: {

    async getUsersPage(page) {
      this.loading = true
      let startTime = Date.now()
      let usersPage = {
        page,
        users: [],
        pagesCount: 0
      }

      // Request new users
      await this.$axios({
        method: "GET",
        url: "/users",
        params: {
          skip: (page - 1) * 12,
          limit: 12
        }
      })
      .then((resp) => {
        let handleUsersResp = function(vue) {
          vue.users = (resp.data && resp.data.users) ? resp.data.users : []
          vue.pagesCount = (resp.data && resp.data.total) ? Math.ceil(resp.data.total/12) : 0
          vue.page = page
          vue.error = null
          vue.loading = false
        }

        setTimeout(() => {
            handleUsersResp(this)
          },
          Math.max(0, startTime + 500 - Date.now())
        )
      })
      .catch((err) => {
        this.page = 0
        this.error = err
        this.loading = false
      })

      return usersPage
    },

    async searchUsers() {
      this.loading = true
      let startTime = Date.now()

      // Perform search query
      await this.$axios({
        method: "GET",
        url: "/users/search",
        params: {
          limit: 12,
          q: this.searchQuery
        }
      })
      .then((resp) => {
        let handleUsersResp = function(vue) {
          vue.users = (resp.data && resp.data.users) ? resp.data.users : []
          vue.pagesCount = 1
          vue.page = 1
          vue.error = null
          vue.loading = false
        }

        setTimeout(() => {
            handleUsersResp(this)
          },
          Math.max(0, startTime + 750 - Date.now())
        )
      })
      .catch((err) => {
        this.users = []
        this.pagesCount = 0
        this.page = 0
        this.error = err
        this.loading = false
      })
    },

    clearSearch() {
      this.searchQuery = ""
      this.getUsersPage(1)
    }

  }
}

</script>