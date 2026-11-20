'use server'

import ProductCard from '@/app/(session)/(frontend)/products/ProductCard';
import { CatalogBlock as CatalogBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import {
    getPayload,
    Where,
} from 'payload'
import React, { cache } from 'react'
import { draftMode } from 'next/headers'
import { cn } from '@/utilities/cn';
import Mongo from '@/utilities/mongo';
import { ObjectId } from 'mongodb';

export default async function CatalogBlock(props: CatalogBlockProps) {


    const products = await getFilteredProducts({
        limit: props.limit ?? 0,
        filters: props.filters,
        isRandomized: props.isRandomized
    });


    return (
        <div {...{
            className: cn(
                "flex w-full gap-0 flex-wrap p-0",
                props.className,
            ),
            style: {
                ...((props.compiledStyles as any)?.inline ?? {})
            },
            'data-block-id': props.id
        }}>
            {products.map(product => {
                return (
                    <ProductCard
                        key={product.id}
                        {...{
                            product,
                            className: props.classNamePerProduct ?? "",
                            style: {
                                ...((props.compiledStylesPerProduct as any)?.inline ?? {})
                            }
                        }}
                    />
                )
            })}
            <style>
                {(props.compiledStyles as any)?.scoped && (
                    `${(props.compiledStyles as any).scoped}`
                )}
                {(props.compiledStylesPerProduct as any)?.scoped && (
                    `\n${(props.compiledStylesPerProduct as any).scoped}`
                )}
            </style>

        </div>
    );

}


const convertFilterRulesToPayload = (filters: CatalogBlockProps['filters']) => {

    const rules: Where[] = [];

    if (!filters) {
        return [];
    }

    for (const filter of filters) {

        if (!["categories", "active", "icons", "sizes", "prices"].some(x => x === filter.field)) {
            continue
        }

        // @ts-ignore
        const value = filter[`value__${filter.field}`];

        if (Array.isArray(value)) {
            console.log(filter)
            rules.push({
                [filter.field]: {
                    in: value.map(x => x.id)
                }
            })
            continue;
        };

        rules.push({
            [filter.field]: {
                [Array.isArray(value) ? 'in' : filter.operator == 'is' ? 'equals' : 'not_equals']: value
            }
        })
    }

    return rules;

}

const getFilteredProducts = async (props: {
    limit: number,
    filters: CatalogBlockProps['filters'],
    isRandomized: CatalogBlockProps['isRandomized']
}) => {

    if (props.isRandomized) {

        const mongo = await Mongo.getInstance();
        const db = mongo.clientPromise.db("terandinav2");

        const recommendedProductsId = await db
            .collection("products")
            .aggregate([
                {
                    $match: {
                        active: true
                    },
                },
                { $sample: { size: props.limit ?? 100 } },
            ])
            .toArray();

        // @ts-ignore
        const recommendedProducts = await getProductFromList({
            ids: recommendedProductsId.map(x => x._id)
        })

        return recommendedProducts;
    }

    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise });

    const rules = convertFilterRulesToPayload(props.filters);

    const result = await payload.find({
        collection: 'products',
        limit: props.limit,
        draft,
        depth: 2,
        pagination: false,
        overrideAccess: draft,
        where: {
            and: rules
        }
    })

    return result.docs;
};


const getProductFromList = async ({ ids }: { ids: string[] }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'products',
        draft: false,
        depth: 2,
        pagination: false,
        where: {
            id: {
                in: ids,
            },
        },
    })

    return result.docs;
};