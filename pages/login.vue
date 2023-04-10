<template>
  <div class="row justify-content-center">
    <div class="col-12 mb-4 text-center">
      <h2><strong>Login</strong></h2>
    </div>

    <div class="col">
      <!-- Google auth elements -->
      <div class="google-login-wrap">
        <script>
          var handleLoginResp = function(loginResp) {
            window.localStorage.setItem('loginResp', loginResp)
            window.localStorage.setItem('loginTime', Date.now())
            window.location = '/users'
          }
        </script>
        
        <div id="g_id_onload"
          data-client_id="676496902976-hmp7p0ih9tht6r8a1b7rlg8d5lqvdn2b.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleLoginResp"
          data-auto_prompt="false">
        </div>

        <div class="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="filled_black"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
          data-width="250">
        </div>
      </div>
    
    </div>

  </div>
</template>

<style>

/* Center the google login button */
.google-login-wrap {
  width: 250px;
  margin: auto;
}

</style>

<script>
export default {

  layout: "noNav",

}
</script>