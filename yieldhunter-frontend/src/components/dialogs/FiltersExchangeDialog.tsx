import useMultiSelectValues from 'hooks/useMultiSelectValues'
import { useSearch } from 'hooks/useSearch'
import { searchHighlight } from 'utils/strings'

import Spacing from '../common/Spacing'
import Dialog from './Dialog'
import DialogBody from './DialogBody'
import DialogHead from './DialogHead'
import DialogList from './DialogList'
import DialogListItem from './DialogListItem'
import DialogSearch from './DialogSearch'

interface ContentProps {
  exchanges: any[]
  onChange: (value: string) => void
  onClose: () => void
}

function Content({ exchanges, onChange, onClose }: ContentProps) {
  const { exchangesTypes } = useMultiSelectValues()
  const { search, onSearch } = useSearch()

  const searchedExchanges = exchangesTypes.filter((exchange) =>
    exchange.match(new RegExp(search, 'gi'))
  )

  return (
    <>
      <DialogHead title="Apply Exchange" onClose={onClose} />

      <DialogSearch onSearch={onSearch} />

      <DialogBody>
        <DialogList>
          {searchedExchanges.map((exchange) => (
            <DialogListItem
              name={searchHighlight(exchange, search)}
              key={exchange}
              active={exchanges.includes(exchange)}
              onClick={() => onChange(exchange)}
            />
          ))}
        </DialogList>
      </DialogBody>

      <Spacing />
    </>
  )
}

interface FiltersExchangeDialogProps {
  open: boolean
}

export default function FiltersExchangeDialog({
  open,
  ...props
}: FiltersExchangeDialogProps & ContentProps) {
  return (
    <Dialog open={open} height={600}>
      <Content {...props} />
    </Dialog>
  )
}
