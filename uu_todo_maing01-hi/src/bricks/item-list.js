//@@viewOn:imports
import UU5 from "uu5g04";
import Config from "./config/config";
import {createVisualComponent, useState} from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import Item from "./item";
//@@viewOff:imports

const ItemList = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "JokeList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
    onDetail: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: [],
    onDetail: () => {
    },
    onUpdate: () => {
    },
    onDelete: () => {
    },
  },
  //@@viewOff:defaultProps

  render({items, onDetail, onUpdate, onDelete}) {

    //@@viewOn:hooks
    const [showAll, setShowAll] = useState(false);
    //@@viewOff:hooks

    //@@viewOn:private
    function handleClick() {
      setShowAll(currentMode => !currentMode);
    }
    //@@viewOff:private


    //@@viewOn:render
    function renderActiveItem(item) {
      return item.data.data.state === "active" && (<Item item={item.data.data} colorSchema="green" onDetail={onDetail} onUpdate={onUpdate} onDelete={onDelete}/>);
    }

    function renderCompletedItem(item) {
      return showAll && item.data.data.state === "completed" && (<Item item={item.data.data} colorSchema="green" onDetail={onDetail} onUpdate={onUpdate} onDelete={onDelete}/>);
    }

    if (items.length === 0) {
      return <UU5.Common.Error content="No items!"/>;
    }

    return (
      <>
        <Uu5Tiles.Grid
          data={items}
          tileHeight="auto"
          rowSpacing={8}
        >
          {renderActiveItem}
        </Uu5Tiles.Grid>

        {showAll && <UU5.Bricks.Button onClick={handleClick}>Hide completed<UU5.Bricks.Icon icon="mdi-apple"/></UU5.Bricks.Button> || <UU5.Bricks.Button onClick={handleClick}>Show completed<UU5.Bricks.Icon icon="mdi-apple"/></UU5.Bricks.Button>}

        <Uu5Tiles.Grid
          data={items}
          tileHeight="auto"
          rowSpacing={8}
        >
          {renderCompletedItem}
        </Uu5Tiles.Grid>

      </>
    );
    //@@viewOff:render
  },
});

export default ItemList;
