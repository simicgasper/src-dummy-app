<template>
  <div class="row">
    
    <div class="col-12 text-center">
      <h2 class="my-2">Users</h2>
    </div>

    <!--<div class="col-6"></div>

    <div class="col-6 text-center">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Search" aria-label="Search">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary pb-2" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>-->
    

    <UserCard v-for="user in users" :key="user.id" :user="user" />

    <ItemPagination :pagesCount="pagesCount" :currentPage="page"
      @pageNavigation="getUsersPage"
    />

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
        this.users = (resp.data && resp.data.users) ? resp.data.users : []
        this.pagesCount =
          (resp.data && resp.data.total) ? Math.ceil(resp.data.total/12) : 0
        this.page = page
        this.error = null
      })
      .catch((err) => {
        this.page = 0
        this.error = err
      })

      return usersPage
    }

  }
}

</script>