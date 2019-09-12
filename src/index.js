(function () {
  'use strict';

  function h(name, attributes) {
    var rest = [];
    var children = [];
    var length = arguments.length;

    while (length-- > 2) rest.push(arguments[length]);

    while (rest.length) {
      var node = rest.pop();
      if (node && node.pop) {
        for (length = node.length; length--; ) {
          rest.push(node[length]);
        }
      } else if (node != null && node !== true && node !== false) {
        children.push(node);
      }
    }

    return typeof name === "function"
      ? name(attributes || {}, children)
      : {
          nodeName: name,
          attributes: attributes || {},
          children: children,
          key: attributes && attributes.key
        }
  }

  function app(state, actions, view, container) {
    var map = [].map;
    var rootElement = (container && container.children[0]) || null;
    var oldNode = rootElement && recycleElement(rootElement);
    var lifecycle = [];
    var skipRender;
    var isRecycling = true;
    var globalState = clone(state);
    var wiredActions = wireStateToActions([], globalState, clone(actions));

    scheduleRender();

    return wiredActions

    function recycleElement(element) {
      return {
        nodeName: element.nodeName.toLowerCase(),
        attributes: {},
        children: map.call(element.childNodes, function(element) {
          return element.nodeType === 3 // Node.TEXT_NODE
            ? element.nodeValue
            : recycleElement(element)
        })
      }
    }

    function resolveNode(node) {
      return typeof node === "function"
        ? resolveNode(node(globalState, wiredActions))
        : node != null
          ? node
          : ""
    }

    function render() {
      skipRender = !skipRender;

      var node = resolveNode(view);

      if (container && !skipRender) {
        rootElement = patch(container, rootElement, oldNode, (oldNode = node));
      }

      isRecycling = false;

      while (lifecycle.length) lifecycle.pop()();
    }

    function scheduleRender() {
      if (!skipRender) {
        skipRender = true;
        setTimeout(render);
      }
    }

    function clone(target, source) {
      var out = {};

      for (var i in target) out[i] = target[i];
      for (var i in source) out[i] = source[i];

      return out
    }

    function setPartialState(path, value, source) {
      var target = {};
      if (path.length) {
        target[path[0]] =
          path.length > 1
            ? setPartialState(path.slice(1), value, source[path[0]])
            : value;
        return clone(source, target)
      }
      return value
    }

    function getPartialState(path, source) {
      var i = 0;
      while (i < path.length) {
        source = source[path[i++]];
      }
      return source
    }

    function wireStateToActions(path, state, actions) {
      for (var key in actions) {
        typeof actions[key] === "function"
          ? (function(key, action) {
              actions[key] = function(data) {
                var result = action(data);

                if (typeof result === "function") {
                  result = result(getPartialState(path, globalState), actions);
                }

                if (
                  result &&
                  result !== (state = getPartialState(path, globalState)) &&
                  !result.then // !isPromise
                ) {
                  scheduleRender(
                    (globalState = setPartialState(
                      path,
                      clone(state, result),
                      globalState
                    ))
                  );
                }

                return result
              };
            })(key, actions[key])
          : wireStateToActions(
              path.concat(key),
              (state[key] = clone(state[key])),
              (actions[key] = clone(actions[key]))
            );
      }

      return actions
    }

    function getKey(node) {
      return node ? node.key : null
    }

    function eventListener(event) {
      return event.currentTarget.events[event.type](event)
    }

    function updateAttribute(element, name, value, oldValue, isSvg) {
      if (name === "key") ; else if (name === "style") {
        if (typeof value === "string") {
          element.style.cssText = value;
        } else {
          if (typeof oldValue === "string") oldValue = element.style.cssText = "";
          for (var i in clone(oldValue, value)) {
            var style = value == null || value[i] == null ? "" : value[i];
            if (i[0] === "-") {
              element.style.setProperty(i, style);
            } else {
              element.style[i] = style;
            }
          }
        }
      } else {
        if (name[0] === "o" && name[1] === "n") {
          name = name.slice(2);

          if (element.events) {
            if (!oldValue) oldValue = element.events[name];
          } else {
            element.events = {};
          }

          element.events[name] = value;

          if (value) {
            if (!oldValue) {
              element.addEventListener(name, eventListener);
            }
          } else {
            element.removeEventListener(name, eventListener);
          }
        } else if (
          name in element &&
          name !== "list" &&
          name !== "type" &&
          name !== "draggable" &&
          name !== "spellcheck" &&
          name !== "translate" &&
          !isSvg
        ) {
          element[name] = value == null ? "" : value;
        } else if (value != null && value !== false) {
          element.setAttribute(name, value);
        }

        if (value == null || value === false) {
          element.removeAttribute(name);
        }
      }
    }

    function createElement(node, isSvg) {
      var element =
        typeof node === "string" || typeof node === "number"
          ? document.createTextNode(node)
          : (isSvg = isSvg || node.nodeName === "svg")
            ? document.createElementNS(
                "http://www.w3.org/2000/svg",
                node.nodeName
              )
            : document.createElement(node.nodeName);

      var attributes = node.attributes;
      if (attributes) {
        if (attributes.oncreate) {
          lifecycle.push(function() {
            attributes.oncreate(element);
          });
        }

        for (var i = 0; i < node.children.length; i++) {
          element.appendChild(
            createElement(
              (node.children[i] = resolveNode(node.children[i])),
              isSvg
            )
          );
        }

        for (var name in attributes) {
          updateAttribute(element, name, attributes[name], null, isSvg);
        }
      }

      return element
    }

    function updateElement(element, oldAttributes, attributes, isSvg) {
      for (var name in clone(oldAttributes, attributes)) {
        if (
          attributes[name] !==
          (name === "value" || name === "checked"
            ? element[name]
            : oldAttributes[name])
        ) {
          updateAttribute(
            element,
            name,
            attributes[name],
            oldAttributes[name],
            isSvg
          );
        }
      }

      var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
      if (cb) {
        lifecycle.push(function() {
          cb(element, oldAttributes);
        });
      }
    }

    function removeChildren(element, node) {
      var attributes = node.attributes;
      if (attributes) {
        for (var i = 0; i < node.children.length; i++) {
          removeChildren(element.childNodes[i], node.children[i]);
        }

        if (attributes.ondestroy) {
          attributes.ondestroy(element);
        }
      }
      return element
    }

    function removeElement(parent, element, node) {
      function done() {
        parent.removeChild(removeChildren(element, node));
      }

      var cb = node.attributes && node.attributes.onremove;
      if (cb) {
        cb(element, done);
      } else {
        done();
      }
    }

    function patch(parent, element, oldNode, node, isSvg) {
      if (node === oldNode) ; else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
        var newElement = createElement(node, isSvg);
        parent.insertBefore(newElement, element);

        if (oldNode != null) {
          removeElement(parent, element, oldNode);
        }

        element = newElement;
      } else if (oldNode.nodeName == null) {
        element.nodeValue = node;
      } else {
        updateElement(
          element,
          oldNode.attributes,
          node.attributes,
          (isSvg = isSvg || node.nodeName === "svg")
        );

        var oldKeyed = {};
        var newKeyed = {};
        var oldElements = [];
        var oldChildren = oldNode.children;
        var children = node.children;

        for (var i = 0; i < oldChildren.length; i++) {
          oldElements[i] = element.childNodes[i];

          var oldKey = getKey(oldChildren[i]);
          if (oldKey != null) {
            oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
          }
        }

        var i = 0;
        var k = 0;

        while (k < children.length) {
          var oldKey = getKey(oldChildren[i]);
          var newKey = getKey((children[k] = resolveNode(children[k])));

          if (newKeyed[oldKey]) {
            i++;
            continue
          }

          if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
            if (oldKey == null) {
              removeElement(element, oldElements[i], oldChildren[i]);
            }
            i++;
            continue
          }

          if (newKey == null || isRecycling) {
            if (oldKey == null) {
              patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
              k++;
            }
            i++;
          } else {
            var keyedNode = oldKeyed[newKey] || [];

            if (oldKey === newKey) {
              patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
              i++;
            } else if (keyedNode[0]) {
              patch(
                element,
                element.insertBefore(keyedNode[0], oldElements[i]),
                keyedNode[1],
                children[k],
                isSvg
              );
            } else {
              patch(element, oldElements[i], null, children[k], isSvg);
            }

            newKeyed[newKey] = children[k];
            k++;
          }
        }

        while (i < oldChildren.length) {
          if (getKey(oldChildren[i]) == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
        }

        for (var i in oldKeyed) {
          if (!newKeyed[i]) {
            removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
          }
        }
      }
      return element
    }
  }

  var ChoiceType;
  (function (ChoiceType) {
      ChoiceType[ChoiceType["ADDITION"] = 0] = "ADDITION";
      ChoiceType[ChoiceType["CLR"] = 1] = "CLR";
      ChoiceType[ChoiceType["CONFIRM"] = 2] = "CONFIRM";
      ChoiceType[ChoiceType["MULTIPLY"] = 3] = "MULTIPLY";
      ChoiceType[ChoiceType["DIVISION"] = 4] = "DIVISION";
      ChoiceType[ChoiceType["DELETE"] = 5] = "DELETE";
  })(ChoiceType || (ChoiceType = {}));
  var ScreenType;
  (function (ScreenType) {
      ScreenType[ScreenType["GUIDE"] = 0] = "GUIDE";
      ScreenType[ScreenType["PLAY"] = 1] = "PLAY";
  })(ScreenType || (ScreenType = {}));
  var screens = [
      {
          screenType: ScreenType.GUIDE,
          messages: [
              "Are you ready ?",
              "It is just a simple math",
              "You only need to think from the back to the start"
          ]
      },
      {
          level: 1,
          screenType: ScreenType.PLAY,
          goal: "2",
          steps: 2,
          initialValue: "0",
          choices: [
              {
                  type: ChoiceType.ADDITION,
                  params: [1],
                  label: "+1"
              },
              {
                  type: ChoiceType.ADDITION,
                  params: [-1],
                  label: "-1(debug)"
              }
          ]
      },
      {
          screenType: ScreenType.GUIDE,
          messages: ["Seems easy huh ?", "Let's move to another level !\n Can you ?"]
      },
      {
          level: 2,
          screenType: ScreenType.PLAY,
          goal: "8",
          steps: 3,
          initialValue: "0",
          choices: [
              {
                  type: ChoiceType.ADDITION,
                  params: [3],
                  label: "+3"
              },
              {
                  type: ChoiceType.ADDITION,
                  params: [2],
                  label: "+2"
              }
          ]
      },
      {
          level: 3,
          screenType: ScreenType.PLAY,
          goal: "9",
          steps: 3,
          initialValue: "-1",
          choices: [
              {
                  type: ChoiceType.ADDITION,
                  params: [1],
                  label: "+1"
              },
              {
                  type: ChoiceType.ADDITION,
                  params: [3],
                  label: "+3"
              },
              {
                  type: ChoiceType.MULTIPLY,
                  params: [3],
                  label: "x3"
              }
          ]
      },
      {
          level: 4,
          screenType: ScreenType.PLAY,
          goal: "4",
          steps: 3,
          initialValue: "3",
          choices: [
              {
                  type: ChoiceType.ADDITION,
                  params: [4],
                  label: "+4"
              },
              {
                  type: ChoiceType.MULTIPLY,
                  params: [4],
                  label: "x4"
              },
              {
                  type: ChoiceType.DIVISION,
                  params: [4],
                  label: "/4"
              }
          ]
      },
      {
          level: 5,
          screenType: ScreenType.PLAY,
          goal: "4",
          steps: 3,
          initialValue: "0",
          choices: [
              {
                  type: ChoiceType.ADDITION,
                  params: [8],
                  label: "+8"
              },
              {
                  type: ChoiceType.MULTIPLY,
                  params: [5],
                  label: "x5"
              },
              {
                  type: ChoiceType.DELETE,
                  params: [],
                  label: "<<"
              }
          ]
      },
      {
          screenType: ScreenType.GUIDE,
          messages: ["You completed all the callenge !"]
      }
  ];

  var GameState;
  (function (GameState) {
      GameState[GameState["IDDLE"] = 0] = "IDDLE";
      GameState[GameState["PLAYING"] = 1] = "PLAYING";
      GameState[GameState["WIN"] = 2] = "WIN";
      GameState[GameState["LOSE"] = 3] = "LOSE";
  })(GameState || (GameState = {}));
  var state = {
      screens: screens,
      screenPointer: 0,
      guideMsgPointer: 0,
      remainingMove: 0,
      displayMsg: "",
      isAcceptInput: true,
      gameState: GameState.IDDLE
  };

  var actions = {
      restartOperator: function () { return function (state) {
          var currLevel = state.screens[state.screenPointer];
          return {
              gameState: GameState.PLAYING,
              displayMsg: currLevel.initialValue,
              remainingMove: currLevel.steps
          };
      }; },
      initScreen: function () { return function (state) {
          var currScreen = state.screens[state.screenPointer];
          var screenType = currScreen.screenType;
          if (screenType === ScreenType.GUIDE) {
              return {
                  guideMsgPointer: 0,
                  displayMsg: currScreen.messages[0]
              };
          }
      }; },
      confirmOperator: function () { return function (state, action) {
          var nextGuideMsgPointer = state.guideMsgPointer + 1;
          var currScreen = state.screens[state.screenPointer];
          var messages = currScreen.messages;
          // check if all message is already read
          if (nextGuideMsgPointer === messages.length) {
              var nextScreenPointer = state.screenPointer + 1;
              var nextScreen = state.screens[nextScreenPointer];
              return {
                  screenPointer: state.screenPointer + 1,
                  displayMsg: nextScreen.initialValue,
                  remainingMove: nextScreen.steps,
                  guideMsgPointer: 0,
                  gameState: GameState.PLAYING
              };
          }
          return {
              guideMsgPointer: nextGuideMsgPointer,
              displayMsg: messages[nextGuideMsgPointer]
          };
      }; },
      loadNextScreen: function () { return function (state) {
          var nextScreenPointer = state.screenPointer + 1;
          var nextScreen = state.screens[nextScreenPointer];
          var nextScreenType = nextScreen.screenType;
          if (nextScreenType === ScreenType.GUIDE) {
              return {
                  screenPointer: nextScreenPointer,
                  guideMsgPointer: 0,
                  displayMsg: nextScreen.messages[0],
                  gameState: GameState.IDDLE
              };
          }
          return {
              screenPointer: nextScreenPointer,
              gameState: GameState.PLAYING,
              displayMsg: nextScreen.initialValue,
              remainingMove: nextScreen.steps
          };
      }; },
      addOperator: function (operand) { return function (state) {
          // if (state.isAcceptInput) {
          if (state.gameState === GameState.PLAYING) {
              var nextValue = (parseInt(state.displayMsg) + operand).toString();
              var currScreen = state.screens[state.screenPointer];
              // decrement steps
              var nextRemainingMove = state.remainingMove - 1;
              // const nextAcceptInput = nextRemainingMove > 0;
              // Evaluate if meet win condition
              if (nextValue === currScreen.goal) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.WIN
                  };
              }
              if (!nextRemainingMove) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.LOSE
                  };
              }
              return {
                  displayMsg: nextValue,
                  remainingMove: nextRemainingMove
              };
          }
      }; },
      multiplyOperator: function (operand) { return function (state) {
          if (state.gameState === GameState.PLAYING) {
              var nextValue = (parseInt(state.displayMsg) * operand).toString();
              var currScreen = state.screens[state.screenPointer];
              // decrement steps
              var nextRemainingMove = state.remainingMove - 1;
              // const nextAcceptInput = nextRemainingMove > 0;
              // Evaluate if meet win condition
              if (nextValue === currScreen.goal) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.WIN
                  };
              }
              if (!nextRemainingMove) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.LOSE
                  };
              }
              return {
                  displayMsg: nextValue,
                  remainingMove: nextRemainingMove
              };
          }
      }; },
      divisionOperator: function (operand) { return function (state) {
          if (state.gameState === GameState.PLAYING) {
              var nextValue = (parseInt(state.displayMsg) / operand).toString();
              var currScreen = state.screens[state.screenPointer];
              // decrement steps
              var nextRemainingMove = state.remainingMove - 1;
              // const nextAcceptInput = nextRemainingMove > 0;
              // Evaluate if meet win condition
              if (nextValue === currScreen.goal) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.WIN
                  };
              }
              if (!nextRemainingMove) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.LOSE
                  };
              }
              return {
                  displayMsg: nextValue,
                  remainingMove: nextRemainingMove
              };
          }
      }; },
      deleteOperator: function () { return function (state) {
          if (state.gameState === GameState.PLAYING) {
              var currDisplayMsg = state.displayMsg;
              var _nextValue = currDisplayMsg.substring(0, currDisplayMsg.length - 1);
              var nextValue = _nextValue === "" ? "0" : _nextValue;
              var currScreen = state.screens[state.screenPointer];
              // decrement steps
              var nextRemainingMove = state.remainingMove - 1;
              // const nextAcceptInput = nextRemainingMove > 0;
              // Evaluate if meet win condition
              if (nextValue === currScreen.goal) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.WIN
                  };
              }
              if (!nextRemainingMove) {
                  return {
                      displayMsg: nextValue,
                      remainingMove: nextRemainingMove,
                      gameState: GameState.LOSE
                  };
              }
              return {
                  displayMsg: nextValue,
                  remainingMove: nextRemainingMove
              };
          }
      }; }
  };

  var _id = 0;
  var sheet = document.head.appendChild(document.createElement("style")).sheet;

  function hyphenate(str) {
    return str.replace(/[A-Z]/g, "-$&").toLowerCase()
  }

  function createStyle(rules, prefix) {
    var id = "p" + _id++;
    var name = prefix + id;
    rules.forEach(function(rule) {
      if (/^@/.test(rule)) {
        var start = rule.indexOf("{") + 1;
        rule = rule.slice(0, start) + name + rule.slice(start);
      } else {
        rule = name + rule;
      }
      sheet.insertRule(rule, sheet.cssRules.length);
    });
    return id
  }

  function wrap(stringToWrap, wrapper) {
    return wrapper + "{" + stringToWrap + "}"
  }

  function parse(obj, isInsideObj) {
    var arr = [""];
    isInsideObj = isInsideObj || 0;
    for (var prop in obj) {
      var value = obj[prop];
      prop = hyphenate(prop);
      // Same as typeof value === 'object', but smaller
      if (!value.sub && !Array.isArray(value)) {
        // replace & in "&:hover", "p>&"
        prop = prop.replace(/&/g, "");
        arr.push(wrap(parse(value,  !/^@/.test(prop)).join(""), prop));
      } else {
        value = Array.isArray(value) ? value : [value];
        value.forEach(function(value) {
          return (arr[0] += prop + ":" + value + ";")
        });
      }
    }
    if (!isInsideObj) {
      arr[0] = wrap(arr[0], "");
    }
    return arr
  }

  function picostyle(h, options) {
    var cache = {};
    options = options || {};
    return options.returnObject ? { style: style, css: css } : style
    function style(nodeName) {
      return function(decls) {
        return function(attributes, children) {
          attributes = attributes || {};
          children = attributes.children || children;
          var nodeDecls = typeof decls == "function" ? decls(attributes) : decls;
          attributes.class = [css(nodeDecls), attributes.class]
            .filter(Boolean)
            .join(" ");
          return h(nodeName, attributes, children)
        }
      }
    }
    function css(decls) {
      var rules = parse(decls);
      var key = rules.join("");
      return cache[key] || (cache[key] = createStyle(rules, "."))
    }
  }

  var pStyle = picostyle(h, { returnObject: true });
  var style = pStyle.style;
  var css = pStyle.css;

  var pageBackgroundColor = "#3a405a";
  var wrapperColor = "#e4dccf";

  var container = css({
      backgroundColor: pageBackgroundColor,
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
  });
  // export const container = 'container';
  // export const wrapper = 'wrapper'
  var wrapper = css({
      width: "576px",
      height: "900px",
      backgroundColor: wrapperColor,
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px"
  });

  var Container = (function (state, actions) {
      return (h("div", { "class": container, oncreate: actions.initScreen },
          h("div", { "class": wrapper },
              h("h1", null, "test "))));
  });

  app(state, actions, Container, document.body);

}());
//# sourceMappingURL=index.js.map
