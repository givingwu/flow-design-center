<template>
  <div class="flow-panel-block">
    <div v-if="title || $slots.title" class="flow-panel-hd">
      <slot v-if="$slots.title" name="title"></slot>
      <h4 v-else>{{title}}</h4>
    </div>

    <div class="flow-panel-bd">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelBlock',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
