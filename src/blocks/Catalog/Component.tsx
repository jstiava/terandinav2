'use server'

import ProductCard from '@/app/(session)/(frontend)/products/ProductCard';
import { CatalogBlock as CatalogBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import {
    getPayload,
    RequiredDataFromCollection,
    Where,
} from 'payload'
import React, { cache } from 'react'
import { draftMode } from 'next/headers'
import { cn } from '@/utilities/cn';

export default async function CatalogBlock({ limit, filters, className, classNamePerProduct, ...rest }: CatalogBlockProps) {


    const products = await getFilteredProducts({
        limit: limit ?? 0,
        filters
    });

    return (
        <div className={cn(
            "flex w-full gap-0 flex-wrap p-2",
            className
        )}>
            {products.map(product => {
                return (
                    <ProductCard
                        key={product.id}
                        {...{
                            product,
                            className: classNamePerProduct ?? ""
                        }}
                    />
                )
            })}
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

const getFilteredProducts = cache(async (props: {
    limit: number,
    filters: CatalogBlockProps['filters']
}) => {
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
})
