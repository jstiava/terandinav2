'use client'

import { getCategoryById } from '@/server/getCategories'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export const FilterRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<any>();

  const [categoryNames, setCategoryNames] = useState<string[]>([])

  const {
    field,
    operator,
    value__categories,
    value__active,
    value__icons,
    value__sizes,
  } = row.data as any

  useEffect(() => {
    if (field !== 'categories' || !Array.isArray(value__categories)) {
      setCategoryNames([]);
      return
    }

    getCategoryById({
      ids: value__categories
    })
    .then(data => {
      console.log({
        message: "Test",
        data
      })
      setCategoryNames(data.map((category: any) => category.title))
    })
    .catch(err => {
      console.log(err)
    })

  }, [field, value__categories]);

  const value = field === 'categories'
    ? categoryNames
    : value__active ?? value__icons ?? value__sizes

  const formattedField = String(field).charAt(0).toUpperCase() + String(field).slice(1)

  return `${formattedField} ${operator} ${value}`
}