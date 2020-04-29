<template>
  <div>
    <h1 :id="slug">
      {{ item.name }}
      <ApiDocsTags :tags="item.tags" />
      <div v-if="item.extends" class="extends-text">
        ↪ Extends <ApiLink :to="item.extends" />
      </div>
    </h1>

    <ApiDocsDesc :text="item.desc" />

    <div v-if="item.types">
      <h2 id="types">Types</h2>
      <div v-for="type in item.types" :key="type.name">
        <ApiDocsType kind="type" :type="type" :source="item.name" />
      </div>
    </div>

    <div v-if="item.properties">
      <h2 id="properties">Properties</h2>
      <ApiDocsType
        v-for="prop in item.properties"
        :key="prop.name"
        kind="property"
        :type="prop"
        :kindProps="{
          prefix: item.name,
        }"
        :source="item.name"
      />
    </div>

    <div v-if="staticMethods">
      <h2 id="static-functions">Static Functions</h2>
      <ApiDocsType
        v-for="method in staticMethods"
        :key="method.name"
        kind="function"
        :type="method"
        :kindProps="{
          prefix: item.name,
          full: true,
        }"
        :source="item.name"
      />
    </div>
    <div v-if="methods">
      <h2 id="instance-methods">Instance Methods</h2>
      <ApiDocsType
        v-for="method in methods"
        :key="method.name"
        kind="function"
        :type="method"
        :kindProps="{
          prefix: item.name,
          full: true,
        }"
        :source="item.name"
      />
    </div>

    <!-- <Markdown path="methods.md" :props="{text: 'function () do end'}" /> -->
  </div>
</template>

<script>
import ApiDocsType from "../components/ApiDocsType";
import ApiDocsTags from "../components/ApiDocsTags";
import ApiDocsDesc from "../components/ApiDocsDesc";
import ApiKindMethod from "../components/kinds/ApiKindMethod";
import ApiKindProperty from "../components/kinds/ApiKindProperty";
import ApiKindType from "../components/kinds/ApiKindType";
import { slugify } from "../util";

const mergeArray = (ar1, ar2) =>
  [].concat(
    (ar1 || []).filter((i) => !ar2.find((v) => v.name === i.name)),
    ar2 || []
  );
const mergeObj = (o1, o2) => ({ ...o1, ...o2 });
const mergers = {
  defaults: mergeObj,
  types: mergeArray,
  properties: mergeArray,
  functions: mergeArray,
};
const merge = (o1 = {}, o2) => {
  const out = { ...o2 };
  for (const [key, value] of Object.entries(o1)) {
    if (mergers[key]) {
      out[key] = mergers[key](value, o2[key]);
    } else {
      out[key] = o2[key] !== undefined ? o2[key] : o1[key];
    }
  }

  return out;
};

export default {
  provide() {
    return {
      apiDocsDefaults: {
        ...(API_DOCS.defaults || {}),
        ...(this.item.defaults || {}),
      },
      apiDocsKind: "root",
    };
  },
  methods: {
    getDoc(docs) {
      if (docs.extends) {
        const parentPage = this.$site.pages.find(
          (p) => p.frontmatter.docs && p.frontmatter.docs.name === docs.extends
        );

        if (parentPage) {
          docs = merge(this.getDoc(parentPage.frontmatter.docs), docs);
        }
      }

      return docs;
    },
  },
  computed: {
    item() {
      return this.getDoc(this.$page.frontmatter.docs);
    },
    slug() {
      return slugify(this.item.name);
    },
    staticMethods() {
      if (!this.item.functions) return;

      const functions = this.item.functions.filter((f) => f.static);

      return functions.length > 0 && functions;
    },
    methods() {
      if (!this.item.functions) return;

      const functions = this.item.functions.filter((f) => !f.static);

      return functions.length > 0 && functions;
    },
  },
  components: {
    ApiDocsType,
    ApiKindMethod,
    ApiDocsDesc,
    ApiKindProperty,
    ApiKindType,
    ApiDocsTags,
  },
  mounted() {
    this.$nextTick(() => {
      if (window.location.hash != null && window.location.hash.length > 0) {
        const el = document.querySelector(window.location.hash);

        if (el) {
          window.scroll(0, el.offsetTop - 50);
        }
      }
    });
  },
};
</script>

<style lang="stylus">
@require '../styles/main.styl'
</style>

<style lang="stylus" scoped>
.extends-text
  font-size 16px
  margin-top 8px
</style>
