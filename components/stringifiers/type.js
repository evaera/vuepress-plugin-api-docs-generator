import ApiDocsType from '../ApiDocsType.vue'

export default function (h, item, component) {
  return (
    <ApiDocsType
      type={item.type}
      forceText
      nested
    />
  )
}
