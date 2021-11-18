export const MetaQuery = `query pageMeta($language: String!, $pageid: String!) {
  pageMetas(where: {AND: [{language: $language}, {pageid: $pageid}]}) {
    meta,
    title,
    links,
    __typename
  }
}`;
