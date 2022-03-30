import { ReactNode } from 'react'

export interface TableCol {
  title: string | ReactNode
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  minWidth?: number
}
