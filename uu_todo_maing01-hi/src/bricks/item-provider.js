//@@viewOn:imports
import { createComponent, useDataList, useEffect } from "uu5g04-hooks";
import UU5 from "uu5g04";
import Calls from "calls";
import Config from "./config/config";
//@@viewOff:imports

const ItemProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    listId: UU5.PropTypes.string.isRequired,
    pageInfo: UU5.PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    listId: null,
    pageInfo: null,
  },
  //@@viewOff:defaultProps

  render({ children, listId }) {
    //@@viewOn:hooks
    const pageInfo = {
      pageIndex: 0,
      pageSize: 500,
    };
    let listDataValues = useDataList({
      pageSize: 300,
      handlerMap: {
        load: () => Calls.listItems({ listId: listId, pageInfo }),
        createItem: Calls.createItem,
        updateItem: Calls.updateItem,
        deleteItem: Calls.deleteItem,
        setFinalState: Calls.setFinalState,
      },
    });

    useEffect(() => {
      listDataValues?.handlerMap?.load && listDataValues.handlerMap.load();
    }, [listId]);

    let { state, data, newData, pendingData, errorData, handlerMap } = listDataValues;
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
