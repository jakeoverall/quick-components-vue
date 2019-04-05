<template>
  <div class="quick-modal-slot">
    <transition name="fade">
    <div class="quick-modal quick-modal-container" :class="{open: open}" v-if="open">
      <div>
        <div class="quick-modal-overlay" :class="{open: open}" @click="toggleModal"></div>
        <div
          class="quick-modal-card card square p-1 d-flex"
          :class="{open: open}"
          :style="{'min-width': width+'%'}"
        >
          <div>
            <slot></slot>
          </div>
          <div class="m-0 p-0" v-if="showFooter">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "quick-modal",
  props: {
    toggle: {
      required: true,
      type: Number
    },
    fixed: Boolean,
    showFooter: Boolean,
    width: {
      type: Number,
      default: 80
    }
  },
  data() {
    return { open: false, count: -1 };
  },
  watch: {
    toggle: {
      handler(val) {
        if (val < this.count) {
          this.open = false;
        } else {
          this.open = true;
        }
        this.count = val;
        this.$emit("modalstate", this.open);
      }
    }
  },
  methods: {
    toggleModal() {
      this.open = !this.open;
      this.$emit("modalstate", this.open);
    }
  },
  mounted() {
    document.addEventListener("keyup", e => {
      if (e.which == "27") {
        this.open = false;
        this.$emit("modalstate", this.open);
      }
    });
  }
};
</script>

<style>
.quick-modal-container {
  opacity: 0;
  z-index: -99999;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.25s linear;
}
.quick-modal-container.open {
  opacity: 1;
  z-index: 99;
  pointer-events: initial;
}
.quick-modal.open {
  opacity: 1;
  z-index: 99;
}
.quick-modal .modal-content .quick-modal .modal-content {
  height: unset;
  width: unset;
  top: unset;
  bottom: unset;
  left: unset;
  right: unset;
  position: unset;
}
.quick-modal-card {
  z-index: 100;
  min-height: 50%;
  min-width: 80%;
  background: var(--white);
  opacity: 1;
}

.quick-modal-overlay {
  opacity: 0;
  background: black;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.15s linear;
}
.quick-modal-overlay.open {
  z-index: 88;
  opacity: 0.45;
}
.quick-modal.fill-height .modal-content {
  height: 70vh;
  position: relative;
}
.quick-modal.max-fill .modal-content {
  height: 100vh;
  top: 0;
  bottom: 0;
  right: 0;
  left: 55px;
  position: fixed;
  padding: 0;
}
.modal-lg .modal.open {
  width: 85% !important;
}
.modal-md .modal.open {
  width: 70% !important;
}
.quick-modal.modal-sm .modal.open {
  width: 55% !important;
}
.modal-xl .modal.open {
  width: 95% !important;
}
.modal-full .modal.open {
  width: 100% !important;
  top: 0;
  bottom: 0;
  max-height: 100%;
  overflow: hidden !important;
  background: transparent;
}
.quick-modal.p-0 > .modal-content {
  padding: 0 !important;
}
.quick-modal.dark > .modal-content {
  background: var(--dark);
  color: var(--light);
}
.quick-modal.light > .modal-content {
  color: var(--dark);
  background: var(--light);
}
</style>