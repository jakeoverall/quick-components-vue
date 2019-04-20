<template>
  <div class="card p-2 shadow d-flex align-items-md-center flex-column bg-secondary text-light">
    <div class="d-flex justify-content-between d-md-none">
      <div class="underline capitalize" v-if="showRouteName">{{$route.name.split('.').join(' ')}}</div>
      <div class @click="open = !open">
        <i class="fa fa-lg fa-fw fa-bars"></i>
      </div>
    </div>
    <div class="sidebar-icons" :class="{open: open}">
      <div style="position:relative" @click="open = false" v-for="link in links" :key="link.name">
        <div class="_link-notification shadow" v-if="link.notifications">{{link.notifications}}</div>
        <router-link :to="link.to" :class="sidebarIcon">
          <i :class="link.icon"></i>
          <small>{{link.name}}</small>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    showRouteName: { type: Boolean, default: true },
    links: { type: Array, required: true }
  },
  data() {
    return {
      open: false,
      sidebarIcon:
        "d-flex align-items-center flex-sm-column m-1 mb-3 action muted "
    };
  }
};
</script>


<style>
.router-link-exact-active {
  color: var(--white);
  opacity: 1;
  border-bottom: 1px solid var(--light);
  text-shadow: 1px 0 3px var(--dark);
}
.router-link-exact-active * {
  opacity: 1 !important;
}
._link-notification {
  position: absolute;
  left: 75%;
  font-size: 0.5em;
  background-color: red;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid darkred;
  top: -5px;
  overflow: hidden;
}

.capitalize{
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .sidebar-icons {
    transition: height 0.2s linear;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .sidebar-icons.open {
    height: unset;
    opacity: 1;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 150px;
    width: 100%;
    padding: 0.25em;
    flex-wrap: wrap;
  }
  .sidebar-icons.open i.fa ~ * {
    margin-left: 0.5em;
  }
}
</style>