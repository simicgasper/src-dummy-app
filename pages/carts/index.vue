<template>
  <div class="row">
    
    <div class="col-12 text-center">
      <h2 class="my-2"><strong>Carts</strong></h2>
    </div>
    
    <CartCard v-for="cart in carts" :key="cart.id" :cart="cart" :loading="loading" />

    <ItemPagination :pagesCount="pagesCount" :currentPage="page"
      @pageNavigation="getCartsPage" v-if="pagesCount > 1"
    />

    <div class="alert alert-danger alert-dismissible fade show" role="alert"
      v-if="carts.length == 0"
    >
      No carts could be retrieved or found.
    </div>

  </div>

</template>

<script>
export default {
  async asyncData(context) {

    // Data object structure
    let dataObj = {
      page: 1,
      carts: [],
      pagesCount: 0,
      loading: false,
      error: null
    }
    
    // Request for initial cart data
    await context.$axios({
      method: "GET",
      url: "/carts",
      params: {
        limit: 12
      }
    })
    .then((resp) => {
      dataObj.carts = (resp.data && resp.data.carts) ? resp.data.carts : []
      dataObj.pagesCount =
        (resp.data && resp.data.total) ? Math.ceil(resp.data.total/12) : 0
    })
    .catch((err) => {
      dataObj.error = err
    })

    return dataObj
  },

  methods: {

    async getCartsPage(page) {
      this.loading = true
      let startTime = Date.now()

      // Request new carts
      await this.$axios({
        method: "GET",
        url: "/carts",
        params: {
          skip: (page - 1) * 12,
          limit: 12
        }
      })
      .then((resp) => {
        let handleCartsResp = function(vue) {
          vue.carts = (resp.data && resp.data.carts) ? resp.data.carts : []
          vue.pagesCount = (resp.data && resp.data.total) ? Math.ceil(resp.data.total/12) : 0
          vue.page = page
          vue.error = null
          vue.loading = false
        }

        setTimeout(() => {
            handleCartsResp(this)
          },
          Math.max(0, startTime + 500 - Date.now())
        )
      })
      .catch((err) => {
        this.page = 0
        this.error = err
        this.loading = false
      })

    }

  }
}

</script>