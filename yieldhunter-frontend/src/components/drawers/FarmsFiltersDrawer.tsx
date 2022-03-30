import makeStyles from '@material-ui/core/styles/makeStyles'
import Slider from 'components/sliders/Slider'
import useFiltersDrawer from 'hooks/useFiltersDrawer'
import { FILTER_STEPS, RENDER_VALUE, TITLES_SECONDARY } from 'utils/filters'
import { device } from 'utils/screen'

import DrawerContent from './DrawerContent'
import {
  FiltersDrawer,
  FiltersDrawerActions,
  FiltersDrawerActionsProps,
  FiltersDrawerHead,
  FiltersDrawerHeadProps,
  FiltersDrawerProps,
  FiltersDrawerSection,
  FiltersDrawerTitle
} from './FiltersDrawer'

const useStyles = makeStyles({
  paper: {
    [`@media ${device.mobileL}`]: {
      maxHeight: '75vh',
      height: 325
    }
  }
})

interface ContentProps {
  filters: Record<string, any>
}

function Content({
  onClose,
  onReset,
  onApply,
  filters
}: FiltersDrawerHeadProps & FiltersDrawerActionsProps & ContentProps) {
  const { innerFilters, onChange } = useFiltersDrawer<typeof filters>({
    filters,
    onApply
  })

  const handleReset = () => {
    onReset()
    onClose()
  }

  return (
    <>
      <FiltersDrawerHead onClose={onClose} />

      <DrawerContent>
        <FiltersDrawerSection>
          <Slider
            min={0}
            max={11}
            step={1}
            defaultValue={FILTER_STEPS.findIndex(
              (e) => e === innerFilters.tvlMin
            )}
            valueFormat={(value) => FILTER_STEPS[value]}
            renderValueFormat={RENDER_VALUE['tvlMin']}
            labelComponent={
              <FiltersDrawerTitle>{TITLES_SECONDARY.tvlMin}</FiltersDrawerTitle>
            }
            onChange={(e) => onChange('tvlMin', e)}
          />
        </FiltersDrawerSection>
      </DrawerContent>

      <FiltersDrawerActions onReset={handleReset} />
    </>
  )
}

export default function FarmsFiltersDrawer({
  open,
  ...props
}: FiltersDrawerProps &
  FiltersDrawerActionsProps &
  FiltersDrawerHeadProps &
  ContentProps) {
  const classes = useStyles()
  return (
    <FiltersDrawer
      open={open}
      onClose={props.onClose}
      className={classes.paper}
    >
      <Content {...props} />
    </FiltersDrawer>
  )
}
