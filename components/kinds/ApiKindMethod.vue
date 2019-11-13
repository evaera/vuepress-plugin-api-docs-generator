<template>
  <div class="api-item">
    <ApiDocsSince v-if="item.since" :since="item.since" />
    <ApiDocsInherited v-if="item.source !== source" :from="item.source" />
    <h3 v-if="item.name" :id="slug">
      <a :href="'#' + slug" class="header-anchor">#</a>
      <code>{{ item.name }}</code>
      <ApiDocsTags :tags="item.tags" />
    </h3>

    <p
      v-for="(overload, index) in item.overloads"
      :key="index"
      @click="setOverload(overload, index)"
      :class="item.overloads.length > 1 && 'overload-hover'"
    >
      <span v-if="item.overloads.length > 1" class="muted"
        >{{ index + 1 }}.</span
      >
      <ApiDocsType
        :forceText="true"
        :type="overload"
        :prefix="prefix ? prefix + methodCallOperator : ''"
        :nested="full"
      />
    </p>

    <ApiDocsDesc :text="item.desc" />

    <div :is="full ? 'div' : 'details'">
      <summary v-if="!full">Details</summary>
      <p class="overload-status" v-if="item.overloads.length > 1">
        📚 Showing overload {{ overloadIndex + 1 }} of
        {{ item.overloads.length }}
      </p>
      <div v-if="overload.params && overload.params.length > 0">
        <h4>Parameters</h4>
        <table>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th></th>
          </tr>
          <tr v-for="param in overload.params" :key="param.name">
            <td>
              <code>{{ param.name }}</code>
            </td>
            <td>
              <ApiDocsType
                :type="param.type"
                :kindProps="{
                  disableKindPrefix: true
                }"
              />
            </td>
            <td>
              {{
                param.optional ||
                (typeof param.type === "string" && param.type.endsWith("?"))
                  ? "✘"
                  : "✔"
              }}
            </td>
            <td><ApiDocsDesc :text="param.desc" /></td>
          </tr>
        </table>
      </div>

      <h4 style="margin-bottom: 0">Returns</h4>
      <table>
        <tr>
          <th>Type</th>
          <th></th>
        </tr>
        <tr v-for="(returnValue, index) in overload.returns" :key="index">
          <td>
            <ApiDocsType
              :type="returnValue.type"
              :kindProps="{
                retainTypeModifiers: true,
                disableKindPrefix: true
              }"
            />
          </td>
          <td><ApiDocsDesc :text="returnValue.desc" /></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import apiMixin from "../../apiMixin";

export default {
  mixins: [apiMixin],
  props: ["item", "full", "prefix", "source"],
  data() {
    return {
      kind: "function",
      overload: this.item.overloads[0],
      overloadIndex: 0
    };
  },
  methods: {
    setOverload(overload, index) {
      this.overload = overload;
      this.overloadIndex = index;
    }
  },
  computed: {
    methodCallOperator() {
      return (
        (this.static && API_DOCS.staticMethodCallOperator) ||
        API_DOCS.methodCallOperator ||
        "."
      );
    },
    static() {
      return (
        !!this.item.static ||
        (this.item.tags && this.item.tags.includes("static"))
      );
    }
  },
  components: {
    ApiDocsType: () => import("../ApiDocsType"),
    ApiDocsDesc: () => import("../ApiDocsDesc"),
    ApiDocsTags: () => import("../ApiDocsTags"),
    ApiDocsType: () => import("../ApiDocsType"),
    ApiDocsSince: () => import("../ApiDocsSince"),
    ApiDocsInherited: () => import("../ApiDocsInherited")
  }
};
</script>

<style lang="stylus" scoped>
code
  background-color transparent

.muted
  color #ccc

.overload-status
  color #999
  font-size 12px
  font-weight bold
  margin-bottom -10px

.overload-hover
  cursor pointer

  &:hover
    text-decoration underline
</style>
