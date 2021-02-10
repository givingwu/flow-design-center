<template>
  <el-dialog class="warning-message" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseMessageDialog',
}
</script>

<style lang="scss" scoped>
.warning-message {
  padding-top: 10px;
  text-align: center;

  .el-icon-warning {
    color: #f16e6e;
    font-size: 36px;
  }
}
</style>
