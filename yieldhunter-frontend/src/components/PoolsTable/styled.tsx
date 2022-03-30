import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'

export const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    margin: 0 -10px;

    & li {
      font-weight: bold;
      font-size: 1rem;
      line-height: 38px;
      text-align: center;
      color: #ffffff;
      height: 40px;
      width: fit-content;
      cursor: pointer;
      padding: 0 50px;
      background: linear-gradient(110.29deg, #454d7c -3.21%, #363d64 105.5%);
      box-shadow: 0px 4px 15px rgba(20, 6, 75, 0.1);
      border-radius: 15px;
      margin: 10px;

      .MuiNativeSelect-select.MuiNativeSelect-select {
        color: white;
        background: inherit;
      }

      &.used-filter {
        font-size: 0.875rem;
        line-height: 38px;
        color: #fafafa;
        background: linear-gradient(110.29deg, #33b6ff -3.21%, #1a6b9f 105.5%);
        box-shadow: 0px 4px 12px rgba(0, 35, 57, 0.25);
      }

      @media (max-width: 1024px) {
        width: 100%;

        .MuiNativeSelect-select.MuiNativeSelect-select {
          width: 100%;
        }

        & input {
          flex: 1;
        }
      }
    }
  }
  & {
    font-weight: bold;
    font-size: 1rem;
    line-height: 38px;
    text-align: center;
    color: #ffffff;
  }
`

export const PoolsLitItemsContainer = styled(Grid)`
  overflow-x: auto;
  width: auto;
  margin: 0 -40px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    margin: 0 -20px;
  }
`

export const PoolsListItems = styled(Grid)<any>`
  width: 100%;
  min-width: ${(props) => (props.$lg ? '1150px' : '750px')};
  display: flex;
  flex-direction: column;
  padding: 0 40px;

  @media (max-width: 1024px) {
    padding: 0 20px;
  }
`

export const PoolsListItemsLg = styled(Grid)`
  width: 100%;
  min-width: 950px;
  display: flex;
  flex-direction: column;
  padding: 0 40px;
`

export const StyledPoolsList = styled.div`
  display: flex;
  flex-direction: column;
  height: max-content;
  gap: 8px;
  position: relative;

  .pagination-wrapper {
    position: absolute;
    right: 0;
    top: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    img {
      cursor: pointer;
    }

    span {
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
      line-height: 1.1875rem;
      color: #fafafa;

      @media (max-width: 1024px) {
        font-size: 0.95rem;
      }
    }
  }

  & .Assets {
    grid-template-columns: 1fr 1fr 1fr 0.8fr 0.4fr 0.36fr 2fr 52px;
  }
  & .Farms {
    grid-template-columns: 1fr 0.8fr 1.2fr 0.8fr 52px;
  }
  & .New {
    grid-template-columns: 1fr 1fr 1fr 0.56fr 52px;
  }

  .pools-list {
    display: flex;
    flex-direction: column;
    //gap: 20px;
    width: 100%;
  }

  .pool-enter {
    opacity: 0;
  }
  .pool-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in;
  }
  .pool-exit {
    opacity: 1;
  }
  .pool-exit-active {
    opacity: 0;
    transition: opacity 200ms ease-in;
  }

  @media (max-width: 1024px) {
    .pagination-wrapper {
      position: relative;
      margin-bottom: 22px;
    }
  }
`

export const ListRoot = styled.div`
  display: grid;
  padding-left: 10px;
  width: 98%;
  font-size: 20px;
  letter-spacing: 0.12em;
  font-weight: 600;
  font-style: normal;
`

export const StyledAccordion = styled(Accordion)<any>`
  width: 100%;
  position: relative;
  z-index: 2;
  margin-top: ${(props) => (props.$isRoot ? '4rem !important' : '0')};
  border-radius: 8px !important;
  background: inherit !important;

  margin-bottom: 20px !important;
  &:last-child {
    margin-bottom: 0;
  }

  & .MuiAccordionSummary-root {
    min-height: 60px;
    vertical-align: middle;
    background: linear-gradient(111.6deg, #39406a -2.51%, #343a60 104.46%);
    border-radius: 15px;

    @media (max-width: 1024px) {
      min-height: 40px;
    }
  }
  //.MuiCollapse-root {
  //  background: linear-gradient(111.6deg, #303659 -2.51%, #292e4d 104.46%);
  //}
  .MuiCollapse-entered {
    border-radius: 15px;
    margin-top: 20px;
  }
  &.MuiPaper-elevation1 {
    box-shadow: none;
  }
  & .MuiAccordionSummary-content {
    margin: 0;
    padding: 0 1.5rem;
    &.Mui-expanded {
      margin: 0;
    }

    @media (max-width: 1024px) {
      padding: 0;
    }
  }
  &.MuiAccordion-root.Mui-expanded {
    display: flex;
    flex-direction: column;
    margin: 0;
  }
`

export const StyledAccordionSummary = styled(AccordionSummary)`
  font-style: normal;
  font-weight: normal;
  font-size: 0.875rem;
  line-height: 1.275rem;
  display: flex;
  align-items: center;
  color: #fafafa;
  & #Assets {
    flex-direction: row;
    justify-content: space-between;
    display: flex;
    flex-grow: 1;
    display: flex;
    flex-grow: 1;
    & > * {
      width: -moz-available;
      width: -webkit-fill-available;
      height: 20px;
      margin-right: 1rem;
      word-break: break-all;
    }
    & .activities {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding-left: 1.25rem;
      margin-right: 0;
      width: min-content;

      img {
        height: 20px;
        width: 20px;
      }
    }
  }
  & #Farms {
    flex-direction: row;
    justify-content: space-between;
    display: flex;
    flex-grow: 1;
    display: flex;
    flex-grow: 1;

    & > * {
      width: -moz-available;
      width: -webkit-fill-available;
      height: 20px;
      padding: 0 5px;
    }
  }
  & #New {
    grid-template-columns: 1fr 1fr 1fr 0.59fr;
  }

  &.MuiAccordionSummary-root.Mui-expanded {
    min-height: 60px;
  }

  @media (max-width: 1024px) {
    &.MuiAccordionSummary-root.Mui-expanded {
      min-height: 40px;
    }
  }
