/* eslint-disable */

const sysUuAppWorkspaceInitDtoInType = shape({
  code: code().isRequired(),
  name: string(100).isRequired(),
  description: uu5String(4000),
  uuAppProfileAuthorities: uri().isRequired(),
});

const todoInstanceUpdateDtoInType = shape({
  code: code(),
  name: string(100),
  description: uu5String(4000),
});

const todoInstanceSetStateDtoInType = shape({
  state: oneOf(["active", "suspended"]).isRequired(),
});
