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
      :class="{collapsed: prop.collapsed}"
    >
      <div
        class="form-group p-2 m-2 border"
        v-for="(item, k) in model[prop.name]"
        :key="`${prop.name}-model-${k}`"
      >
        <div class="content-actions d-flex justify-content-between">
          <div class="action muted" @click="collapseItem(prop.name, k)">
            <i
              class="fa fa-fw fa-caret-down toggler"
              :class="{'rotate-up': collapsed[prop.name]? collapsed[prop.name][k]: true}"
            ></i>
            <span>{{item.name}}</span>
          </div>
          <i class="fa fa-fw fa-ellipsis-h action muted toggler"></i>
        </div>
        <div
          class="content-item"
          :class="{collapsed: collapsed[prop.name]? collapsed[prop.name][k]: true}"
        >
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
import vue from 'vue'
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
      collapsed: {}
    };
  },
  methods: {
    collapseItem(prop, i) {
      vue.set(this.collapsed, prop, this.collapsed[prop] || {});
      vue.set(this.collapsed[prop], i, !this.collapsed[prop][i]);
    },
    validateProp(prop, val) {
      this.$emit("validate", prop);
    }
  },
  components: {
    InputType
  }
};
</script>
