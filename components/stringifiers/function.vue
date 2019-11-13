<script>
import { joinElements as join } from "../../util";
import ApiDocsType from "../ApiDocsType.vue";
export default {
  props: ["item"],

  render() {
    const newLines = this.item.params.length > 1;
    const tag = newLines ? "div" : "span";
    return (
      <span>
        <span class="api-docs-accent-fn">{this.item.name || "function"}</span>(
        <tag
          style={
            newLines
              ? {
                  marginLeft: "15px"
                }
              : {
                  whiteSpace: "nowrap"
                }
          }
        >
          {this.item.params
            .map(p => (
              <span>
                {p.name +
                  (p.optional ||
                  (typeof p.type === "string" && p.type.endsWith("?"))
                    ? "?"
                    : "")}
                :{" "}
                <ApiDocsType
                  nested
                  type={p.type}
                  kindProps={{
                    tag: "span",
                    retainTypeModifiers: false,
                    attrs: item => ({
                      class:
                        typeof item.type === "string" && "api-docs-accent-type"
                    })
                  }}
                  forceText
                />
              </span>
            ))
            .reduce(
              join(
                newLines ? (
                  <span>
                    ,<br />
                  </span>
                ) : (
                  ", "
                )
              ),
              null
            )}
        </tag>
        ) →{" "}
        {this.item.returns
          .map(p => (
            <ApiDocsType
              forceText
              type={p.type}
              nested
              kindProps={{
                tag: "span"
              }}
            />
          ))
          .reduce(join(", "), null)}
      </span>
    );
  }
};
</script>
