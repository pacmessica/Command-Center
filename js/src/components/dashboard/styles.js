import styled from "styled-components";

export const Header = styled.div`
  width: 100%;
  background: #818181;
  color: white;
  padding-left: 14px;
  font-weight: bold;
  height: 64px;
  line-height: 64px;
`;

export const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: calc(100vh - 64px);
  flex-flow: column;
  align-items: stretch;
  .map-container {
    flex: 1 100%;
    height: 100px;
    margin: 15px;
  }
  .aside {
    flex: 1 100%;
  }

  @media all and (min-width: 800px) {
    flex-flow: row;

    .aside {
      flex: 1 0 0;
    }
    .map-container {
      flex: 3 0px;
      height: auto;
      margin: 0;
    }
  }
`;

export const LeftPanel = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;

  .item {
    flex: 1 1 auto;
  }
`;

export const ShadowBox = styled.div`
  margin: 2%;
  height: 98%;
  box-shadow: 1px 3px 6px 0 #d3d3d3;
  box-sizing: border-box;
  padding: 15px;
`;

export const ContentBox = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    color: #bebebe;
    font-weight: bold;
    font-size: 30px;
  }
`;
