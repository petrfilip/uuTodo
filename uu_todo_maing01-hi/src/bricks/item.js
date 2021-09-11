//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useContext, useSession, useState, useRef } from "uu5g04-hooks";
import Calls from "calls";
import Config from "./config/config";
import Css from "./item.css.js";
import AddItem from "./add-item";
//@@viewOff:imports

const Mode = {
  VIEW: "VIEW",
  EDIT: "EDIT",
};

const Item = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    joke: UU5.PropTypes.shape({
      name: UU5.PropTypes.string.isRequired,
      text: UU5.PropTypes.string,
    }),
    colorSchema: UU5.PropTypes.string,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
    setFinalState: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    item: null,
    colorSchema: "blue",
    onUpdate: () => {},
    onDelete: () => {},
    setFinalState: () => {},
  },
  //@@viewOff:defaultProps

  render({ item, colorSchema, onUpdate, onDelete, setFinalState }) {
    //@viewOn:hooks
    const [mode, setMode] = useState(Mode.VIEW);
    const modalRef = useRef();
    //@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    if (!item) {
      return null;
    }

    if (mode === Mode.VIEW) {
      return (
        <UU5.Bricks.Row colorSchema={colorSchema} style="backgroundColor: pink">
          <UU5.Bricks.Column colWidth="xs-12 s-1">
            <UU5.Forms.Checkbox
              onChange={() => setFinalState({ state: "completed", id: item.id })}
              value={item.state === "completed"}
              size="xl"
            />
            {item.highPriority && <UU5.Bricks.Icon icon={"mdi-arrow-up"} />}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs-12 s-10">
            <UU5.Bricks.P>{item.text}</UU5.Bricks.P>
          </UU5.Bricks.Column>

          <UU5.Bricks.Column colWidth="xs-12 s-1">
            <UU5.Bricks.TouchIcon
              icon="mdi-lead-pencil"
              onClick={() => {
                setMode(Mode.EDIT);
              }}
            />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      );
    }

    if (mode === Mode.EDIT) {
      return (
        <UU5.Bricks.Row colorSchema={colorSchema} style="backgroundColor: pink">
          <AddItem
            defaultValues={item}
            onCancelClick={() => setMode(Mode.VIEW)}
            onSaveDone={() => setMode(Mode.VIEW)} //todo chci callback
            onSave={(itemToUpdate) => onUpdate(itemToUpdate)}
          />

          <UU5.Bricks.TouchIcon
            icon="mdi-delete"
            onClick={() =>
              modalRef.current.open({
                onConfirm: () => onDelete({ id: item.id }),
                header: "Confirm delete",
                content: <UU5.Bricks.P>Do you really want to delete item `{item.text}`</UU5.Bricks.P>,
                confirmButtonProps: { content: "Yeah!", colorSchema: "green" },
                refuseButtonProps: { content: "Noooo!", colorSchema: "danger" },
                confirmButtonLeft: true,
              })
            }
          />

          <UU5.Bricks.ConfirmModal ref_={modalRef} />
        </UU5.Bricks.Row>
      );
    }

    return null;

    //@@viewOff:render
  },
});
export default Item;
