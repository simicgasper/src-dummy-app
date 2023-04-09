export default (_, inject) => {
  inject('checkLogin', () => {
    // Check if login data exists
    let loginTime = window.localStorage.getItem('loginTime')
    if (loginTime == null) {
      window.localStorage.removeItem('loginResp')
      return false
    }

    // Check if 15 minutes haven't passed since last interaction
    if (Date.now() - loginTime > 1000*60*15) {
      window.localStorage.removeItem('loginTime')
      window.localStorage.removeItem('loginResp')
      return false
    }

    // Refresh loginTime and return
    window.localStorage.setItem('loginTime', Date.now())
    return true

  })
}