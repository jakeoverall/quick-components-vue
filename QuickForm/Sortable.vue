<template>
  <div
    style="position: relative"
    class="d-flex flex-column content dropzone-container"
    :class="{collapsed: collapseZone, 'flex-column-reverse': reverse, over: isDroppableZone()}"
    :dropzone="zone+'-dropzone'"
    :droppable="droppableZone"
    @drop="dragDrop(arr, zone)"
    @dragover.prevent="dragOverContainer(arr, zone)"
  >
    <div style="position:absolute; right: 0; top: -30px;" v-if="i != -1">
      <i
        class="fa fa-fw fa-trash text-danger trash-item action muted"
        @drop="removeFromList(arr, zone)"
        droppable="true"
      ></i>
    </div>

    <div
      class="form-group p-2 m-2 border draggable"
      :class="{over: k == next}"
      v-for="(item, k) in arr"
      :key="k"
      :draggable="k == i"
      @dragstart.stop="dragStart(item, k, arr)"
      @dragend="dragEnd(item, k, arr)"
      @dragover="dragOver(item, k, arr)"
      :id="item[displayField]"
    >
      <div class="content-actions d-flex justify-content-between align-items-center">
        <div class="action muted" @click="collapseItem(k)">
          <i class="fa fa-fw fa-caret-down toggler" :class="{'rotate-up': !collapsed[k]}"></i>
          <span>{{item[displayField]}}</span>
        </div>
        <i
          v-if="enableDrag"
          class="fa fa-fw action muted toggler drag-handle"
          :class="k == i ? 'fa-arrows' :'fa-bars'"
          @mousedown="i = k == i ? -1 : k"
          @touch="i = k == i ? -1 : k"
        ></i>
      </div>
      <div class="content-item" :class="{collapsed: !collapsed[k]}">
        <slot name="item" :item="item" :index="k" :arr="arr">{{k}} - {{item}}</slot>
      </div>
    </div>

    <div
      @dragover="dragOver({}, arr.length, arr)"
      @click="addItem"
      class="form-group border draggable d-flex align-items-center no-select justify-content-center m-2 action muted"
      style="border-style: dotted !important"
      :class="{over: arr.length == next}"
    >
      <small>add {{zone}}</small>
    </div>
  </div>
</template>

<script>
import vue from "vue";
const DRAGGABLEITEM = "DRAGGABLEITEM";

export default {
  name: "Sortable",
  inheritAttrs: false,
  props: {
    arr: { type: Array, required: true },
    zone: { type: String, default: "unnamed" },
    displayField: { type: String, default: "name" },
    reverse: { type: Boolean, default: false },
    enableDrag: { type: Boolean, default: true },
    schema: { type: Function, required: true },
    collapseZone: Boolean,
    ghostElem: {}
  },
  data() {
    return {
      collapsed: {},
      item: {},
      i: -1,
      next: -1,
      to: [],
      from: [],
      droppableZone: false,
      elem: {},
      DRAGGABLEITEM
    };
  },
  beforeCreate() {
    window[DRAGGABLEITEM] = window[DRAGGABLEITEM] || {
      item: {},
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
    addItem() {
      this.arr.push(this.schema());
    },
    dragStart(item, i, arr) {
      event.currentTarget.classList.add('moving')
      let elem = document.createElement("div");
      elem.className =
        "form-group p-2 m-2 border draggable bg-secondary text-light action muted";
      elem.innerText = item[this.displayField];
      elem.style.position = "fixed";
      elem.style.width = "50%";
      document.body.appendChild(elem);
      event.dataTransfer.setDragImage(elem, 0, 0);
      window[DRAGGABLEITEM] = {
        item,
        i,
        next: i,
        from: arr,
        to: arr,
        zone: this.zone,
        elem
      };
      this.updateComponent();
    },
    dragOver(_, targetI, arr) {
      if (!this.isDroppableZone()) {
        return;
      }
      let { i, next, to, from, item } = window[DRAGGABLEITEM];
      if (to == from && targetI == i + 1) {
        //"BAILING OUT BECAUSE CANNOT SPLICE TO SAME LOCATION"
        return;
      }

      event.currentTarget.setAttribute(
        "data-moving",
        window[DRAGGABLEITEM].item[this.displayField] || "Move to here"
      );
      window[DRAGGABLEITEM].next = targetI;
      this.next = targetI;
      this.updateComponent();
    },
    dragEnd() {
      try {
        document.body.removeChild(this.elem);
        event.currentTarget.classList.remove('moving')
        this.resetDragging();
      } catch (e) {}
    },
    dragDrop(arr, targetZone) {
      let { i, next, to, from, item, zone } = window[DRAGGABLEITEM];
      if (targetZone !== zone) {
        return;
      }
      if (i < next && to == from) {
        next -= 1;
      }
      this.removeFromList();
      to.splice(next, 0, item);
      this.resetDragging();
    },
    resetDragging() {
      window[DRAGGABLEITEM] = {
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
      for (let k in window[DRAGGABLEITEM]) {
        if (k == "zone") {
          continue;
        }
        this[k] = window[DRAGGABLEITEM][k];
      }
      vue.nextTick();
    },
    dragOverContainer(arr, zone) {
      if (!this.isDroppableZone()) {
        return;
      }
      window[DRAGGABLEITEM].to = arr;
      document
        .querySelectorAll(".dropzone-container.over")
        .forEach(elem => elem.classList.remove("over"));
      event.currentTarget.classList.add("over");
      this.updateComponent();
    },
    isDroppableZone() {
      this.droppableZone = this.zone == window[DRAGGABLEITEM].zone;
      return this.droppableZone;
    },
    removeFromList() {
      if (!this.isDroppableZone()) {
        return;
      }
      let { i, next, to, from, item } = window[DRAGGABLEITEM];
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
.drag-handle {
  cursor: move;
}

.dropzone-container.over > .draggable.over::before {
  position: absolute;
  padding: 8px;
  top: -3em;
  content: attr(data-moving);
  width: 100%;
  border: 1px dotted !important;
  background: var(--secondary);
  color: var(--light);
  opacity: .6;
}

.dropzone-container.over > .draggable.over {
  margin-top: 3em !important;
  border: 1px dotted !important;
}

.draggable[draggable="true"]{
  background-color: var(--primary);
  color: var(--light);
}
</style>
