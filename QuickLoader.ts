import QuickForm from './QuickForm/QuickForm.vue'
import QuickCollapse from './QuickCollapse.vue'
import QuickModal from './QuickModal.vue'
import QuickView from './QuickView.vue'
import QuickNotification from './Notifications/Notification.vue'
import NotificationStore from "./Notifications/NotificationStore";
import Avatar from "./Avatar.vue"
import Navbar from "./Navbar.vue"
import Sidebar from "./Sidebar.vue"
import Autocomplete from "./Autocomplete.vue"

import './ExtensionMethods'
import { VueCroppa } from './assets/vue-croppa'
import QuickCrop from './QuickCrop.vue'

import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import './assets/material-forms.css'

class QuickLoader {
  install(Vue, options) {
    Vue.use(VueCroppa)
    Vue.use(VueFormWizard)
    if (options.store) {
      Vue.component('notification', QuickNotification)
      options.store.registerModule('NotificationStore', NotificationStore)
    }
    Vue.component('quick-form', QuickForm)
    Vue.component('quick-modal', QuickModal)
    Vue.component('quick-collapse', QuickCollapse)
    Vue.component('quick-view', QuickView)
    Vue.component('quick-crop', QuickCrop)
    Vue.component('autocomplete', Autocomplete)
    Vue.component('avatar', Avatar)
    Vue.component('navbar', Navbar)
    Vue.component('sidebar', Sidebar)
  }
}

export default new QuickLoader