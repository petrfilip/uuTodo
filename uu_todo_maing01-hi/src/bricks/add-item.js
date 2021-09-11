//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const AddItem = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "AddItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    colorSchema: UU5.PropTypes.string,
    onSave: UU5.PropTypes.func,
    onSaveDone: UU5.PropTypes.func,
    onCancelClick: UU5.PropTypes.func,
    listId: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    colorSchema: "blue",
    onSave: () => {},
    onSaveDone: () => {},
    onCancelClick: () => {},
  },
  //@@viewOff:defaultProps

  render({ onSave, onCancelClick, onSaveDone, defaultValues, listId }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    if (listId === null) {
      return null;
    }

    return (
      <UU5.Forms.Form onSave={({ values }) => onSave({ ...defaultValues, ...values, listId })} onCancel={onCancelClick}>
        <UU5.Forms.Text value={defaultValues?.text} name="text" placeholder="Add a to do ..." required />
        <UU5.Forms.SwitchSelector
          value={defaultValues?.highPriority ? String(defaultValues?.highPriority) : "false"}
          items={["true", "false"].map((value) => ({ value }))}
          label="Is high priority task"
          name={"highPriority"}
        />
        <UU5.Forms.Controls buttonSubmitProps={{ content: <UU5.Bricks.Icon icon="mdi-check" /> }} />
      </UU5.Forms.Form>
    );
    //@@viewOff:render
  },
});

export default AddItem;
