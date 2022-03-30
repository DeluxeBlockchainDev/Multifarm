import Chip from 'components/chips/Chip'
import FiltersExchangeDialog from 'components/dialogs/FiltersExchangeDialog'
import FiltersFarmsDialog from 'components/dialogs/FiltersFarmsDialog'
import Slider from 'components/sliders/Slider'
import useFiltersDrawer from 'hooks/useFiltersDrawer'
import useGroups from 'hooks/useGroups'
import useMultiSelectValues from 'hooks/useMultiSelectValues'
import { useState } from 'react'
import { BOOL_FILTERS, FILTER_STEPS, RENDER_VALUE } from 'utils/filters'
import { groupsToOptions } from 'utils/groups'

import DrawerContent from './DrawerContent'
import {
  FiltersDrawer,
  FiltersDrawerActions,
  FiltersDrawerActionsProps,
  FiltersDrawerHead,
  FiltersDrawerHeadProps,
  FiltersDrawerProps,
  FiltersDrawerSection,
  FiltersDrawerTitle,
  FiltersDrawerTitleAction
} from './FiltersDrawer'

interface AssetsFiltersDrawerContentProps {
  filters: Record<string, any>
}

function AssetsFiltersDrawerContent({
  onClose,
  onApply,
  onReset,
  filters
}: FiltersDrawerHeadProps &
  FiltersDrawerActionsProps &
  AssetsFiltersDrawerContentProps) {
  const [exchangeDialog, setExchangeDialog] = useState(false)
  const [farmsDialog, setFarmsDialog] = useState(false)
  const { groups } = useGroups()
  const { yieldTypes } = useMultiSelectValues()
  const groupsOptions = groupsToOptions(groups)

  const {
    innerFilters,
    onChange,
    onFarmsChange,
    onGroupChange,
    onGroupsChange,
    onArrayUpdate
  } = useFiltersDrawer<typeof filters>({
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
              <FiltersDrawerTitle>Liquidity higher than</FiltersDrawerTitle>
            }
            onChange={(e) => onChange('tvlMin', e)}
          />
        </FiltersDrawerSection>

        <FiltersDrawerSection>
          <Slider
            min={0}
            max={100}
            step={10}
            defaultValue={innerFilters.aprYearlyMin}
            renderValueFormat={RENDER_VALUE['aprYearlyMin']}
            labelComponent={
              <FiltersDrawerTitle>APR (y) higher than</FiltersDrawerTitle>
            }
            onChange={(e) => onChange('aprYearlyMin', e)}
          />
        </FiltersDrawerSection>

        <FiltersDrawerSection>
          <Slider
            min={0}
            max={100}
            step={10}
            defaultValue={innerFilters.tvlChangeMin}
            renderValueFormat={RENDER_VALUE['tvlChangeMin']}
            labelComponent={
              <FiltersDrawerTitle>
                TVL Change (24h) higher than
              </FiltersDrawerTitle>
            }
            onChange={(e) => onChange('tvlChangeMin', e)}
          />
        </FiltersDrawerSection>

        <FiltersDrawerSection>
          <Slider
            min={0}
            max={5}
            step={0.5}
            defaultValue={innerFilters.depositFee}
            renderValueFormat={RENDER_VALUE['depositFee']}
            labelComponent={
              <FiltersDrawerTitle>Deposit Fee lower than</FiltersDrawerTitle>
            }
            onChange={(e) => onChange('depositFee', e)}
          />
        </FiltersDrawerSection>

        <FiltersDrawerSection>
          <Slider
            min={0}
            max={5}
            step={0.5}
            defaultValue={innerFilters.withdrawalFee}
            renderValueFormat={(value) => value + '%'}
            labelComponent={
              <FiltersDrawerTitle>Withdrawal Fee lower than</FiltersDrawerTitle>
            }
            onChange={(e) => onChange('withdrawalFee', e)}
          />
        </FiltersDrawerSection>

        <FiltersDrawerSection title="Harvest Lockup" chips>
          {BOOL_FILTERS.map((chip) => (
            <Chip
              key={chip.value}
              active={innerFilters.harvestLockup === chip.value}
              onClick={() => onChange('harvestLockup', chip.value)}
            >
              {chip.label}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection title="Transfer Tax" chips>
          {BOOL_FILTERS.map((chip) => (
            <Chip
              key={chip.value}
              active={innerFilters.transferTax === chip.value}
              onClick={() => onChange('transferTax', chip.value)}
            >
              {chip.label}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection title="Yield Type" chips>
          {yieldTypes.map((type) => (
            <Chip
              key={type}
              onClick={() => onArrayUpdate('yield_types', type)}
              active={innerFilters.yield_types.includes(type)}
            >
              {type}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection
          title="Exchange"
          titleAction={
            <FiltersDrawerTitleAction onClick={() => setExchangeDialog(true)}>
              Select
            </FiltersDrawerTitleAction>
          }
          chips
        >
          {innerFilters.exchanges.map((exchange) => (
            <Chip
              key={exchange}
              active
              onRemove={() => onArrayUpdate('exchanges', exchange)}
            >
              {exchange}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection
          title="Farms"
          titleAction={
            <FiltersDrawerTitleAction onClick={() => setFarmsDialog(true)}>
              Select
            </FiltersDrawerTitleAction>
          }
          chips
        >
          {innerFilters.farms.map((farm) => (
            <Chip key={farm.farmId} active onRemove={() => onFarmsChange(farm)}>
              {farm.name}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection title="Coin Single Group" chips>
          {groupsOptions.map((group) => (
            <Chip
              key={group.value}
              onClick={() => onGroupChange(group)}
              active={innerFilters.group?.value === group.value}
            >
              {group.label}
            </Chip>
          ))}
        </FiltersDrawerSection>

        <FiltersDrawerSection
          title="Coin Pair Groups"
          subtitle="Note: Select only one group to make the same pair"
        >
          {groupsOptions.map((group) => (
            <Chip
              key={group.value}
              onClick={() => onGroupsChange(group)}
              active={
                !!innerFilters.groups.find((g) => g.value === group.value)
              }
            >
              {group.label}
            </Chip>
          ))}
        </FiltersDrawerSection>
      </DrawerContent>

      <FiltersDrawerActions onReset={handleReset} />

      <FiltersExchangeDialog
        open={exchangeDialog}
        onClose={() => setExchangeDialog(false)}
        exchanges={innerFilters.exchanges}
        onChange={(value) => onArrayUpdate('exchanges', value)}
      />
      <FiltersFarmsDialog
        open={farmsDialog}
        farms={innerFilters.farms}
        onChange={(farm) => onFarmsChange(farm)}
        onClose={() => setFarmsDialog(false)}
      />
    </>
  )
}

export default function AssetsFiltersDrawer({
  open,
  ...props
}: FiltersDrawerProps &
  FiltersDrawerActionsProps &
  FiltersDrawerHeadProps &
  AssetsFiltersDrawerContentProps) {
  return (
    <FiltersDrawer open={open} onClose={props.onClose}>
      <AssetsFiltersDrawerContent {...props} />
    </FiltersDrawer>
  )
}
