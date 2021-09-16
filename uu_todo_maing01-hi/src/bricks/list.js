//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "../config/lsi";

//@@viewOff:imports

const List = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Joke",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    list: UU5.PropTypes.any,
    colorSchema: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ list, onDelete, onUpdate, onCreate }) {
    //@@viewOn:hooks
    const [editMode, setEditMode] = useState(false);
    //@@viewOff:hooks

    const addList = (
      <UU5.Forms.TextButton
        value={list?.name || ""}
        message={<UU5.Bricks.Lsi lsi={Lsi.list.inputFieldHelp} />}
        buttons={[
          {
            icon: "mdi-check",
            onClick: async (opt) => {
              const result = await onCreate({ name: opt.value });
              UU5.Environment.getRouter().setRoute("home", { listId: result.id });
            },
            colorSchema: "info",
          },
        ]}
      />
    );

    const editList = (
      <UU5.Forms.TextButton
        placeholder="Insert todo list name"
        value={list?.name || ""}
        message="Todo list name"
        buttons={[
          {
            icon: "mdi-delete",
            onClick: async (opt) => {
              await onDelete({ id: list.id, forceDelete: true });
              UU5.Environment.getRouter().setRoute("home");
            },
            colorSchema: "info",
          },

          {
            icon: "mdi-check",
            onClick: (opt) => {
              if (opt.value !== list.name) {
                onUpdate({ id: list.id, name: opt.value });
              }
              setEditMode(false);
            },
            colorSchema: "info",
          },
        ]}
      />
    );

    const viewList = (
      <UU5.Bricks.Row>
        <UU5.Bricks.Column colWidth="xs-12 s-10">{list?.name || ""}</UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth="xs-12 s-2">
          <UU5.Bricks.Button icon="mdi-lead-pencil" onClick={() => setEditMode(true)}>
            <UU5.Bricks.Icon icon="mdi-lead-pencil" />
          </UU5.Bricks.Button>
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );

    //@@viewOn:render
    return (!list && addList) || (editMode && editList) || viewList;
    //@@viewOff:render
  },
});

export default List;
