<template>
  <div>
    <div class="avatar text-white" :style="avatarStyle(false)">
      <div
        v-if="canChange"
        @click="toggle +=1"
        class="bg-dark muted d-flex flex-column align-items-center justify-content-center p-1 on-hover"
        :style="avatarStyle(true)"
      >
        <i class="fa fa-fw fa-camera"></i>
        <small>Update</small>
      </div>
    </div>
    <quick-modal :toggle="toggle">
      <form class="m-3" @submit.prevent="changeAvatar()">
        <div class="d-flex align-items-center justify-content-between">
          <div class="card">
            <div class="d-flex align-items-center justify-content-between p-5 m-3">
              <div>
                <img :src="user.avatar || defaultAvatar" width="70" class="mr-3">
              </div>
              <div class="d-flex align-items-center">
                <i class="fa fa-fw fa-arrow-circle-right fa-lg mr-3 text-primary"></i>

                <input
                  v-if="!preview"
                  class="upload"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  @change.capture="readFile"
                >
                <img v-else :src="preview" width="70" @click="preview = ''">
              </div>
            </div>
            <div v-if="preview">
              <div class="text-center">
                <button type="submit" class="btn btn-primary mr-3">Confirm</button>
                <button type="button" class="btn btn-danger text-white" @click="preview = ''">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </quick-modal>
  </div>
</template>

<script>
import store from "@client/store";

export default {
  name: "avatar",
  props: {
    user: { type: Object, required: true },
    size: { type: String, default: "100%" },
    borderStyle: { type: String, default: "" },
    radius: { type: String, default: "" }
  },
  data() {
    return {
      toggle: 0,
      preview: "",
      defaultAvatar: "https://boisecodeworks.com/assets/img/default-avatar.jpg",
      file: {
        name: "",
        type: "",
        size: 0
      }
    };
  },
  computed: {
    identity() {
      return this.$store.state.user;
    },
    canChange() {
      return this.identity.id == this.user.id;
    }
  },
  methods: {
    readFile(event) {
      try {
        let files = event.target.files;
        if (files[0]) {
          let FR = new FileReader();

          FR.addEventListener("load", e => {
            //@ts-ignore
            this.preview = e.target.result;
          });
          this.file = files[0];
          FR.readAsDataURL(files[0]);
        }
      } catch (err) {
        console.error(err);
      }
    },
    changeAvatar() {
      store.dispatch("changeAvatar", {
        name: this.file.name,
        type: this.file.type,
        size: this.file.size,
        base64: this.preview
      });
    },
    avatarStyle(preventImg) {
      let img = "url(" + this.user.avatar || this.defaultAvatar + ")";
      if (preventImg) {
        img = "unset";
      }
      return {
        "background-image": img,
        "border-radius": this.radius,
        border: this.borderStyle,
        "height": this.size,
        "max-width": this.size
      };
    }
  }
};
</script>

<style>
.avatar {
  min-height: 35px;
  min-width: 35px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  font-size: medium;
}

.on-hover {
  height: 0;
  transition: all 0.15s linear;
  opacity: 0;
}

*:hover > .on-hover {
  height: 100%;
  opacity: 0.8;
  cursor: pointer;
}
</style>
