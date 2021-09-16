//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
import ItemProvider from "../bricks/item-provider";
import ItemsTitle from "../items-title";
import ItemList from "../bricks/item-list";
import AddItem from "../bricks/add-item";
//@@viewOff:imports

const Items = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "items",
  //@@viewOff:statics

  render(props) {
    //@@viewOn:hooks
    //@viewOff:hooks

    //@@viewOn:private
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReady(items, handlerMap, listId) {
      return (
        <>
          <ItemsTitle items={items} />
          <AddItem onSave={handlerMap.createItem} listId={listId} />
          <ItemList
            items={items}
            onUpdate={handlerMap.updateItem}
            onDelete={handlerMap.deleteItem}
            setFinalState={handlerMap.setFinalState}
          />
        </>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <UU5.Bricks.Error content="Error happened!" error={errorData.error} errorData={errorData.data} />;
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Bricks.Container>
        {!props?.params?.listId && (
          <UU5.Bricks.Block background colorSchema="orange">
            Choose Todo list from right menu
          </UU5.Bricks.Block>
        )}

        {props?.params?.listId && (
          <ItemProvider listId={props.params.listId}>
            {({ state, data, errorData, pendingData, handlerMap }) => {
              switch (state) {
                case "pending":
                case "pendingNoData":
                  return renderLoad();
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "itemPending":
                case "ready":
                case "readyNoData":
                default:
                  return renderReady(data, handlerMap, props.params.listId);
              }
            }}
          </ItemProvider>
        )}
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default Items;
