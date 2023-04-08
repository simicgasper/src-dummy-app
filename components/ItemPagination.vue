<template>
  <div class="col-12 my-3">
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">

        <!-- Previous page -->
        <li class="page-item">
          <a :class="'page-link pb-2' + (currentPage <= 1 ? ' disabled' : '')"
            href="#"
            @click.prevent="pageNavigation(currentPage - 1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
            </svg>
          </a>
        </li>

        <!-- Numbered pages -->
        <li class="page-item" v-for="page in pagesCount" :key="page">
          <a :class="'page-link pb-2' + (page === currentPage ? ' active' : '')"
            href="#"
            @click.prevent="pageNavigation(page)"
          >
            {{page}}
          </a>
        </li>

        <!-- Next page -->
        <li class="page-item">
          <a :class="'page-link pb-2' + (currentPage >= pagesCount ? ' disabled' : '')"
            href="#"
            @click.prevent="pageNavigation(currentPage + 1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
            </svg>
          </a>
        </li>
        
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: [
    'pagesCount',
    'currentPage'
  ],

  methods: {
    pageNavigation(page) {
      this.$emit('pageNavigation', page)
    }
  }

}
</script>