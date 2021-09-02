//@@viewOn:imports
import UU5 from "uu5g04";
import Calls from "calls";
import {createVisualComponent, useContext, useSession} from "uu5g04-hooks";
import Config from "./config/config";
import Css from "./item.css.js";
//@@viewOff:imports

const AddItem = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "AddItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    colorSchema: UU5.PropTypes.string,
    onSave: UU5.PropTypes.func,
    listId: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    colorSchema: "blue",
    onSave: () => {
    },
  },
  //@@viewOff:defaultProps

  render({onSave, listId}) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    if (listId === null) {
      return null;
    }

    return (
      <UU5.Forms.Form onSave={({values}) => onSave({...values, listId})}>
        <UU5.Forms.Text name="text" placeholder="Add a to do ..." required/>
        <UU5.Forms.SwitchSelector
          items={["true", "false"].map(value => ({ value }))}
          label="Is high priority task"
          name={"highPriority"}
        />
        <UU5.Forms.Controls buttonSubmitProps={{content: <UU5.Bricks.Icon icon="mdi-check"/>}}/>
      </UU5.Forms.Form>

    );
    //@@viewOff:render
  },
});

export default AddItem;
