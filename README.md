# uuTodo

Zadání [frontend](https://uuapp.plus4u.net/uu-bookkit-maing01/78462435-bbbfbad5d130488e85ccad7d34b61a22/book/page?code=67586767) 
& [backend](https://uuapp.plus4u.net/uu-bookkit-maing01/bbbfbad5d130488e85ccad7d34b61a22/book/page?code=uuToDo_uuSubApp) 

### Schema

TodoInstance object:
```js
const todoInstanceSchema = {
  id: "012...", //generated unique code
  awid: "012...", //app instance id - unique code specified externally
  sys: {
    cTs: "...", //create timestamp
    mTs: "...", //modification timestamp
    rev: 0 //revision number
  },
  code: "...", //unique code of the todoInstance
  name: "...", //name of the todoInstance
  description : "...", //description of the todoInstance
  state: "..." //state of the todoInstance - one of active, suspended, closed
};
```

List object:
```js
const listSchema = {
  id: "012...", //generated unique code
  awid: "012...", //app instance id - unique code specified externally
  sys: {
    cTs: "...", //create timestamp
    mTs: "...", //modification timestamp
    rev: 0 //revision number
  },
  name: "...", //name of the list
  description : "...", //description of the list
  deadline: "2021-03-15" //date when all items on the list are supossed to be done
};
```

Item object: 
```js
const itemSchema = {
  id: "012...", //generated unique code
  awid: "012...", //app instance id - unique code specified externally
  sys: {
    cTs: "...", //create timestamp
    mTs: "...", //modification timestamp
    rev: 0 //revision number
  },
  listId: "...", //id of the list in which the item belongs to
  text: "...", //text of the item
  state: "...", //state of item, one of active, completed, cancelled 
  highPriority: false //mark if it is high priority item
};
```

### API

**todoInstance**
- [x] sys/uuAppWorkspace/init
- [x] sys/uuAppWorkspace/load
- [ ] todoInstance/update
- [ ] todoInstance/setState

**list**
 
- [x] list/create
- [x] list/get
- [x] list/update
- [x] list/delete
- [x] list/list

**item**

- [x] list/create
- [x] list/get
- [x] list/update
- [x] list/setFinalState
- [x] list/delete
- [x] list/list

### GUI
- [x] View lists
- [x] Add a list
- [x] Delete a list
- [x] Delete a list - confirm modal
- [x] Edit a list
- [x] View tasks
- [x] Add a task
- [x] Delete a task
- [x] Edit a task
- [x] Change task state
- [ ] Filter tasks
- [ ] Styling






TODO:
- [ ] backend testy
- [ ] frontend
- [ ] problém se stránkováním z frontendu (chodí string místo int)

## Development and Usage

See following guidelines:

- [uuAppg01Devkit Documentation](https://uuapp.plus4u.net/uu-bookkit-maing01/e884539c8511447a977c7ff070e7f2cf/book)
- [uuSubApp Instance Descriptor](https://uuapp.plus4u.net/uu-bookkit-maing01/289fcd2e11d34f3e9b2184bedb236ded/book/page?code=uuSubAppInstanceDescriptor)
- [uuApp Server Project (NodeJs)](https://uuapp.plus4u.net/uu-bookkit-maing01/2590bf997d264d959b9d6a88ee1d0ff5/book/page?code=getStarted)
- [uuApp Client Project (UU5)](https://uuapp.plus4u.net/uu-bookkit-maing01/ed11ec379073476db0aa295ad6c00178/book/page?code=getStartedHooks)
