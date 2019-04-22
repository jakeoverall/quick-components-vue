<template>
  <fieldset class="border p-1">
    <legend class="w-auto no-select">
      <span class="action muted" @click="prop.collapsed = !prop.collapsed">
        <i
          class="fa fa-fw small action muted fa-caret-right toggler"
          :class="{ 'rotate-down': !prop.collapsed }"
        ></i>
        <span class="ml-1 mr-1">{{prop.text}}</span>
      </span>
      <i
        class="fa fa-fw fa-plus-square small text-primary action muted"
        v-if="!prop.collapsed"
        @click="model[prop.name].push(prop.schema())"
        title="Add"
      ></i>
    </legend>

    <div
      class="d-flex flex-column flex-column-reverse content"
      :class="{collapsed: prop.collapsed, dragging: dragging != -1}"
      :dropzone="prop.name+'-dropzone'"
      droppable="true"
      @drop="dragDrop()"
      @dragover.prevent="dragOverContainer()"
    >
      <div
        class="form-group p-2 m-2 border draggable"
        :class="{over: k == next}"
        v-for="(item, k) in model[prop.name]"
        :key="`${prop.name}-model-${k}`"
        draggable="true"
        @dragstart="dragStart(item, k, model[prop.name])"
        @dragend="dragEnd(item, k, model[prop.name])"
        @dragover="dragOver(item, k, model[prop.name])"
      >
        <div class="content-actions d-flex justify-content-between">
          <div class="action muted" @click="collapseItem(prop.name, k)">
            <i class="fa fa-fw fa-caret-down toggler" :class="{'rotate-up': !collapsed[k]}"></i>
            <span>{{item.name}}</span>
          </div>
          <i class="fa fa-fw fa-ellipsis-h action muted toggler"></i>
        </div>
        <div class="content-item" :class="{collapsed: !collapsed[k]}">
          <input-type
            v-for="(p, i) in prop.props"
            :key="`${p.name}-prop-${k}${i}`"
            :prop="p"
            :model="item"
            :errors="errors"
            @validate="validateProp(p, model[prop.name])"
          />
          <button class="btn btn-danger btn-block mt-1" @click="model[prop.name].splice(k,1)">Remove</button>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
import vue from "vue";
import InputType from "./InputType";
export default {
  name: "ManyType",
  props: {
    prop: { type: Object, required: true },
    model: { type: Object, required: true },
    errors: { type: Object, required: true }
  },
  data() {
    return {
      collapsed: {},
      dragging: -1,
      next: -1
    };
  },
  methods: {
    collapseItem(prop, i) {
      vue.set(this.collapsed, i, !this.collapsed[i]);
    },
    validateProp(prop, val) {
      this.$emit("validate", prop);
    },
    dragStart(item, i, arr) {
      event.target.classList.add("active");
      this.dragging = i;
    },
    dragOver(item, i, arr) {
      if (i == this.dragging) {
        return;
      }
      event.currentTarget.setAttribute('data-moving', item.name)
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
      let item = this.model[this.prop.name].splice(this.dragging, 1);
      if(!item){ return }
      this.model[this.prop.name].splice(this.next, 0, ...item);
      this.dragging = -1;
      this.next = -1;
    },
    dragOverContainer() {}
  },
  components: {
    InputType
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