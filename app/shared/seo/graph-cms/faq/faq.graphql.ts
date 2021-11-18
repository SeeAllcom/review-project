export const FaqCategoryQuery = `query faqCategory($where: FaqCategoryWhereInput, $orderBy: FaqCategoryOrderByInput) {
  faqCategories(where: $where, orderBy: $orderBy) {
    title
    id
    faqArticles (orderBy: order_ASC) {
      title
      description
      articleId
    }
    __typename
  }
}`;
