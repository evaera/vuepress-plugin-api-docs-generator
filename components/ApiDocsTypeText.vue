<script>
import * as balanced from "node-balanced";
import ApiDocsLink from "./ApiDocsLink";
import ApiDocsType from "./ApiDocsType";
import { slugify, joinElements as join, isInterface } from "../util";

import stringifyJoiner from "./stringifiers/joiner";
import stringifyType from "./stringifiers/type";
import stringifyFunction from "./stringifiers/function";
import stringifyInterface from "./stringifiers/interface";
import Vue from "vue";

const stringifiers = {
  intersection: stringifyJoiner,
  union: stringifyJoiner,
  property: stringifyType,
  type: stringifyType,
  function: stringifyFunction,
  interface: stringifyInterface,
  enum: stringifyInterface,
  literal: stringifyInterface,
  text: Vue.extend({
    props: ["item", "component"],

    render() {
      return <span>{this.component.getTextNode(this.item.type)}</span>;
    }
  })
};

const getMatches = text =>
  balanced.matches({
    source: text,
    open: "<",
    close: ">"
  });

const matchText = text => {
  if (!text || text.length === 0) {
    return "";
  }

  const matches = getMatches(text);

  if (matches.length === 0) {
    return text;
  }

  const match = matches[0];

  const body = text.substr(match.index + 1, match.length - 2);

  return {
    head: text.substr(0, match.index),
    body: body
      .split(/,(?=[^>]*(?:<|$))/)
      .map(s => s.trim())
      .map(matchText)
  };
};

const firstSentence = text => {
  if (!text) return;
  const match = text.match(/^(.+?\.)/);
  if (match) return match[1];
  return text;
};

export default {
  name: "ApiDocsTypeText",

  props: {
    item: Object,
    prefix: String,
    kindPrefix: String,
    postfix: String,
    tag: {
      default: "code"
    },
    attrs: Object,
    retainTypeModifiers: Boolean,
    nested: Boolean
  },

  computed: {
    attributes() {
      if (typeof this.attrs === "function") {
        return this.attrs(this.item);
      }

      return this.attrs;
    }
  },

  methods: {
    getTypeInfo(type) {
      type = type.replace(/[^a-zA-Z0-9_-]/g, "");
      if (API_DOCS.types && API_DOCS.types[type]) {
        return API_DOCS.types[type];
      }

      for (const page of this.$site.pages) {
        if (page.frontmatter.docs) {
          if (page.frontmatter.docs.name === type) {
            return {
              link: page.regularPath,
              summary: firstSentence(page.frontmatter.docs.desc_md)
            };
          } else if (page.frontmatter.docs.types) {
            for (const t of page.frontmatter.docs.types) {
              if (t.name === type) {
                return {
                  link: page.regularPath,
                  summary: t.desc_md ? firstSentence(t.desc_md) : ""
                };
              }
            }
          }
        }
      }
    },
    getNode(t, className) {
      if (typeof t === "string") {
        if (t.length === 0) return;

        // const strip =
        //   this.retainTypeModifiers !== undefined
        //     ? !this.retainTypeModifiers
        //     : !this.nested;
        // t = strip && t.endsWith("?") ? t.slice(0, -1) : t;

        const info = this.getTypeInfo(t);

        const node =
          info && info.summary ? (
            <abbr title={info.summary} className={className}>
              {t}
            </abbr>
          ) : (
            <span class={className}>{t}</span>
          );

        if (info && info.link) {
          const anchor = "#" + slugify(t);

          return (
            <ApiDocsLink
              style={{
                textDecoration: "underline"
              }}
              to={
                info.link === this.$page.regularPath
                  ? anchor
                  : info.link + anchor
              }
            >
              {node}
            </ApiDocsLink>
          );
        } else {
          return node;
        }
      } else {
        return (
          <span>
            {this.getNode(t.head, className)}&lt;
            {t.body
              .map(b =>
                typeof b === "object"
                  ? this.getNode(b, className)
                  : this.getTextNode(b)
              )
              .reduce(join(", "), null)}
            &gt;
          </span>
        );
      }
    },
    getTextNode(text) {
      if (!text) return "";
      return text
        .split(/\|(?=[^>]*(?:<|$))/)
        .map(u => u.trim())
        .filter(u => u.length > 0)
        .map(u => u.split(/&(?=[^>]*(?:<|$))/))
        .map(i => i.filter(u => u.trim().length > 0))
        .filter(i => i.length > 0)
        .map(i =>
          i.map(u => this.getNode(matchText(u.trim()), "api-docs-accent-type"))
        )
        .map(u => u.reduce(join(<span> &amp; </span>), null))
        .reduce(join(" | "), null);
    }
  },

  render(h) {
    const component = stringifiers[this.item.kind];

    if (!component) {
      return `TYPE ${this.item.kind} IS INVALID`;
    }

    return (
      <span>
        {this.kindPrefix && (
          <code class="api-docs-kind">{this.kindPrefix} </code>
        )}
        <code>{this.prefix}</code>
        <this.tag {...this.attributes}>
          {<component item={this.item} component={this} />}
        </this.tag>
        <code>{this.postfix}</code>
      </span>
    );
  }
};
</script>

<style lang="stylus" scoped>
code
  background-color transparent
  padding 0
  font-size inherit
  color inherit

pre
  background-color transparent
  margin 0
  padding 0



.muted
  color #ccc
</style>

<style lang="stylus">

$apiDocsAccentFunction ?= #10ac84
$apiDocsAccentType ?= #0abde3
code.api-docs-accent-fn, .api-docs-accent-fn
  color $apiDocsAccentFunction

code.api-docs-kind
  color $accentColor

.api-docs-accent-type
  color $apiDocsAccentType

a .api-docs-accent-type
  color inherit
</style>
