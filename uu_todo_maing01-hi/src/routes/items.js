//@@viewOn:imports
import UU5 from "uu5g04";
import {createVisualComponent, useContext, useRef} from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./items.lsi";
import ItemProvider from "../bricks/item-provider";
import ItemsTitle from "../items-title";
import ItemList from "../bricks/item-list";
//@@viewOff:imports

const Items = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "items",
  //@@viewOff:statics

  render(props) {
    //@@viewOn:hooks
    // const {
    //   data: {authorizedProfileList},
    // } = useContext(itemsInstanceContext);
    const createJokeRef = useRef();
    const updateJokeRef = useRef();
    const deleteJokeRef = useRef();

    const updateFormRef = useRef();
    const detailRef = useRef();
    //@viewOff:hooks

    //@@viewOn:private
    function showError(lsi, params) {
      UU5.Environment.getPage()
        .getAlertBus()
        .addAlert({
          content: <UU5.Bricks.Lsi lsi={lsi} params={params}/>,
          colorSchema: "red",
        });
    }

    async function handleCreateItem(joke) {
      try {
        await createJokeRef.current(joke);
      } catch {
        showError(Lsi.createFailed, [joke.name]);
      }
    }

    /* eslint no-unused-vars: "off" */
    async function handleUpdateItem(joke, values) {
      try {
        await updateJokeRef.current({id: joke.id, ...values});
      } catch {
        showError(Lsi.updateFailed, [joke.name]);
      }
    }

    async function handleDeleteItem(joke) {
      try {
        await deleteJokeRef.current({id: joke.id});
      } catch {
        showError(Lsi.deleteFailed, [joke.name]);
      }
    }

    // function isCreateAuthorized() {
    //   return authorizedProfileList?.some(
    //     (profile) => profile === Config.Profiles.AUTHORITIES || profile === Config.Profiles.EXECUTIVES
    //   );
    // }

    function openDetail(joke) {
      detailRef.current.open(joke);
    }

    function openUpdateForm(joke) {
      updateFormRef.current.open(joke);
    }

    //@@viewOff:private

    //@@viewOn:render
    function renderLoad() {
      return <UU5.Bricks.Loading/>;
    }

    function renderReady(items, handleLoad) {
      return (
        <>
          <ItemsTitle items={items}/>
          {/*{isCreateAuthorized() && <JokeCreate onCreate={handleCreateItem}/>}*/}
          <ItemList
            items={items}
            onLoad={handleLoad}
            onDetail={openDetail}
            onUpdate={openUpdateForm}
            onDelete={handleDeleteItem}
          />
          {/*<JokeUpdateForm ref={updateFormRef} onSave={handleUpdateItem}/>*/}
          {/*<JokeDetail ref={detailRef}/>*/}
        </>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <UU5.Bricks.Error content="Error happened!" error={errorData.error} errorData={errorData.data}/>;
      }
    }

    return (
      <UU5.Bricks.Container>

        <ItemProvider listId={props.params.listId}>
          {({state, data, errorData, pendingData, handlerMap}) => {

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
                return renderReady(data, handlerMap.loadNext);
            }
          }}
        </ItemProvider>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default Items;
