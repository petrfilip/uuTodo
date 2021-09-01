//@@viewOn:imports
import {createComponent, useDataList} from "uu5g04-hooks";
import Calls from "calls";
import Config from "./config/config";
//@@viewOff:imports

const ListProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ListProvider",
  //@@viewOff:statics

  render({children}) {
    //@@viewOn:hooks
    let listDataValues = useDataList({
      pageSize: 200,
      handlerMap: {
        load: Calls.listItems,
        // createJoke: Calls.createItem,
        // updateJoke: Calls.updateItem,
        // deleteJoke: Calls.deleteItem,
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

export default ListProvider;
