<template>
  <form-wizard
    @on-complete="submit"
    @on-change="onChange"
    color="var(--primary)"
    error-color="var(--danger)"
    :class="{
      'disable-nav': disableNav, 
      'md-form': useMaterial 
    }"
    :title="wizard.title"
    :subtitle="wizard.subtitle"
  >
    <tab-content
      v-for="(step, i) in steps"
      :key="i"
      :before-change="validateStep"
      :title="step.title"
      :icon="step.icon"
    >
      <div class="form-group" v-for="prop in step.props" :key="prop.name">
        <many-type
          v-if="prop.fieldType == 'many'"
          :prop="prop"
          :model="model[prop.name]"
          :errors="errors"
          @validate="validateProp(prop, model[prop.name])"
        />
        <input-type
          v-else
          :prop="prop"
          :model="model"
          :errors="errors"
          @validate="validateProp(prop, model[prop.name])"
        />
      </div>
    </tab-content>
  </form-wizard>
</template>

<script>
import vue from "vue";
import ManyType from "./ManyType.vue";
import InputType from "./InputType.vue";

export default {
  name: "QuickForm",
  props: {
    wizard: {
      type: Object,
      default() {
        return {
          title: "",
          subtitle: ""
        };
      }
    },
    model: { type: Object, required: true },
    steps: { type: Array, required: true },
    disableNav: {
      type: Boolean,
      default() {
        return this.steps.length >= 1;
      }
    },
    useMaterial: Boolean
  },
  data() {
    return {
      currentStep: 0,
      errors: {}
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  mounted() {
    if (!window.WIZARDLISTENING) {
      window.WIZARDLISTENING = true;
      document.addEventListener("keypress", this.goNext);
    }
  },
  beforeDestroy() {
    this.removeGoNext();
  },
  methods: {
    removeGoNext() {
      document.removeEventListener("keypress", this.goNext);
      window.WIZARDLISTENING = false;
    },
    goNext(e) {
      if (e.keyCode == 13) {
        try {
          if (e.target.nodeName == "TEXTAREA") {
            return;
          }
          var next = document.querySelectorAll(".wizard-btn");
          next[next.length - 1].click();
        } catch (err) {
          console.log("removing event listener");
          this.removeGoNext();
        }
      }
    },
    submit() {
      this.$emit("submit", this);
    },
    onChange: function(prev, next) {
      this.currentStep = next;
    },
    addCropper({ cropper, file }, prop) {
      prop.cropper = cropper;
      prop.file = file;
    },
    handleMany(prop) {
      let promises = [];
      try {
        this.model[prop.name].forEach(item => {
          prop.props.forEach(p => {
            this.validateProp(p, item);
            if (typeof p.beforeNext == "function") {
              promises.push(
                new Promise(async (resolve, reject) => {
                  item[p.name] = await p.beforeNext(item[p.name], this, item);
                  this.validateProp(p);
                  resolve();
                })
              );
            }
          });
        });
      } catch (e) {
        this.$store.dispatch("addNotification", e);
      } finally {
        return promises;
      }
    },
    async validateStep() {
      if (!this.steps[this.currentStep]) {
        return true;
      }
      let props = this.steps[this.currentStep].props;
      this.errors = {};
      let promises = [];
      try {
        this.$store.dispatch("SetLoadState", true);
        props.forEach(prop => {
          if (prop.fieldType == "many") {
            let p = this.handleMany(prop);
            promises = [...promises, ...p];
            return;
          }

          if (typeof prop.beforeNext == "function") {
            promises.push(
              new Promise(async (resolve, reject) => {
                this.model[prop.name] = await prop.beforeNext(
                  this.model[prop.name],
                  this,
                  this.model
                );
                resolve();
              })
            );
          }
          this.validateProp(prop, this.model);
        });
        await Promise.all(promises);
      } catch (e) {
        throw e;
      } finally {
        this.$store.dispatch("SetLoadState", false);
        return Object.keys(this.errors).length == 0;
      }
    },
    validateProp(prop, item) {
      if (prop.required) {
        if (!item[prop.name]) {
          this.errors[prop.name] = "* Required Field";
        } else {
          delete this.errors[prop.name];
        }
      }
    }
  },
  components: { ManyType, InputType }
};
</script>

<style>
.vue-form-wizard.disable-nav .wizard-nav,
.vue-form-wizard.disable-nav .wizard-header,
.vue-form-wizard.disable-nav .wizard-progress-bar {
  display: none;
}

.vue-form-wizard.disable-nav .wizard-tab-content {
  padding: 0;
}

.no-select {
  user-select: none;
}

fieldset .content {
  transition: height 0.15s ease;
}

fieldset .content.collapsed {
  opacity: 0;
  height: 0;
  pointer-events: none;
}

.content-item {
  transition: height 0.15s ease;
}
.content-item.collapsed {
  display: none;
}

.toggler {
  transition: all 0.15s ease;
}
.toggler.rotate-down {
  transform: rotate(90deg);
}
.toggler.rotate-up {
  transform: rotate(-90deg);
}
</style>