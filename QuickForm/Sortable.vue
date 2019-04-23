<template>
  <div
    style="position: relative"
    class="d-flex flex-column content"
    :class="{collapsed: collapseZone, 'flex-column-reverse': reverse}"
    :dropzone="zone+'-dropzone'"
    droppable="true"
    @drop="dragDrop(arr, zone)"
    @dragover.prevent="dragOverContainer(arr, zone)"
  >
  <div style="position:absolute; right: 0; top: -30px;" v-if="i != -1">
    <i class="fa fa-fw fa-trash text-danger trash-item action muted" @drop="removeFromList(arr, zone)" droppable="true"></i>
  </div>

    <div
      class="form-group p-2 m-2 border draggable"
      :class="{over: k == next && i != k}"
      v-for="(item, k) in arr"
      :key="k"
      :draggable="enableDrag"
      @dragstart="dragStart(item, k, arr)"
      @dragend="dragEnd(item, k, arr)"
      @dragover="dragOver(item, k, arr)"
      :id="item[displayField]"
    >
      <div class="content-actions d-flex justify-content-between">
        <div class="action muted" @click="collapseItem(k)">
          <i class="fa fa-fw fa-caret-down toggler" :class="{'rotate-up': !collapsed[k]}"></i>
          <span>{{item[displayField]}}</span>
        </div>
        <i class="fa fa-fw fa-ellipsis-h action muted toggler"></i>
      </div>
      <div class="content-item" :class="{collapsed: !collapsed[k]}">
        <slot name="item" :item="item" :index="k" :arr="arr">{{k}} - {{item}}</slot>
      </div>
    </div>
    <div @dragover="dragOver({}, arr.length, arr)" class="form-group p-2 m-2 border draggable" :class="{over: arr.length == next}"></div>
  </div>
</template>

<script>
import vue from "vue";
export default {
  name: "Sortable",
  inheritAttrs: false,
  props: {
    arr: { type: Array, required: true },
    zone: { type: String, default: "unnamed" },
    displayField: { type: String, default: "name" },
    reverse: { type: Boolean, default: false },
    enableDrag: { type: Boolean, default: true },
    collapseZone: Boolean
  },
  data() {
    return {
      collapsed: {},
      moving: {},
      i: -1,
      next: -1,
      to: [],
      from: []
    };
  },
  methods: {
    collapseItem(i) {
      vue.set(this.collapsed, i, !this.collapsed[i]);
    },
    dragStart(item, i, arr) {
      event.dataTransfer.setDragImage(event.currentTarget.firstChild, 0, 0);
      window["DRAGGABLEITEM"] = {
        item,
        i,
        next: i,
        from: arr,
        to: arr,
        zone: this.zone
      };
      this.updateComponent();
    },
    dragOver(item, i, arr) {
      if (i == this.dragging || window["DRAGGABLEITEM"].next == i) {
        return;
      }
      event.currentTarget.setAttribute(
        "data-moving",
        window["DRAGGABLEITEM"].item[this.displayField] || "Move to here"
      );
      window["DRAGGABLEITEM"].next = i;
      this.next = i;
      this.updateComponent();
    },
    dragEnd() {
      this.resetDragging();
    },
    dragDrop(arr, zone) {
      let { i, next, to, from, item } = window["DRAGGABLEITEM"];
      if (item !== from[i]) {
        return;
      }
      from.splice(i, 1);
      if(i < next){
        next -= 1
      }
      to.splice(next, 0, item);
      this.resetDragging();
    },
    resetDragging() {
      window["DRAGGABLEITEM"] = {
        item: {},
        i: -1,
        next: -1,
        from: [],
        to: [],
        zone: ""
      };
      this.updateComponent();
    },
    updateComponent() {
      let { i, next, to, from, item } = window["DRAGGABLEITEM"];
      for (let k in window["DRAGGABLEITEM"]) {
        if (k == "zone") {
          continue;
        }
        this[k] = window["DRAGGABLEITEM"][k];
      }
    },
    dragOverContainer(arr, zone) {
      if (zone == window["DRAGGABLEITEM"].zone) {
        window["DRAGGABLEITEM"].to = arr;
        this.updateComponent();
      }
    },
    removeFromList(arr, zone){
      let { i, next, to, from, item } = window["DRAGGABLEITEM"];
      if (item !== from[i]) {
        return;
      }
      from.splice(i, 1);
      this.resetDragging();
    }
  }
};
</script>

<style>
.draggable {
  transition: all 0.15s linear;
  position: relative;
}

.draggable.over::before {
  position: absolute;
  padding: 8px;
  top: -3em;
  content: attr(data-moving);
  width: 100%;
  border: 1px dotted !important;
  background: var(--secondary);
  color: var(--light);
}

.draggable.over {
  margin-top: 3em !important;
  border: 1px dotted !important;
}

.trash-item:hover{
  font-size: 100px;
  color: purple !important;
}
</style>
