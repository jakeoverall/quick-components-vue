<template>
  <div v-if="!prop.dependsOn || (prop.dependsOn && model[prop.dependsOn])">
    <!-- CHECKBOX -->
    <label :for="prop.name" v-if="prop.fieldType == 'checkbox'" class="checkbox">
      <input
        :id="prop.name"
        type="checkbox"
        v-if="prop.fieldType == 'checkbox'"
        v-model="model[prop.name]"
        class="mr-1"
      >
      <span class="checkmark"></span>
      <span>{{prop.text}}</span>
      <small class="muted ml-3 text-info">{{prop.helper}}</small>
    </label>

    <label v-else :for="prop.name">
      <span>{{prop.text}}</span>
      <small class="muted ml-3 text-info">{{prop.helper}}</small>
    </label>

    <div class="d-flex align-items-stretch">
      <!-- TEXT INPUT -->
      <input
        type="text"
        class="form-control"
        v-model.trim="model[prop.name]"
        :maxlength="prop.max || 1000"
        @keydown="validateProp(prop)"
        :placeholder="prop.placeholder"
        v-if="!prop.fieldType"
      >

      <!-- TEXTAREA -->
      <textarea
        type="text"
        class="form-control"
        v-model.trim="model[prop.name]"
        :maxlength="prop.max || 1000"
        @keydown="validateProp(prop)"
        :placeholder="prop.placeholder"
        v-if="prop.fieldType == 'textarea'"
      ></textarea>

      <!-- IMAGE UPLOADER -->
      <div
        v-if="prop.fieldType == 'img'"
        class="bg-secondary p-1 flex-grow-1 d-flex align-items-center flex-wrap justify-content-around"
      >
        <quick-crop
          :height="prop.height"
          :width="prop.width"
          :initial-image="model[prop.name]"
          :auto-save="true"
          @save="prop.onFile(...arguments, model)"
        />
        <div class="p-2 b text-light action muted text-center">
          <i class="fa fa-fw fa-md fa-picture-o"></i>
          <h5>Add Image</h5>
          <small>{{prop.fileSpecs}}</small>
        </div>
      </div>

      <!-- SELECT -->
      <select v-model="model[prop.name]" v-if="prop.fieldType == 'select'" class="form-control">
        <option v-if="!prop.selectOptions" selected disabled>[INVALID SETUP NO OPTIONS SENT]</option>
        <option v-for="o in prop.selectOptions" :key="o" :value="o">{{o}}</option>
      </select>

      <!-- END OF INPUT TYPES -->
      <div
        class="text-white input-counter"
        v-if="prop.max"
        :class="prop.max >= model[prop.name].length ? 'bg-primary' : 'bg-danger'"
      >
        <span>{{prop.max - model[prop.name].length}}</span>
      </div>
    </div>
    <div>
      <small class="text-danger">{{errors[prop.name]}}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputType",
  props: {
    prop: { type: Object, required: true },
    model: { type: Object, required: true },
    errors: { type: Object, required: true }
  },
  methods:{
    validateProp(p){
      this.$emit('validate', p)
    }
  }
};
</script>
