import QuickCollapse from './QuickCollapse.vue'
import QuickModal from './QuickModal.vue'
import QuickView from './QuickView.vue'
import QuickNotification from './Notifications/Notification.vue'
import NotificationStore from "./Notifications/NotificationStore";
import Avatar from "./Avatar.vue"
import Navbar from "./Navbar.vue"
import Autocomplete from "./Autocomplete.vue"

import './ExtensionMethods'
import { VueCroppa } from './assets/vue-croppa'
import QuickCrop from './QuickCrop.vue'

class QuickLoader {
  install(Vue, options) {
    Vue.use(VueCroppa)
    if (options.store) {
      Vue.component('notification', QuickNotification)
      options.store.registerModule('NotificationStore', NotificationStore)
    }
    Vue.component('quick-modal', QuickModal)
    Vue.component('quick-collapse', QuickCollapse)
    Vue.component('quick-view', QuickView)
    Vue.component('quick-crop', QuickCrop)
    Vue.component('autocomplete', Autocomplete)
    Vue.component('avatar', Avatar)
    Vue.component('navbar', Navbar)
  }
}

export default new QuickLoader