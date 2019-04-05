import QuickCollapse from './QuickCollapse.vue'
import QuickModal from './QuickModal.vue'
import QuickView from './QuickView.vue'
import QuickNotification from './Notifications/Notification.vue'
import store from "@client/store";
import NotificationStore from "./Notifications/NotificationStore";
class QuickLoader {
  install(Vue, options) {
    if (options.store) {
      Vue.component('notification', QuickNotification)
      store.registerModule('NotificationStore', NotificationStore)
    }
    Vue.component('quick-modal', QuickModal)
    Vue.component('quick-collapse', QuickCollapse)
    Vue.component('quick-view', QuickView)
  }
}

export default new QuickLoader