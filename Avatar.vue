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
      <div class="d-flex align-items-center justify-content-between">
        <div class="card">
          <div class="p-3">
            <quick-crop
              recommendation="Set your user avatar 250x250"
              :initial-image="user.avatar"
              :height="250"
              :width="250"
              @save="changeAvatar"
            />
          </div>
        </div>
      </div>
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
      cropper: {},
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
    changeAvatar({cropper, file}) {
      store.dispatch("changeAvatar", {
        name: file.name,
        base64: cropper.generateDataUrl(),
        type: "image/png",
        size: file.size || 1
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
        height: this.size,
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