`

export const RootSpan = styled.span<any>`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: baseline;
  width: inherit;
  min-width: ${(props) => (props.width ? props.width + 'px' : '')};
  white-space: nowrap;

  & span.label-span {
    position: absolute;
    bottom: 3.3rem;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.1875rem;
    white-space: nowrap;
  }

  @media (max-width: 1024px) {
    & span.label-span {
      font-size: 0.95rem;
    }
    font-size: 0.95rem;
  }
`

export const RowSpan = styled.span<any>`
  //white-space: nowrap;
  min-width: ${(props) => (props.width ? props.width + 'px' : '')};
`

export const StyledAccordionSummaryWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.6fr;
  color: ${({ theme }) => theme.text1};

  @media (max-width: 1024px) {
    & span {
      font-size: 0.95rem;
    }
  }
`

export const StyledAccordionDetails = styled(AccordionDetails)`
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex-direction: column;
  background: linear-gradient(111.6deg, #303659 -2.51%, #292e4d 104.46%);
  border-radius: 15px;
  padding: 1.25rem !important;

  & .Assets {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3rem;
    align-items: baseline;
  }
  & .FarmsInfo {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3rem;
    align-items: baseline;
    justify-content: space-evenly;
  }
  & p {
    padding: 0.4rem 0.9rem;
    border: 1px solid #1414144a;
    margin: 0;
    cursor: pointer;
    box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6);
    color: ${({ theme }) => theme.text5};
    background-color: ${({ theme }) => theme.text1};
  }
`

export const SummaryProvider = styled.span<any>`
  display: flex;
  height: 100%;
  gap: 0.9375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.275rem;
  text-overflow: unset;
  overflow: hidden;
  word-break: break-all;
  min-width: ${(props) => (props.width ? props.width + 'px' : '')};
  & img {
    width: 1.375rem;
    height: 1.375rem;
  }
`

export const SummaryRewards = styled.span`
  font-size: 1rem;
  background: #8080804a;
  font-weight: bolder;
  padding: 5px;
  border-radius: 7px;
  margin: 6px 0 -0.2rem 0;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: flex-start;
  gap: 0.8rem;
  & h3 {
    font-weight: 600;
    font-size: 1.2rem;
    margin: 1rem 0 0 0;
    padding: 5px 0;
    margin-bottom: 0.25rem;
    display: flex;
    gap: 0.7rem;
    color: ${({ theme }) => theme.text3};
  }
`

export const InfoRow = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-family: Abel;
  & span {
    font-size: 1.2rem;
    margin-right: 1rem;
    font-weight: 600;
  }
`

export const StyledButton = styled.a<any>`
  width: max-content;
  height: 40px;
  font-size: 18px;
  font-weight: 500;
  align-self: center;
  padding: 0 1rem;
  letter-spacing: 0.2em;
  line-height: 40px;
  color: #fff;
  background: linear-gradient(110.29deg, #33b6ff -3.21%, #1a6b9f 105.5%);
  box-shadow: 0px 4px 12px rgba(0, 35, 57, 0.25);
  border-radius: 15px;
  text-align: center;
  text-decoration: none;
  margin-right: 1rem;

  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  @media (max-width: 1024px) {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
  }
`

const DetailsIcon = styled.div`
  text-align: center;
  cursor: pointer;
  border: 0.2rem solid ${({ theme }) => theme.text1};
  color: ${({ theme }) => theme.text1};
  border-radius: 50%;
`

export const ShowTips = styled(DetailsIcon)`
  height: 1.4rem;
  line-height: 1.1rem;
  width: 1.4rem;
  font-size: 1rem;
  font-family: unset;
  width: 1.3rem;
  font-weight: 600;
  margin: auto;
  border: 0.14rem solid ${({ theme }) => theme.text3};
`

export const SortArrow = styled.img<any>`
  display: ${(props) => (props.sortValue === props.value ? 'initial' : 'none')};
  transform: rotate(${(props) => (props.sortOrder ? 90 : -90)}deg);
  margin: 0 0.4rem -0.125rem;

  @media (max-width: 1024px) {
    width: 12px;
  }
`
