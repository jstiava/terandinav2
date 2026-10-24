'use client'
import { formatPrice } from '@/collections/Products/formatPrice';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const SizeRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<any>[number]>()
  const { label, customLabel, count } = data.data;
  return label ? label == 'custom' ? <div>{customLabel}: {count}</div>  : <div>{label}: {count}</div> : <div>Empty size</div>
}


export const PriceRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<any>[number]>()
  const { active, amount, saleAmount, currency } = data.data;

  return amount ? <div>{formatPrice(amount * 100, currency)} <span style={{
    textTransform: 'uppercase'
  }}>{currency}</span> {!active && '(inactive)'}</div>  : <div>Unset price or currency</div>
}
