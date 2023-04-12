/**
 * Return the GraphQl query for verifying the request is what we expect inside of cy.intercept
 */
export const graphQlGetSubscriptionsQuery = '\n    query GetSubscriptions ($params: SubscriptionsInput) {\n      subscriptions (params: $params) {\n          items {\n            collection {\n              conceptId\n              title\n            }\n            collectionConceptId\n            conceptId\n            creationDate\n            name\n            nativeId\n            query\n            revisionDate\n            type\n          }\n        }\n      }'
