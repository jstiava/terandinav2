import type { CollectionSlug } from 'payload'

// import { populate } from '../../../populateGraphQL/populate.js'
// import { createServerFeature } from '../../../utilities/createServerFeature.js'
// import { createNode } from '../../typeUtilities.js'
import { i18n } from './i18n.js'
import { RelationshipServerNode } from './nodes/RelationshipNode.js'
import { createNode, createServerFeature, populate } from '@payloadcms/richtext-lexical'

export type ExclusiveRelationshipFeatureProps =
  | {
      /**
       * The collections that should be disabled. Overrides the `enableRichTextRelationship` property in the collection config.
       * When this property is set, `enabledCollections` will not be available.
       **/
      disabledCollections?: CollectionSlug[]

      // Ensures that enabledCollections is not available when disabledCollections is set
      enabledCollections?: never
    }
  | {
      // Ensures that disabledCollections is not available when enabledCollections is set
      disabledCollections?: never

      /**
       * The collections that should be enabled. Overrides the `enableRichTextRelationship` property in the collection config
       * When this property is set, `disabledCollections` will not be available.
       **/
      enabledCollections?: CollectionSlug[]
    }

export type RelationshipFeatureProps = {
  /**
   * Sets a maximum population depth for this relationship, regardless of the remaining depth when the respective field is reached.
   * This behaves exactly like the maxDepth properties of relationship and upload fields.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
} & ExclusiveRelationshipFeatureProps

export const RelationshipFeature = createServerFeature<
  RelationshipFeatureProps,
  RelationshipFeatureProps,
  ExclusiveRelationshipFeatureProps
>({
  feature: ({ props }) => {
    // we don't need to pass maxDepth to the client, it's only used on the server
    const { maxDepth, ...clientFeatureProps } = props ?? {}
    return {
      ClientFeature: '@/features/relationship-feature/client#RelationshipFeatureClient',
      clientFeatureProps,
      i18n,
      nodes: [
        createNode({
          // graphQLPopulationPromises: [relationshipPopulationPromiseHOC(props)],
          hooks: {
            afterRead: [
              async ({
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                populateArg,
                populationPromises,
                req,
                showHiddenFields,
              }) => {
                  // @ts-expect-error
                if (!node?.value) {
                  return node
                }

                const users = await req.payload.find({
                  collection: 'users',
                  limit: 50,
                })

                // Add users list somewhere in the field’s response
                // @ts-expect-error
                node.users = users.docs
                return node
              },
            ],
          },
          node: RelationshipServerNode,
        }),
      ],
    }
  },
  key: 'variable',
})
