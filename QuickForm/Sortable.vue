<template>
  <div
    class="d-flex flex-column content"
    :class="{collapsed: collapseZone, dragging: dragging != -1, 'flex-column-reverse': reverse}"
    :dropzone="zone+'-dropzone'"
    droppable="true"
    @drop="dragDrop()"
    @dragover.prevent="dragOverContainer()"
  >
    <div
      class="form-group p-2 m-2 border draggable"
      :class="{over: k == next}"
      v-for="(item, k) in arr"
      :key="k"
      :draggable="enableDrag"
      @dragstart="dragStart(item, k, arr)"
      @dragend="dragEnd(item, k, arr)"
      @dragover="dragOver(item, k, arr)"
    >
      <div class="content-actions d-flex justify-content-between">
        <div class="action muted" @click="collapseItem(k)">
          <i class="fa fa-fw fa-caret-down toggler" :class="{'rotate-up': !collapsed[k]}"></i>
          <span>{{item[displayField]}}</span>
        </div>
        <i class="fa fa-fw fa-ellipsis-h action muted toggler"></i>
      </div>
      <div class="content-item" :class="{collapsed: !collapsed[k]}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import vue from 'vue'
export default {
  name: "Sortable",
  inheritAttrs: false,
  props: {
    arr: { type: Array, required: true },
    zone: { type: String, default: "unnamed" },
    displayField: { type: String, default: "name" },
    reverse: { type: Boolean, default: false },
    enableDrag: { type: Boolean, default: true },
    collapseZone: Boolean,
  },
  data() {
    return {
      collapsed: {},
      dragging: -1,
      next: -1
    };
  },
  methods: {
    collapseItem(i) {
      vue.set(this.collapsed, i, !this.collapsed[i]);
    },
    dragStart(item, i, arr) {
      event.target.classList.add("active");
      this.dragging = i;
    },
    dragOver(item, i, arr) {
      if (i == this.dragging) {
        return;
      }
      event.currentTarget.setAttribute("data-moving", item.name);
      this.next = i;
    },
    dragEnd() {
      event.target.classList.remove("active");
    },
    dragDrop() {
      if (this.dragging == -1 || this.next == -1) {
        this.dragging = -1;
        this.next = -1;
        return;
      }
      let item = this.arr.splice(this.dragging, 1);
      if (!item) {
        return;
      }
      this.arr.splice(this.next, 0, ...item);
      this.dragging = -1;
      this.next = -1;
    },
    dragOverContainer() {}
  }
};
</script>

<style>
.draggable {
  transition: all 0.15s linear;
  position: relative;
}

.dragging .draggable.active {
  background: var(--secondary);
  color: var(--light);
}

.draggable.over::before {
  position: absolute;
  padding: 8px;
  top: -3em;
  content: attr(data-moving);
  width: 100%;
  border: 1px dotted !important;
}

.draggable.over {
  margin-top: 3em !important;
  border: 1px dotted !important;
}
</style>
