//@@viewOn:imports
import {createComponent, useDataList, useState, useEffect} from "uu5g04-hooks";
import Calls from "calls";
import Config from "./config/config";
//@@viewOff:imports

const ItemProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemProvider",
  //@@viewOff:statics

  render({ children, listId }) {

    //@@viewOn:hooks

    let listDataValues = useDataList({
      pageSize: 300,
      handlerMap: {
        load: () => Calls.listItems(listId),
        // load: Calls.listItems,
        // createJoke: Calls.createItem,
        // updateJoke: Calls.updateItem,
        cancelItem: Calls.cancelItem,
      },
    });

    let {state, data, newData, pendingData, errorData, handlerMap} = listDataValues;
    //@@viewOff:hooks

    //@@viewOn:render
    return children({
      state,
      data,
      newData,
      pendingData,
      errorData,
      handlerMap,
    });
    //@@viewOff:render
  },
});

export default ItemProvider;
