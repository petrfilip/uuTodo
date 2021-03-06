//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import Config from "./config/config";
import Item from "./item";
import Lsi from "../config/lsi.js";

//@@viewOff:imports

const buttonClassName = Config.Css.css`
  font-size: 36px;
  text-decoration: underline;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  `;

const ItemList = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
    setFinalState: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: null,
    onUpdate: () => {},
    onDelete: () => {},
    setFinalState: () => {},
  },
  //@@viewOff:defaultProps

  render({ items, onUpdate, onDelete, setFinalState }) {
    //@@viewOn:hooks
    const [showAll, setShowAll] = useState(false);
    //@@viewOff:hooks

    //@@viewOn:private
    function handleClick() {
      setShowAll((currentMode) => !currentMode);
    }

    //@@viewOff:private

    //@@viewOn:render
    function renderActiveItem(item) {
      return (
        <Item
          key={item.data.data.id}
          item={item.data.data}
          onUpdate={onUpdate}
          onDelete={onDelete}
          setFinalState={setFinalState}
        />
      );
    }

    function renderCompletedItem(item) {
      return showAll && <Item key={item.data.data.id} item={item.data.data} onDelete={onDelete} />;
    }

    if (items.length === 0) {
      return (
        <>
          <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.itemList.noItem} />} />
        </>
      );
    }

    const activeItems = items.filter((item) => item?.data?.state === "active");
    const completedItems = items.filter((item) => item?.data?.state === "completed");

    return (
      <>
        <Uu5Tiles.Grid data={activeItems} tileHeight="auto" rowSpacing={8}>
          {renderActiveItem}
        </Uu5Tiles.Grid>

        {(showAll && (
          <UU5.Bricks.Button className={buttonClassName} onClick={handleClick}>
            <UU5.Bricks.Lsi lsi={Lsi.item.hideCompleted} />
          </UU5.Bricks.Button>
        )) || (
          <UU5.Bricks.Button className={buttonClassName} onClick={handleClick}>
            <UU5.Bricks.Lsi lsi={Lsi.item.showCompleted} />
          </UU5.Bricks.Button>
        )}

        <Uu5Tiles.Grid data={completedItems} tileHeight="auto" rowSpacing={8}>
          {renderCompletedItem}
        </Uu5Tiles.Grid>
      </>
    );
    //@@viewOff:render
  },
});

export default ItemList;
