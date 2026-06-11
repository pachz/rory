export const GET_INTRO = `
  query getIntro($link: String!, $language: String) {
    entity(link: $link, language: $language) {
      id
      slug
      name
      username
      branch
      slogan
      logo
      description
      currency
      coverPhoto
      coverVideo
      primaryColor
      secondaryColor
      defaultLanguage
      phoneNumber
      address
      location
      workingHours {
        id
        startTime
        endTime
        weekday
      }
      type {
        label
        slug
      }
      socialLinks {
        id
        name
        address
        logo
      }
      amenities {
        name
      }
    }
  }
`;

export const GET_ENTITY_ITEMS = `
  query getEntityItems($id: UUID!, $language: String, $flavour: QueryFlavour = VILLAGE) {
    entity(id: $id, language: $language, flavour: $flavour) {
      menus {
        id
        label
        slug
        description
        isActive
        categories {
          id
          label
          thumbnail
          status
          items {
            id
            name
            slug
            thumbnail
            description
            itemMedias {
              mediaType
              url
            }
            shopItem {
              id
              isSoldOut
              shopItemPrice {
                originalPrice
                price
                discountType
                discountValue
              }
              productOptions {
                id
                label
                minimumSelectableChoices
                maximumSelectableChoices
                isActive
                productOptionChoices {
                  id
                  choice {
                    id
                    isSoldOut
                    shopItemPrice {
                      price
                    }
                    item {
                      id
                      name
                    }
                  }
                }
              }
            }
            itemCategories {
              category {
                id
                status
              }
              isBold
              isHidden
            }
          }
        }
      }
    }
  }
`;

export const GET_ENTITY_AMENITIES = `
  query GetEntityAmenities($username: String!) {
    entity(username: $username) {
      id
      amenities {
        id
        icon
        name
        parent {
          id
          name
          icon
        }
        group {
          id
          name
        }
      }
    }
  }
`;
