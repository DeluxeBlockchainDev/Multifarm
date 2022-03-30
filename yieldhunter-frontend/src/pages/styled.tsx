import styled from 'styled-components'

export const StyledPools = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .filters {
    margin: 1.25rem 0;
  }
  .hideElement {
    display: none;
  }
`

export const BlockChains = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
  width: 100%;
  gap: 20px;
  margin-bottom: 40px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #41486e;
  max-width: 100%;
  overflow-x: auto;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  span {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 1.25rem;
    line-height: 23px;
    cursor: pointer;
    padding: 5px 7px;
    text-align: center;
    position: relative;
  }

  span.active {
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: #33b6ff;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  @media (max-width: 1024px) {
    span {
      font-size: 1rem;
    }
  }
`

export const AdvancedSearchInputContainer = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;

    .search-wrapper {
      width: 100%;
      margin-bottom: 20px;
    }
  }
`

export const AdvancedSearch = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search-wrapper {
    width: 100%;

    .search-icon {
      width: 18px;
      height: 18px;
      margin: 0 21px;
    }

    flex: 1;
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid ${({ theme }) => theme.text4};
    background: linear-gradient(111.6deg, #303659 -2.51%, #292e4d 104.46%);
    border-radius: 15px;
    border: none;

    input {
      width: 95%;
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 1rem;
      line-height: 19px;
      background: none;
      border: none;
      color: ${({ theme }) => theme.text1};
    }

    @media (max-width: 1024px) {
      height: 32px;

      input {
        font-size: 0.95rem;
      }
    }
  }

  @media (max-width: 1024px) {
    flex-direction: column;

    .search-wrapper {
      flex: unset;
      margin-bottom: 20px;

      .search-icon {
        width: 15px;
        height: 15px;
        margin: 0 15px;
      }

      input {
        width: 100%;
      }
    }
  }
`

export const AdvancedSearchButton = styled.button`
  height: 40px;
  background: linear-gradient(110.29deg, #d733ff -3.21%, #66308b 105.5%);
  box-shadow: 0px 4px 15px rgba(53, 6, 75, 0.2);
  border-radius: 15px;
  font-family: 'Roboto', sans-serif;
  color: ${({ theme }) => theme.text1};
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 19px;
  padding: 11px 58px;
  margin-left: 21px;
  &:hover {
    background-color: rgba(250, 250, 250, 0.8);
  }

  @media (max-width: 1024px) {
    width: 100%;
    padding: 5px 24px;
    margin-left: 0;
  }
`

export const StyledPoolsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export const ScreenShots = styled.div`
  display: flex;
  flex-direction: row;
  height: 25vh;
  width: 69%;
  margin: 0rem 1rem 1rem 1rem;
  position: sticky;
  z-index: 100;
  top: 0.5rem;
  align-self: flex-start;
  gap: 1rem;
  & > div,
  img {
    height: 250px;
    margin: 0 auto;
    border-radius: 0.8rem;
    box-shadow: 5px 5px 5px -5px rgba(148, 148, 148, 0.6);
  }
`
