<template>
  <div class="flow-graph-container">
    <div class="flow-graph">
      <Promised tag="div" :pending-delay="200" :promise="fetchData">
        <template slot="pending">
          <Spinner size="80"></Spinner>
        </template>

        <FlowLayout :root-node="rootNode" @loaded="scrollIntoCenter" :editable="false"></FlowLayout>

        <template slot="rejected" slot-scope="error">
          <div class="flow-graph__error">{{error.message}}</div>
        </template>
      </Promised>
    </div>
  </div>
</template>

<script>
  import './styles.scss'
  import Spinner from 'ibuild-portal-lte/src/components/Spinner/index'
  import {Promised} from 'vue-promised' // https://github.com/posva/vue-promised
  import FlowLayout from './components/flow/index'
  import {toModel} from './adapters/toModel'
  import {fetchFlowModel, fetchFlowModelByDeployment} from './service/index'
  import {CONDITION_FIELD_TYPES, CONDITION_PEOPLE_TYPES,} from './constants/ENUM_DEFINITIONS'

  export default {
  name: 'FlowGraph',
  components: {
    Spinner,
    Promised,
    FlowLayout,
  },
  data: () => ({
    flowForm: null,
    rootNode: null,
    fetchData: null,
  }),
  computed: {
    formFields() {
      const formData = this.flowForm || {}
      const fields = formData.fields || []

      return fields && fields.length ? fields : []
    },
    flowFields() {
      return this.formFields.map(
        ({ name, type, key, options: { required } }) => ({
          type,
          fieldKey: key,
          fieldName: name,
        })
      )
    },
    conditionFields() {
      return this.formFields
        .filter(({ type, options: { multiple } }) => {
          const conditionType = CONDITION_FIELD_TYPES[type]

          // fixed:(#1017652)表单设置选择人为多选，则不能设置为条件字段
          if (CONDITION_PEOPLE_TYPES[type]) {
            return !multiple
          } else {
            return !!conditionType
          }
        })
        .map(({ type, key, name, options: { options: fieldOptions } }) => ({
          fieldKey: key,
          fieldName: name,
          fieldType: type,
          fieldOptions: fieldOptions || [],
        }))
    },
    flowCode() {
      return this.$route.query && this.$route.query.flowCode
    },
    deploymentId() {
      return this.$route.query && this.$route.query.deploymentId
    },
    isReady() {
      return this.rootNode
    },
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if(this.flowCode) {
        this.fetchData = fetchFlowModel(this.flowCode).then(
          ({applyScopeName, flowModel, formContentObject: formModel}) => {
            this.flowForm = formModel
            this.rootNode = toModel(flowModel, {
              flowFields: this.flowFields,
              conditionFields: this.conditionFields,
            })
            this.rootNode && this.rootNode.read(applyScopeName)
          }
        )
      } else if(this.deploymentId) {
        this.fetchData = fetchFlowModelByDeployment(this.deploymentId).then(
          ({applyScopeName, flowModel, formContentObject: formModel}) => {
            this.flowForm = formModel
            this.rootNode = toModel(flowModel, {
              flowFields: this.flowFields,
              conditionFields: this.conditionFields,
            })
            this.rootNode && this.rootNode.read(applyScopeName)
          }
        )
      }
    },
    scrollIntoCenter(){
      this.$nextTick(() => {
        const sponsorNodeDom = this.$el.querySelector('.sponsor-node .node-title')
        if(sponsorNodeDom && sponsorNodeDom.scrollIntoView){
          sponsorNodeDom.scrollIntoView({ inline: 'center' })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~ibuild-portal-lte/src/assets/style/components/_var.scss';

.flow-graph {
  overflow: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;

  &-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: $--header-nav-height;
    padding-bottom: 30px;
  }

  &__error {
    margin-top: 60px;
    color: $--color-red;
    font-size: $--font-size-title;
    text-align: center;
  }
}
</stylescss>
