<template>
  <div class="quick-view no-print" :class="{active: active}">
    <div class="title" :class="{'force-click': forceClick}">
      <div class="hover-content" :style="position">
        <div class="card m-0">
          <div class="p-1 m-0">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="m-0">{{title}}:</h5>
              <span v-if="tag" class="tag" :style="{'background-color': color || 'purple'}">
                <i v-if="tag == 'icon'" class="fa fa-lg fa-fw" :class="icon" :style="{'color': tagColor}"></i>
                <span v-else>{{tag}}</span>
              </span>
              <div
                class="quick-view-close-button text-center"
                :class="{active: active}"
                @click="active = false"
              >
                <i class="fa fa-lg fa-fw fa-close action muted"></i>
              </div>
            </div>
          </div>
          <div class="quick-view-slot">
            <slot></slot>
            <slot name="foot"></slot>
          </div>
        </div>
      </div>
      <div
        class="hover-text"
        ref="hoverElem"
        @click="active = !active"
        @mouseenter="onHover('enter')"
        @mouseout="onHover('out')"
      >
        <div v-if="icon">
          <i class="fa fa-fw action muted" :class="icon" :style="{'color': color}"></i>
          <span v-if="showTitle" class="ml-1" :style="{'color': color}">{{title}}</span>
        </div>
        <div v-else-if="useSlot">
          <slot></slot>
        </div>
        <div v-else :style="{'text-decoration-color': color}">{{title}}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "QuickView",
  props: {
    title: { type: String, required: true },
    showTitle: { type: Boolean, default: false },
    color: { type: String, default: "inherit" },
    tag: String,
    tagColor: {type: String, default: "var(--light)"},
    icon: String,
    forceClick: { type: Boolean, default: false },
    useSlot: { type: Boolean, default: false }
  },
  data() {
    return {
      active: false,
      position: { top: "-5em", right: "0" },
      hovering: false
    };
  },
  mounted() {
    this.setHoverPosition();
  },
  methods: {
    getElementPos() {
      var rect = this.$refs.hoverElem.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    },

    setHoverPosition() {
      let pos = this.getElementPos();
      if (pos.top < 200) {
        this.position.top = "2em";
      }
      if (pos.left < 200) {
        this.position.left = "2em";
      }
      if (pos.left > 200) {
        this.position.left = "-18vw";
        this.position.top = "2em";
      }
      if (pos.left > 500) {
        this.position.left = "-50vw";
      }
    },
    onHover(type) {
      this.setHoverPosition();
    }
  }
};
</script>


<style>
.quick-view {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.quick-view .hover-text {
  /* font-weight: 600;
  font-style: italic; */
  /* text-decoration: underline var(--primary);
  text-decoration-style: double; */
}

.quick-view.active .hover-text {
  border-radius: 5px;
  padding: 3px;
  background-color: var(--dark);
  color: var(--light);
}

.quick-view .title:hover .hover-content,
.quick-view.active .hover-content {
  opacity: 1;
  pointer-events: all;
}

.quick-view .title.force-click:hover .hover-content {
  opacity: 0;
  pointer-events: none;
}

.quick-view.active .title.force-click .hover-content,
.quick-view.active .title.force-click:hover .hover-content {
  opacity: 1;
  pointer-events: all;
}

.quick-view .hover-content {
  position: absolute;
  opacity: 0;
  transition: opacity 0.25s linear;
  z-index: 99999999;
  pointer-events: none;
  width: 45vw;
  max-height: 35vh;
}
.quick-view .hover-content,
.quick-view .hover-content * {
  transition: height 0.2s linear;
  height: 0 !important;
}
.quick-view .title:hover .hover-content,
.quick-view.active .hover-content,
.quick-view.active .title.force-click .hover-content,
.quick-view.active .title.force-click:hover .hover-content,
.quick-view .title:hover .hover-content *,
.quick-view.active .hover-content *,
.quick-view.active .title.force-click .hover-content *,
.quick-view.active .title.force-click:hover .hover-content * {
  height: inherit !important;
}

.quick-view .hover-content > .card {
  box-shadow: 0 5px 1rem #2f2c2c;
}

.quick-view .tag {
  outline: 1px solid white;
  padding: 0.25rem 0.25rem;
}

.quick-view .quick-view-close-button.active {
  top: -1.5rem;
  pointer-events: all;
}

.quick-view .quick-view-close-button {
  position: absolute;
  color: var(--light);
  top: 1rem;
  right: 2px;
  background: var(--danger);
  height: 35px;
  width: 35px;
  z-index: -1;
  pointer-events: none;
  transition: all 0.25s linear;
  outline: 2px solid #2f2c2c;
}

.quick-view-slot {
  padding: 0.25rem;
}
</style>
