import Spacing from 'components/common/Spacing'
import useMultiSelectValues from 'hooks/useMultiSelectValues'
import { useSearch } from 'hooks/useSearch'
import { searchHighlight } from 'utils/strings'

import Dialog from './Dialog'
import DialogBody from './DialogBody'
import DialogHead from './DialogHead'
import DialogList from './DialogList'
import DialogListItem from './DialogListItem'
import DialogSearch from './DialogSearch'

interface ContentProps {
  farms: any[]
  onChange: (farm: string) => void
  onClose: () => void
}

function Content({ farms, onChange, onClose }: ContentProps) {
  const { farmsOptions } = useMultiSelectValues()
  const { search, onSearch } = useSearch()

  const searchedFarms = farmsOptions.filter(
    (farm) => !!farm.name?.match(new RegExp(search, 'gi'))
  )

  return (
    <>
      <DialogHead title="Apply Farms" onClose={onClose} />

      <DialogSearch onSearch={onSearch} />

      <DialogBody>
        <DialogList>
          {searchedFarms.map((farm) => (
            <DialogListItem
              name={searchHighlight(farm.name, search)}
              key={farm.farmId}
              active={!!farms.find((f) => f.farmId === farm.farmId)}
              onClick={() => onChange(farm)}
            />
          ))}
        </DialogList>
      </DialogBody>

      <Spacing />
    </>
  )
}

interface FiltersFarmsDialogProps {
  open: boolean
}

export default function FiltersFarmsDialog({
  open,
  ...props
}: FiltersFarmsDialogProps & ContentProps) {
  return (
    <Dialog open={open} height={600}>
      <Content {...props} />
    </Dialog>
  )
}
