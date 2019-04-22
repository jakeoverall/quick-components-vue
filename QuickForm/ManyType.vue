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




    <sortable :arr="model[prop.name]" :collapse-zone="prop.collapsed">
      <div slot="item" slot-scope="slotProps" class="content-item">
        <input-type
          v-for="(p, i) in prop.props"
          :key="`${p.name}-prop-${i}`"
          :prop="p"
          :model="slotProps.item"
          :errors="errors"
          @validate="validateProp(p, model[prop.name])"
        />
        <button class="btn btn-danger btn-block mt-1" @click="model[prop.name].splice(k,1)">Remove</button>
      </div>
    </sortable>

  </fieldset>
</template>

<script>
import vue from "vue";
import InputType from "./InputType";
import Sortable from "./Sortable";

export default {
  name: "ManyType",
  props: {
    prop: { type: Object, required: true },
    model: { type: Object, required: true },
    errors: { type: Object, required: true }
  },
  methods: {
    validateProp(prop, val) {
      this.$emit("validate", prop);
    }
  },
  components: {
    InputType,
    Sortable
  }
};
</script>