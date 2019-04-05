<template>
  <div class="countdown"></div>
</template>

<script>
import { setInterval } from "timers";
export default {
  name: "countdown",
  props: {},
  data() {
    return { intervalId: 0 };
  },
  mounted() {
    // this.intervalId = setInterval(()=>{
    //   this.remaining = 100
    // }, 100);
  }
};
</script>