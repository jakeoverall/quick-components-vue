<template>
  <fieldset class="border p-1">
    <legend class="w-auto no-select">
      <span class="action muted" @click="collapsed = !collapsed">
        <i
          class="fa fa-fw small action muted fa-caret-right toggler"
          :class="{ 'rotate-down': !collapsed }"
        ></i>
        <span class="ml-1 mr-1">{{prop.text ? prop.text : prop.name}} <small v-if="model.length" class="small">({{model.length}})</small></span>
      </span>
      <i
        class="fa fa-fw fa-plus-square small text-primary action muted"
        v-if="!collapsed"
        @click="model.push(prop.schema())"
        title="Add"
      ></i>
    </legend>
    <div class="content-item" :class="{collapsed}">
      <sortable :arr="model" :zone="prop.zone || prop.name" :schema="prop.schema">
        <div slot="item" slot-scope="slotProps" class="content-item">
          <div v-for="(p, i) in prop.props" :key="`${p.name}-prop-${i}`">
            <many-type
              v-if="p.fieldType == 'many'"
              :name="`${p.name}-nested-${i}${slotProps.k}`"
              :prop="p"
              :model="slotProps.item[p.name]"
              :errors="errors"
              @validate="validateProp(p, slotProps.item)"
            />
            <input-type
              v-else
              :prop="p"
              :model="slotProps.item"
              :errors="errors"
              @validate="validateProp(p, slotProps.item)"
            />
          </div>
        </div>
      </sortable>
    </div>
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
    model: { type: Array, required: true },
    errors: { type: Object, required: true }
  },
  data() {
    return {
      collapsed: false
    };
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