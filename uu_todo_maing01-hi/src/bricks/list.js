//@@viewOn:imports
import UU5 from "uu5g04";
import Calls from "calls";
import {createVisualComponent, useContext, useSession, useState} from "uu5g04-hooks";
import Config from "./config/config";
import Css from "./item.css.js";
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

  render({list, onDelete, onUpdate, onCreate}) {

    //@@viewOn:hooks
    const [editMode, setEditMode] = useState(false);
    const [itemName, setItemName] = useState(list?.name);
    //@@viewOff:hooks


    const addList = <UU5.Bricks.Row>
      <UU5.Bricks.Column colWidth="xs-12 s-10">
        <UU5.Forms.Text
          label=""
          placeholder="List name"
          value={itemName}
          onChange={opt => {
            setItemName(opt.value);
          }}
        />
      </UU5.Bricks.Column>
      <UU5.Bricks.Column colWidth="xs-12 s-2">
        <UU5.Bricks.Button onClick={() => {
          onCreate({name: itemName})
          setItemName("")
        }}><UU5.Bricks.Icon icon="mdi-check"/></UU5.Bricks.Button>
      </UU5.Bricks.Column>
    </UU5.Bricks.Row>

    const editList = <UU5.Bricks.Row>
      <UU5.Bricks.Column colWidth="xs-12 s-8">
        <UU5.Forms.Text
          label=""
          placeholder="List name"
          value={itemName}
          onChange={opt => {
            setItemName(opt.value);
          }}
        />
      </UU5.Bricks.Column>
      <UU5.Bricks.Column colWidth="xs-12 s-2">
        <UU5.Bricks.Button bgStyle={"outline"} onClick={() => onDelete({id: list.id, forceDelete: true})}><UU5.Bricks.Icon icon="mdi-delete"/></UU5.Bricks.Button>
      </UU5.Bricks.Column>
      <UU5.Bricks.Column colWidth="xs-12 s-2">
        <UU5.Bricks.Button onClick={() => {
          onUpdate({id: list.id, name: itemName})
          setEditMode(false)
        }}><UU5.Bricks.Icon icon="mdi-check"/></UU5.Bricks.Button>
      </UU5.Bricks.Column>
    </UU5.Bricks.Row>

    const viewList = (<UU5.Bricks.Row>
      <UU5.Bricks.Column colWidth="xs-12 s-10">
        {itemName}
      </UU5.Bricks.Column>
      <UU5.Bricks.Column colWidth="xs-12 s-2">
        <UU5.Bricks.Button icon="mdi-lead-pencil" onClick={() => setEditMode(true)}><UU5.Bricks.Icon icon="mdi-lead-pencil"/></UU5.Bricks.Button>
      </UU5.Bricks.Column>
    </UU5.Bricks.Row>)


    //@@viewOn:render
    return !list && addList || (editMode && editList || viewList);
    //@@viewOff:render
  },
});


export default List;
