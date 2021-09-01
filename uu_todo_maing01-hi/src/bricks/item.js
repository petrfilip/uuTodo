//@@viewOn:imports
import UU5 from "uu5g04";
import Calls from "calls";
import {createVisualComponent, useContext, useSession} from "uu5g04-hooks";
import Config from "./config/config";
import Css from "./item.css.js";
//@@viewOff:imports

const Item = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Joke",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    joke: UU5.PropTypes.shape({
      name: UU5.PropTypes.string.isRequired,
      text: UU5.PropTypes.string,
    }),
    colorSchema: UU5.PropTypes.string,
    onDetail: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    item: null,
    colorSchema: "blue",
    onDetail: () => {
    },
    onUpdate: () => {
    },
    onDelete: () => {
    },
  },
  //@@viewOff:defaultProps

  render({item, colorSchema, onDetail, onUpdate, onDelete}) {
    //@@viewOn:private
    function handleDetail() {
      onDetail(item);
    }
    //@@viewOff:private

    //@@viewOn:render
    if (!item) {
      return null;
    }


    return (
      <UU5.Bricks.Row colorSchema={colorSchema} style="backgroundColor: pink">
        <UU5.Bricks.Column colWidth="xs-12 s-1" >
          <UU5.Forms.Checkbox
            value={item.state === "completed"}
            // label={item.text}
            size="xl"
          />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth="xs-12 s-8" >
          <UU5.Bricks.P>{item.text}</UU5.Bricks.P>
        </UU5.Bricks.Column>

        <UU5.Bricks.Column colWidth="xs-12 s-3" >
          <UU5.Bricks.TouchIcon icon="mdi-delete" content="Výchozí touch ikona" />
          <UU5.Bricks.TouchIcon icon="mdi-lead-pencil" content="Výchozí touch ikona" />
        </UU5.Bricks.Column>
        <div className={Css.content()} onClick={handleDetail}>



        </div>
      </UU5.Bricks.Row>
    );
    //@@viewOff:render
  },
});

export default Item;
