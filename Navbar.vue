<template>
  <nav class="navbar navbar-light bg-dark d-flex align-items-center justify-content-between">
    <!-- LEFT -->
    <a href="/">
      <div class="navbar-brand d-flex align-items-center no-select">
        <img class="nav-logo" src="./assets/cw-nav-logo.png" height="45" width="45">
        <div class="d-flex flex-column text-white site-title">
          <h6 class="p-0 m-0 title">
            <span class="ml-1">CodeWorks</span>
          </h6>
          <h6 class="m-0 ml-1">
            <span>Academy</span>
          </h6>
        </div>
      </div>
    </a>

    <!-- RIGHT -->
    <div class="d-flex align-items-center mr-3 text-light">
      <div>
        <i class="fa fa-fw fa-bell action muted mr-3"></i>
      </div>
      <div class="mr-3">
        <quick-view class="text-dark" title="CodeWorks Academy" icon="fa-th text-white">
          <div class="card p-3">app list here???</div>
        </quick-view>
      </div>
      <avatar :user="user" radius="50%" border-style="1px solid var(--primary)" size="55px"/>
      <!-- <small>
        <i class="fa fa-fw fa-chevron-down action muted"></i>
      </small>-->
    </div>
  </nav>
</template>

<script>
import Store from "@client/store";
import Avatar from "./Avatar.vue";
export default {
  name: "StatusBar",
  computed: {
    user() {
      return Store.state.user;
    },

    status() {
      return Store.state.status;
    }
  },
  components: { Avatar }
};
</script>

<style scoped lang="scss">
.navbar {
  border-top: 2px solid;
  border-bottom: 3px solid var(--primary);
  --gradient: linear-gradient(
    to right,
    var(--primary),
    var(--purple),
    var(--danger)
  );
}
.navbar {
  border-top: 2px solid;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  .loader-progress {
    height: 2px;
    background-color: var(--primary);
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    transition: all 0.3s linear;
  }
  .nav-logo {
    border-radius: 50%;
    border: 2px solid var(--primary);
  }
  .site-title h6 {
    text-transform: uppercase;
    font-size: 0.6em !important;
    padding-right: 0.3em;
  }
  .title {
    border-bottom: 1px solid var(--primary);
  }
}
</style>