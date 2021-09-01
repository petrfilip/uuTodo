//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";

import {createVisualComponent, useDataList} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import ListProvider from "../bricks/list-provider";
import Calls from "../calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Left",
  //@@viewOff:static
};

export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    let listDataValues = useDataList({
      pageSize: 335,
      handlerMap: {
        load: Calls.listLists,
        // createJoke: Calls.createItem,
        // updateJoke: Calls.updateItem,
        // deleteJoke: Calls.deleteItem,
      },
    });

    let {state, data, newData, pendingData, errorData, handlerMap} = listDataValues;
    //@@viewOff:hooks

    // @@viewOn:private
    // state === "ready" && data && data.map(item => ({id: item.data.id, href: "home", content: item.data.name})) || []
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    function getContent(item) {
      return <UU5.Bricks.Row>
        <UU5.Bricks.Column colWidth="xs-12 s-10">
          {item.data.name}
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth="xs-12 s-2">
          <UU5.Bricks.TouchIcon icon="mdi-lead-pencil" content="Výchozí touch ikona"/>
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>;


    }

//@@viewOn:render
    return (
      <Plus4U5.App.Left
        {...props}
        logoProps={{
          backgroundColor: UU5.Environment.colors.blue.c700,
          backgroundColorTo: UU5.Environment.colors.blue.c500,
          title: "uuTodo",
          companyLogo: Plus4U5.Environment.basePath + "assets/img/unicorn-logo.svg",
          generation: "1",
        }}
        aboutItems={[{content: <UU5.Bricks.Lsi lsi={Lsi.left.about}/>, href: "about"}]}
        helpHref={null}
      >
        <Plus4U5.App.MenuTree
          borderBottom
          // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
          items={state === "ready" && data && data.map(item => ({id: item.data.id, href: "home?listId=" + item.data.id, content: getContent(item)})) || []}
        />

      </Plus4U5.App.Left>
    );
    //@@viewOff:render
  },
});

export default Left;
