'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<any>[number]>()
  const label = data.data?.menuItem?.label;
  return label ? <div>{label}</div> : <div>Row</div>
}
