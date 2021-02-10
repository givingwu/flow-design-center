import Vue from 'vue'

export default {
  bind: function bind(el, binding, vnode) {
    Vue.nextTick(function() {
      binding.value(vnode.componentInstance || el, vnode.key);
    });
    binding.value(vnode.componentInstance || el, vnode.key);
  },
  update: function update(el, binding, vnode, oldVnode) {
    if (oldVnode.data && oldVnode.data.directives) {
      var oldBinding = oldVnode.data.directives.find(function(directive) {
        var name = directive.name;
        return name === "ref";
      });
      if (oldBinding && oldBinding.value !== binding.value) {
        oldBinding && oldBinding.value(null, oldVnode.key);
        binding.value(vnode.componentInstance || el, vnode.key);
        return;
      }
    }
    // Should not have this situation
    if (
      vnode.componentInstance !== oldVnode.componentInstance ||
      vnode.elm !== oldVnode.elm
    ) {
      binding.value(vnode.componentInstance || el, vnode.key);
    }
  },
  unbind: function unbind(el, binding, vnode) {
    binding.value(null, vnode.key);
  }
}
