//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";

import { createVisualComponent, useDataList } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Calls from "../calls";
import List from "../bricks/list";
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
        createList: Calls.createList,
        updateList: Calls.updateList,
        deleteList: Calls.deleteList,
      },
    });

    let { state, data, newData, pendingData, errorData, handlerMap } = listDataValues;
    //@@viewOff:hooks

    // @@viewOn:private
    // state === "ready" && data && data.map(item => ({id: item.data.id, href: "home", content: item.data.name})) || []
    function getListComponent(item) {
      return (
        <List
          key={item?.id}
          list={item}
          onDelete={handlerMap.deleteList}
          onUpdate={handlerMap.updateList}
          onCreate={handlerMap.createList}
        />
      );
    }

    const menuItems =
      (state === "ready" &&
        data &&
        data.map((item) => ({
          id: item.data.id,
          href: "home?listId=" + item.data.id,
          content: getListComponent(item.data),
        }))) ||
      [];
    menuItems.push({ id: "new", href: "#", content: getListComponent() });
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

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
        aboutItems={[{ content: <UU5.Bricks.Lsi lsi={Lsi.left.about} />, href: "about" }]}
        helpHref={null}
      >
        <Plus4U5.App.MenuTree
          borderBottom
          // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
          items={menuItems}
        />
      </Plus4U5.App.Left>
    );
    //@@viewOff:render
  },
});

export default Left;
