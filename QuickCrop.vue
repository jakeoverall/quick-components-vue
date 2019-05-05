<template>
  <section class="image-cropper">
    <div class="text-center">
      <div
        class="bg-checkered"
        :style="{height: height+'px', width: width + 'px'}"
        style="position: relative"
      >
        <div class="close-button action muted" @click="cropper.remove()">
          <i class="fa fa-lg fa-times-circle text-danger"></i>
        </div>
        <croppa
          placeholder="select or drop image here"
          placeholder-color="var(--warning)"
          loading-color="var(--warning)"
          accept="image/*"
          v-model="cropper"
          :zoom-speed="12"
          :width="width"
          :height="height"
          :initial-image="initial"
          :show-remove-button="false"
          :replace-drop="true"
          :show-loading="true"
          @file-choose="fileChanged"
        ></croppa>
      </div>
      <div
        class="bg-dark underline text-light d-flex justify-content-around align-items-center p-1"
        :style="{width: width + 'px'}"
        v-if="showToolbar"
      >
        <i
          class="fa fa-fw fa-picture-o action muted"
          title="select file"
          @click="cropper.chooseFile()"
        ></i>
        <i
          class="fa fa-fw fa-arrows-h action muted d-none d-md-block"
          title="Flip Horizontal"
          @click="cropper.flipX()"
        ></i>
        <i
          class="fa fa-fw fa-arrows-v action muted d-none d-md-block"
          title="Flip Vertical"
          @click="cropper.flipY()"
        ></i>
        <i class="fa fa-fw fa-floppy-o action muted" title="Save Image" @click="save()"></i>
        <i
          class="fa fa-fw fa-cloud-download action muted"
          title="Download Image"
          @click="downloadImage()"
        ></i>
        <i
          class="fa fa-fw fa-refresh text-danger action muted"
          title="Revert to Original"
          @click="cropper.remove(); cropper.refresh()"
        ></i>
      </div>
      <div
        :style="{width: width + 'px'}"
        class="p-1 bg-dark text-light text-center"
        v-if="error || recommendation"
      >
        <small>{{error}}</small>
        <small v-if="!error">{{recommendation}}</small>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "QuickCrop",
  props: {
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    showToolbar: { type: Boolean, default: true },
    initialImage: { type: String, default: "" },
    autoSave: { type: Boolean, default: false },
    recommendation: String,
    error: String
  },
  data() {
    return {
      cropper: {},
      file: {},
      delay: 0,
      initial: ""
    };
  },
  mounted() {
    this.initial = this.initialImage
    this.cropper.refresh()
    if (this.autoSave) {
      // this.cropper.$on("new-image-drawn", this.save);
      this.cropper.$on("move", this.save);
      this.cropper.$on("zoom", this.save);
    }
  },
  methods: {
    save() {
      if (this.delay) {
        clearTimeout(this.delay);
      }
      this.delay = setTimeout(() => {
        this.delay = null;
        if (!this.file.name) {
          this.file.name = "capture";
        }
        this.$emit("save", { cropper: this.cropper, file: this.file });
      }, 250);
    },
    async downloadImage() {
      let e = event;
      const blob = await this.cropper.promisedBlob("image/png", 1);
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.style = "display: none";
      a.download = this.file.name || "capture";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    fileChanged(file) {
      this.file = file;
      if (this.autoSave) {
        this.save();
      }
    }
  }
};
</script>


<style>
.bg-checkered {
  background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
    linear-gradient(-45deg, #808080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #808080 75%),
    linear-gradient(-45deg, transparent 75%, #808080 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  outline: 1px dashed #808080;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>