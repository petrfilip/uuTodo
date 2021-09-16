//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useEffect } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const ItemsTitle = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemsTitle",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: [],
  },
  //@@viewOff:defaultProps

  render({ items }) {
    //@@viewOn:hooks

    /* Title */
    useEffect(() => {
      const originalTitle = document.title;
      document.title = `${originalTitle} - ${items.length} items to do`;

      return () => (document.title = originalTitle);
    }, [items.length]);
    //@@viewOff:hooks

    //@@viewOn:render
    return null;
    //@@viewOff:render
  },
});

export default ItemsTitle;
