/**
 * Bundle of @devexpress/dx-grid-core
 * Generated: 2018-03-20
 * Version: 1.1.1
 * License: https://js.devexpress.com/Licensing
 */

//import { easeOutCubic } from '@devexpress/dx-core';

var DXGridCore=function(){
var easeOutCubic = DXCore.easeOutCubic;

var rowIdGetter = function rowIdGetter(getRowId, rows) {
  if (!getRowId) {
    var map = new Map(rows.map(function (row, rowIndex) {
      return [row, rowIndex];
    }));
    return function (row) {
      return map.get(row);
    };
  }
  return getRowId;
};

var defaultGetCellValue = function defaultGetCellValue(row, columnName) {
  return row[columnName];
};
var cellValueGetter = function cellValueGetter() {
  var getCellValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetCellValue;
  var columns = arguments[1];

  var useFastAccessor = true;
  var map = columns.reduce(function (acc, column) {
    if (column.getCellValue) {
      useFastAccessor = false;
      acc[column.name] = column.getCellValue;
    }
    return acc;
  }, {});

  if (useFastAccessor) {
    return getCellValue;
  }

  return function (row, columnName) {
    return map[columnName] ? map[columnName](row, columnName) : getCellValue(row, columnName);
  };
};

var changeColumnSorting = function changeColumnSorting(state, _ref) {
  var columnName = _ref.columnName,
      direction = _ref.direction,
      keepOther = _ref.keepOther,
      sortIndex = _ref.sortIndex;
  var sorting = state.sorting;


  var nextSorting = [];
  if (keepOther === true) {
    nextSorting = sorting.slice();
  }
  if (Array.isArray(keepOther)) {
    nextSorting = sorting.slice().filter(function (columnSorting) {
      return keepOther.indexOf(columnSorting.columnName) > -1;
    });
  }

  var columnSortingIndex = sorting.findIndex(function (columnSorting) {
    return columnSorting.columnName === columnName;
  });
  var columnSorting = sorting[columnSortingIndex];
  var newColumnSorting = {
    columnName: columnName,
    direction: direction || (!columnSorting || columnSorting.direction === 'desc' ? 'asc' : 'desc')
  };

  if (columnSortingIndex > -1) {
    nextSorting.splice(columnSortingIndex, 1);
  }

  if (direction !== null) {
    var newIndexFallback = columnSortingIndex > -1 ? columnSortingIndex : nextSorting.length;
    var newIndex = sortIndex !== undefined ? sortIndex : newIndexFallback;
    nextSorting.splice(newIndex, 0, newColumnSorting);
  }

  return {
    sorting: nextSorting
  };
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();













var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};













var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};







var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var unique = function unique(arr) {
  return [].concat(toConsumableArray(new Set(arr)));
};

var getColumnSortingDirection = function getColumnSortingDirection(sorting, columnName) {
  var columnSorting = sorting.filter(function (s) {
    return s.columnName === columnName;
  })[0];
  return columnSorting ? columnSorting.direction : null;
};

var getPersistentSortedColumns = function getPersistentSortedColumns(sorting) {
  var columnExtensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return columnExtensions.reduce(function (acc, _ref) {
    var columnName = _ref.columnName,
        sortingEnabled = _ref.sortingEnabled;

    if (sortingEnabled === false) {
      if (sorting.findIndex(function (sortItem) {
        return sortItem.columnName === columnName;
      }) > -1) {
        acc.push(columnName);
      }
    }
    return acc;
  }, []);
};

var calculateKeepOther = function calculateKeepOther(sorting, keepOther) {
  var persistentSortedColumns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!persistentSortedColumns.length) return keepOther;
  if (!keepOther) return persistentSortedColumns;

  return Array.isArray(keepOther) ? unique([].concat(toConsumableArray(keepOther), toConsumableArray(persistentSortedColumns))) : unique([].concat(toConsumableArray(sorting.map(function (item) {
    return item.columnName;
  })), toConsumableArray(persistentSortedColumns)));
};

/* eslint-disable no-plusplus, no-param-reassign, no-use-before-define, no-constant-condition */

var merge = function merge(array, auxiliary, lo, mid, hi, compare) {
  var i = lo;
  var j = mid + 1;
  var k = lo;
  while (true) {
    var cmp = compare(array[i], array[j]);
    if (cmp <= 0) {
      auxiliary[k++] = array[i++];
      if (i > mid) {
        do {
          auxiliary[k++] = array[j++];
        } while (j <= hi);
        break;
      }
    } else {
      auxiliary[k++] = array[j++];
      if (j > hi) {
        do {
          auxiliary[k++] = array[i++];
        } while (i <= mid);
        break;
      }
    }
  }
};

var sortArrayToAuxiliary = function sortArrayToAuxiliary(array, auxiliary, lo, hi, compare) {
  if (hi < lo) return;
  if (hi === lo) {
    auxiliary[lo] = array[lo];
    return;
  }
  var mid = Math.floor(lo + (hi - lo) / 2);
  sortAuxiliaryToArray(array, auxiliary, lo, mid, compare);
  sortAuxiliaryToArray(array, auxiliary, mid + 1, hi, compare);
  merge(array, auxiliary, lo, mid, hi, compare);
};

var sortAuxiliaryToArray = function sortAuxiliaryToArray(array, auxiliary, lo, hi, compare) {
  if (hi <= lo) return;
  var mid = Math.floor(lo + (hi - lo) / 2);
  sortArrayToAuxiliary(array, auxiliary, lo, mid, compare);
  sortArrayToAuxiliary(array, auxiliary, mid + 1, hi, compare);
  merge(auxiliary, array, lo, mid, hi, compare);
};

var mergeSort = (function (array) {
  var compare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  var result = array.slice();
  var auxiliary = array.slice();
  sortAuxiliaryToArray(result, auxiliary, 0, result.length - 1, compare);
  return result;
});

var NODE_CHECK = Symbol('node');

var rowsToTree = function rowsToTree(rows, getRowLevelKey) {
  if (!rows.length) return rows;

  var levels = [{ children: [] }];

  rows.forEach(function (row) {
    var levelKey = getRowLevelKey(row);
    if (levelKey) {
      var _node;

      var levelIndex = levels.slice(1).findIndex(function (level) {
        return getRowLevelKey(level.root) === levelKey;
      }) + 1;
      if (levelIndex > 0) {
        levels.splice(levelIndex, levels.length - levelIndex);
      }
      var node = (_node = {}, defineProperty(_node, NODE_CHECK, true), defineProperty(_node, 'root', row), defineProperty(_node, 'children', []), _node);
      levels[levels.length - 1].children.push(node);
      levels.push(node);
    } else {
      levels[levels.length - 1].children.push(row);
    }
  });

  return levels[0].children;
};

var treeToRows = function treeToRows(tree) {
  var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!tree.length) return tree;
  return tree.reduce(function (acc, node) {
    if (node[NODE_CHECK]) {
      acc.push(node.root);
      treeToRows(node.children, rows);
    } else {
      acc.push(node);
    }
    return acc;
  }, rows);
};

var defaultCompare = function defaultCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

var createCompare = function createCompare(sorting, getColumnCompare, getComparableValue) {
  return sorting.slice().reverse().reduce(function (prevCompare, columnSorting) {
    var columnName = columnSorting.columnName;

    var inverse = columnSorting.direction === 'desc';
    var columnCompare = getColumnCompare && getColumnCompare(columnName) || defaultCompare;

    return function (aRow, bRow) {
      var a = getComparableValue(aRow, columnName);
      var b = getComparableValue(bRow, columnName);
      var result = columnCompare(a, b);

      if (result !== 0) {
        return inverse ? -result : result;
      }
      return prevCompare(aRow, bRow);
    };
  }, function () {
    return 0;
  });
};

var sortTree = function sortTree(tree, compare) {
  var sortedTree = tree.map(function (node) {
    if (node[NODE_CHECK]) {
      return _extends({}, node, {
        children: sortTree(node.children, compare)
      });
    }
    return node;
  });

  return mergeSort(sortedTree, function (a, b) {
    return compare(a[NODE_CHECK] ? a.root : a, b[NODE_CHECK] ? b.root : b);
  });
};

var sortHierarchicalRows = function sortHierarchicalRows(rows, compare, getRowLevelKey) {
  var tree = rowsToTree(rows, getRowLevelKey);

  var sortedTree = sortTree(tree, compare);

  return treeToRows(sortedTree);
};

var sortedRows = function sortedRows(rows, sorting, getCellValue, getColumnCompare, isGroupRow, getRowLevelKey) {
  if (!sorting.length || !rows.length) return rows;

  if (!getRowLevelKey) {
    var _compare = createCompare(sorting, getColumnCompare, getCellValue);
    return mergeSort(rows.slice(), _compare);
  }

  var compare = createCompare(sorting, getColumnCompare, function (row, columnName) {
    if (isGroupRow(row)) {
      if (row.groupedBy === columnName) {
        return row.value;
      }
      return undefined;
    }
    return getCellValue(row, columnName);
  });
  return sortHierarchicalRows(rows, compare, getRowLevelKey);
};

var changeColumnFilter = function changeColumnFilter(filters, _ref) {
  var columnName = _ref.columnName,
      config = _ref.config;

  var filterIndex = filters.findIndex(function (f) {
    return f.columnName === columnName;
  });
  var nextState = filters.slice();

  if (config) {
    var filter = _extends({ columnName: columnName }, config);
    if (filterIndex > -1) {
      nextState.splice(filterIndex, 1, filter);
    } else {
      nextState.push(filter);
    }
  } else {
    nextState.splice(filterIndex, 1);
  }

  return nextState;
};

var pushFilterExpression = function pushFilterExpression(filters) {
  return function (_ref2) {
    var filterExpression = _ref2.filterExpression;

    var selfFilterExpr = { operator: 'and', filters: filters };
    if (!filterExpression) {
      return selfFilterExpr;
    }
    return {
      operator: 'and',
      filters: [filterExpression, selfFilterExpr]
    };
  };
};

var getColumnFilterConfig = function getColumnFilterConfig(filters, columnName) {
  if (!filters.length) {
    return null;
  }

  var filter = filters.filter(function (s) {
    return s.columnName === columnName;
  })[0];
  if (!filter) return null;

  var _ = filter.columnName,
      config = objectWithoutProperties(filter, ["columnName"]);

  return config;
};

var AND = function AND(predicates) {
  return function (row) {
    return predicates.reduce(function (acc, predicate) {
      return acc && predicate(row);
    }, true);
  };
};

var OR = function OR(predicates) {
  return function (row) {
    return predicates.reduce(function (acc, predicate) {
      return acc || predicate(row);
    }, false);
  };
};

var operators = { or: OR, and: AND };

var toLowerCase = function toLowerCase(value) {
  return String(value).toLowerCase();
};

var defaultPredicate = function defaultPredicate(value, filter) {
  return toLowerCase(value).indexOf(toLowerCase(filter.value)) > -1;
};

var filterTree = function filterTree(tree, predicate) {
  return tree.reduce(function (acc, node) {
    if (node[NODE_CHECK]) {
      var filteredChildren = filterTree(node.children, predicate);
      if (filteredChildren.length > 0) {
        acc.push(_extends({}, node, {
          children: filteredChildren
        }));
        return acc;
      } else if (predicate(node.root)) {
        acc.push(node.root);
        return acc;
      }
    }

    if (predicate(node)) {
      acc.push(node);
      return acc;
    }

    return acc;
  }, []);
};

var filterHierarchicalRows = function filterHierarchicalRows(rows, predicate, getRowLevelKey, isGroupRow) {
  var tree = rowsToTree(rows, getRowLevelKey);

  var filteredTree = filterTree(tree, function (row) {
    return isGroupRow(row) ? row.collapsedRows && row.collapsedRows.findIndex(predicate) > -1 : predicate(row);
  });

  return treeToRows(filteredTree);
};

var buildPredicate = function buildPredicate(initialFilterExpression, getCellValue, getColumnPredicate) {
  var getSimplePredicate = function getSimplePredicate(filterExpression) {
    var columnName = filterExpression.columnName;

    var customPredicate = getColumnPredicate && getColumnPredicate(columnName);
    var predicate = customPredicate || defaultPredicate;
    return function (row) {
      return predicate(getCellValue(row, columnName), filterExpression, row);
    };
  };

  var getOperatorPredicate = function getOperatorPredicate(filterExpression) {
    var build = operators[toLowerCase(filterExpression.operator)];
    // eslint-disable-next-line no-use-before-define
    return build && build(filterExpression.filters.map(getPredicate));
  };

  var getPredicate = function getPredicate(filterExpression) {
    return getOperatorPredicate(filterExpression) || getSimplePredicate(filterExpression);
  };

  return getPredicate(initialFilterExpression);
};

var filteredRows = function filteredRows(rows, filterExpression, getCellValue, getColumnPredicate, isGroupRow, getRowLevelKey) {
  if (!(filterExpression && Object.keys(filterExpression).length && rows.length)) {
    return rows;
  }

  var predicate = buildPredicate(filterExpression, getCellValue, getColumnPredicate);

  return getRowLevelKey ? filterHierarchicalRows(rows, predicate, getRowLevelKey, isGroupRow) : rows.filter(predicate);
};

var GROUP_KEY_SEPARATOR = '|';

var applyColumnGrouping = function applyColumnGrouping(grouping, _ref) {
  var columnName = _ref.columnName,
      groupIndex = _ref.groupIndex;

  var nextGrouping = grouping.slice();
  var groupingIndex = nextGrouping.findIndex(function (g) {
    return g.columnName === columnName;
  });
  var targetIndex = groupIndex;

  if (groupingIndex > -1) {
    nextGrouping.splice(groupingIndex, 1);
  } else if (groupIndex === undefined) {
    targetIndex = nextGrouping.length;
  }

  if (targetIndex > -1) {
    nextGrouping.splice(targetIndex, 0, {
      columnName: columnName
    });
  }

  return nextGrouping;
};

var changeColumnGrouping = function changeColumnGrouping(_ref2, _ref3) {
  var grouping = _ref2.grouping,
      expandedGroups = _ref2.expandedGroups;
  var columnName = _ref3.columnName,
      groupIndex = _ref3.groupIndex;

  var nextGrouping = applyColumnGrouping(grouping, { columnName: columnName, groupIndex: groupIndex });

  var ungroupedColumnIndex = grouping.findIndex(function (group, index) {
    return !nextGrouping[index] || group.columnName !== nextGrouping[index].columnName;
  });
  if (ungroupedColumnIndex === -1) {
    return {
      grouping: nextGrouping
    };
  }

  var filteredExpandedGroups = expandedGroups.filter(function (group) {
    return group.split(GROUP_KEY_SEPARATOR).length <= ungroupedColumnIndex;
  });
  if (filteredExpandedGroups.length === expandedGroups.length) {
    return {
      grouping: nextGrouping
    };
  }

  return {
    grouping: nextGrouping,
    expandedGroups: filteredExpandedGroups
  };
};

var toggleExpandedGroups = function toggleExpandedGroups(state, _ref4) {
  var groupKey = _ref4.groupKey;

  var expandedGroups = state.expandedGroups.slice();
  var groupKeyIndex = expandedGroups.indexOf(groupKey);

  if (groupKeyIndex > -1) {
    expandedGroups.splice(groupKeyIndex, 1);
  } else {
    expandedGroups.push(groupKey);
  }

  return {
    expandedGroups: expandedGroups
  };
};

var draftColumnGrouping = function draftColumnGrouping(_ref5, _ref6) {
  var grouping = _ref5.grouping,
      draftGrouping = _ref5.draftGrouping;
  var columnName = _ref6.columnName,
      groupIndex = _ref6.groupIndex;
  return {
    draftGrouping: applyColumnGrouping(draftGrouping || grouping, { columnName: columnName, groupIndex: groupIndex })
  };
};

var cancelColumnGroupingDraft = function cancelColumnGroupingDraft() {
  return {
    draftGrouping: null
  };
};

var GRID_GROUP_TYPE = 'group';
var GRID_GROUP_CHECK = Symbol(GRID_GROUP_TYPE + '_check');
var GRID_GROUP_LEVEL_KEY = Symbol(GRID_GROUP_TYPE + '_levelKey');

var groupRowChecker = function groupRowChecker(row) {
  return row[GRID_GROUP_CHECK];
};

var groupRowLevelKeyGetter = function groupRowLevelKeyGetter(row) {
  return row[GRID_GROUP_LEVEL_KEY];
};

var defaultColumnCriteria = function defaultColumnCriteria(value) {
  return {
    key: String(value),
    value: value
  };
};

var groupedRows = function groupedRows(rows, grouping, getCellValue, getColumnCriteria) {
  var keyPrefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

  if (!grouping.length) return rows;

  var columnName = grouping[0].columnName;

  var groupCriteria = getColumnCriteria && getColumnCriteria(columnName) || defaultColumnCriteria;
  var groups = rows.reduce(function (acc, row) {
    var _groupCriteria = groupCriteria(getCellValue(row, columnName), row),
        key = _groupCriteria.key,
        _groupCriteria$value = _groupCriteria.value,
        value = _groupCriteria$value === undefined ? key : _groupCriteria$value;

    var sameKeyItems = acc.get(key);

    if (!sameKeyItems) {
      acc.set(key, [value, key, [row]]);
    } else {
      sameKeyItems[2].push(row);
    }
    return acc;
  }, new Map());

  var groupedBy = grouping[0].columnName;
  var nestedGrouping = grouping.slice(1);
  return [].concat(toConsumableArray(groups.values())).reduce(function (acc, _ref) {
    var _acc$push;

    var _ref2 = slicedToArray(_ref, 3),
        value = _ref2[0],
        key = _ref2[1],
        items = _ref2[2];

    var compoundKey = '' + keyPrefix + key;
    acc.push((_acc$push = {}, defineProperty(_acc$push, GRID_GROUP_CHECK, true), defineProperty(_acc$push, GRID_GROUP_LEVEL_KEY, GRID_GROUP_TYPE + '_' + groupedBy), defineProperty(_acc$push, 'groupedBy', groupedBy), defineProperty(_acc$push, 'compoundKey', compoundKey), defineProperty(_acc$push, 'key', key), defineProperty(_acc$push, 'value', value), _acc$push));
    acc.push.apply(acc, toConsumableArray(groupedRows(items, nestedGrouping, getCellValue, getColumnCriteria, '' + compoundKey + GROUP_KEY_SEPARATOR)));
    return acc;
  }, []);
};

var expandedGroupRows = function expandedGroupRows(rows, grouping, expandedGroups) {
  if (!grouping.length) return rows;

  var groupingColumnNames = grouping.map(function (columnGrouping) {
    return columnGrouping.columnName;
  });
  var expandedGroupsSet = new Set(expandedGroups);
  var currentGroupExpanded = true;
  var currentGroupLevel = 0;

  return rows.reduce(function (acc, row) {
    if (!row[GRID_GROUP_CHECK]) {
      if (currentGroupExpanded) {
        acc.push(row);
      } else {
        acc[acc.length - 1].collapsedRows.push(row);
      }
      return acc;
    }

    var groupLevel = groupingColumnNames.indexOf(row.groupedBy);
    if (groupLevel > currentGroupLevel && !currentGroupExpanded) {
      return acc;
    }

    currentGroupExpanded = expandedGroupsSet.has(row.compoundKey);
    currentGroupLevel = groupLevel;

    if (currentGroupExpanded) {
      acc.push(row);
    } else {
      acc.push(_extends({}, row, {
        collapsedRows: []
      }));
    }

    return acc;
  }, []);
};

var customGroupedRows = function customGroupedRows(currentRows, grouping, getChildGroups) {
  var rootRows = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : currentRows;
  var keyPrefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

  if (!currentRows || !currentRows.length) return [];
  if (!grouping.length) return currentRows;

  var groupedBy = grouping[0].columnName;
  var nestedGrouping = grouping.slice(1);
  return getChildGroups(currentRows, grouping[0], rootRows).reduce(function (acc, _ref) {
    var _acc$push;

    var key = _ref.key,
        _ref$value = _ref.value,
        value = _ref$value === undefined ? key : _ref$value,
        childRows = _ref.childRows;

    var compoundKey = '' + keyPrefix + key;
    acc.push((_acc$push = {}, defineProperty(_acc$push, GRID_GROUP_CHECK, true), defineProperty(_acc$push, GRID_GROUP_LEVEL_KEY, GRID_GROUP_TYPE + '_' + groupedBy), defineProperty(_acc$push, 'groupedBy', groupedBy), defineProperty(_acc$push, 'compoundKey', compoundKey), defineProperty(_acc$push, 'key', key), defineProperty(_acc$push, 'value', value), _acc$push));
    acc.push.apply(acc, toConsumableArray(customGroupedRows(childRows, nestedGrouping, getChildGroups, rootRows, '' + compoundKey + GROUP_KEY_SEPARATOR)));
    return acc;
  }, []);
};

var customGroupingRowIdGetter = function customGroupingRowIdGetter(getRowId, rows) {
  var firstRow = rows.find(function (row) {
    return !row[GRID_GROUP_CHECK];
  });
  if (!firstRow || getRowId(firstRow)) {
    return getRowId;
  }
  var map = new Map(rows.filter(function (row) {
    return !row[GRID_GROUP_CHECK];
  }).map(function (row, rowIndex) {
    return [row, rowIndex];
  }));

  return function (row) {
    return map.get(row);
  };
};

var groupingPanelItems = function groupingPanelItems(columns, grouping, draftGrouping) {
  var items = draftGrouping.map(function (_ref) {
    var columnName = _ref.columnName;
    return {
      column: columns.find(function (c) {
        return c.name === columnName;
      }),
      draft: !grouping.some(function (columnGrouping) {
        return columnGrouping.columnName === columnName;
      })
    };
  });

  grouping.forEach(function (_ref2, index) {
    var columnName = _ref2.columnName;

    if (draftGrouping.some(function (columnGrouping) {
      return columnGrouping.columnName === columnName;
    })) return;
    items.splice(index, 0, {
      column: columns.find(function (c) {
        return c.name === columnName;
      }),
      draft: true
    });
  });

  return items;
};

var setCurrentPage = function setCurrentPage(prevPage, page) {
  return page;
};
var setPageSize = function setPageSize(prevPageSize, size) {
  return size;
};

var PAGE_HEADERS_OVERFLOW_ERROR = 'Max row level exceeds the page size. Consider increasing the page size.';

var paginatedRows = function paginatedRows(rows, pageSize, page) {
  return pageSize ? rows.slice(pageSize * page, pageSize * (page + 1)) : rows;
};

var rowsWithPageHeaders = function rowsWithPageHeaders(rows, pageSize, getRowLevelKey) {
  if (!pageSize || !getRowLevelKey) return rows;

  var result = rows.slice();

  var headerRows = [];
  var currentIndex = 0;

  var _loop = function _loop() {
    var row = result[currentIndex];
    var levelKey = getRowLevelKey(row);
    if (levelKey) {
      var headerIndex = headerRows.findIndex(function (headerRow) {
        return getRowLevelKey(headerRow) === levelKey;
      });
      if (headerIndex === -1) {
        headerRows = [].concat(toConsumableArray(headerRows), [row]);
      } else {
        headerRows = [].concat(toConsumableArray(headerRows.slice(0, headerIndex)), [row]);
      }
      if (headerRows.length >= pageSize) {
        throw new Error(PAGE_HEADERS_OVERFLOW_ERROR);
      }
    }
    var indexInPage = currentIndex % pageSize;
    if (indexInPage < headerRows.length && row !== headerRows[indexInPage]) {
      result = [].concat(toConsumableArray(result.slice(0, currentIndex)), [headerRows[indexInPage]], toConsumableArray(result.slice(currentIndex)));
    }
    currentIndex += 1;
  };

  while (result.length > currentIndex) {
    _loop();
  }

  return result;
};

var pageCount = function pageCount(count, pageSize) {
  return pageSize ? Math.ceil(count / pageSize) : 1;
};

var rowCount = function rowCount(rows) {
  return rows.length;
};

var firstRowOnPage = function firstRowOnPage(currentPage, pageSize, totalCount) {
  if (totalCount === 0) {
    return 0;
  }
  return pageSize ? currentPage * pageSize + 1 : 1;
};

var lastRowOnPage = function lastRowOnPage(currentPage, pageSize, totalRowCount) {
  var result = totalRowCount;
  if (pageSize) {
    var index = (currentPage + 1) * pageSize;
    result = index > totalRowCount ? totalRowCount : index;
  }

  return result;
};

var toggleSelection = function toggleSelection(selection, _ref) {
  var rowIds = _ref.rowIds,
      state = _ref.state;

  var rowIdsSet = new Set(rowIds);

  var rowsState = state;
  if (rowsState === undefined) {
    var availableSelection = selection.filter(function (rowId) {
      return rowIdsSet.has(rowId);
    });
    rowsState = availableSelection.length !== rowIdsSet.size;
  }

  if (rowsState) {
    var selectionSet = new Set(selection);
    return [].concat(toConsumableArray(selection), toConsumableArray(rowIds.filter(function (rowId) {
      return !selectionSet.has(rowId);
    })));
  }

  return selection.filter(function (rowId) {
    return !rowIdsSet.has(rowId);
  });
};

var rowsWithAvailableToSelect = function rowsWithAvailableToSelect(rows, getRowId, isGroupRow) {
  var dataRows = rows;
  if (isGroupRow) {
    dataRows = dataRows.filter(function (row) {
      return !isGroupRow(row);
    });
  }
  return { rows: rows, availableToSelect: dataRows.map(function (row) {
      return getRowId(row);
    }) };
};

var someSelected = function someSelected(_ref, selection) {
  var availableToSelect = _ref.availableToSelect;

  var selectionSet = new Set(selection);

  return availableToSelect.length !== 0 && selectionSet.size !== 0 && availableToSelect.some(function (elem) {
    return selectionSet.has(elem);
  }) && availableToSelect.some(function (elem) {
    return !selectionSet.has(elem);
  });
};

var allSelected = function allSelected(_ref2, selection) {
  var availableToSelect = _ref2.availableToSelect;

  var selectionSet = new Set(selection);

  return selectionSet.size !== 0 && availableToSelect.length !== 0 && !availableToSelect.some(function (elem) {
    return !selectionSet.has(elem);
  });
};

var unwrapSelectedRows = function unwrapSelectedRows(_ref3) {
  var rows = _ref3.rows;
  return rows;
};

var startEditRows = function startEditRows(prevEditingRowIds, _ref) {
  var rowIds = _ref.rowIds;
  return [].concat(toConsumableArray(prevEditingRowIds), toConsumableArray(rowIds));
};

var stopEditRows = function stopEditRows(prevEditingRowIds, _ref2) {
  var rowIds = _ref2.rowIds;

  var rowIdSet = new Set(rowIds);
  return prevEditingRowIds.filter(function (id) {
    return !rowIdSet.has(id);
  });
};

var addRow = function addRow(addedRows) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { row: {} },
      row = _ref3.row;

  return [].concat(toConsumableArray(addedRows), [row]);
};

var changeAddedRow = function changeAddedRow(addedRows, _ref4) {
  var rowId = _ref4.rowId,
      change = _ref4.change;

  var result = addedRows.slice();
  result[rowId] = _extends({}, result[rowId], change);
  return result;
};

var cancelAddedRows = function cancelAddedRows(addedRows, _ref5) {
  var rowIds = _ref5.rowIds;

  var result = [];
  var indexSet = new Set(rowIds);
  addedRows.forEach(function (row, index) {
    if (!indexSet.has(index)) {
      result.push(row);
    }
  });
  return result;
};

var changeRow = function changeRow(prevRowChanges, _ref6) {
  var rowId = _ref6.rowId,
      change = _ref6.change;

  var prevChange = prevRowChanges[rowId] || {};
  return _extends({}, prevRowChanges, defineProperty({}, rowId, _extends({}, prevChange, change)));
};

var cancelChanges = function cancelChanges(prevRowChanges, _ref7) {
  var rowIds = _ref7.rowIds;

  var result = _extends({}, prevRowChanges);
  rowIds.forEach(function (rowId) {
    delete result[rowId];
  });
  return result;
};

var deleteRows = function deleteRows(deletedRowIds, _ref8) {
  var rowIds = _ref8.rowIds;
  return [].concat(toConsumableArray(deletedRowIds), toConsumableArray(rowIds));
};

var cancelDeletedRows = function cancelDeletedRows(deletedRowIds, _ref9) {
  var rowIds = _ref9.rowIds;

  var rowIdSet = new Set(rowIds);
  return deletedRowIds.filter(function (rowId) {
    return !rowIdSet.has(rowId);
  });
};

var changedRowsByIds = function changedRowsByIds(changes, rowIds) {
  var result = {};
  rowIds.forEach(function (rowId) {
    result[rowId] = changes[rowId];
  });
  return result;
};

var addedRowsByIds = function addedRowsByIds(addedRows, rowIds) {
  var rowIdSet = new Set(rowIds);
  var result = [];
  addedRows.forEach(function (row, index) {
    if (rowIdSet.has(index)) {
      result.push(row);
    }
  });
  return result;
};

var defaultCreateRowChange = function defaultCreateRowChange(row, value, columnName) {
  return defineProperty({}, columnName, value);
};
var createRowChangeGetter = function createRowChangeGetter() {
  var createRowChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultCreateRowChange;
  var columnExtensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var map = columnExtensions.reduce(function (acc, columnExtension) {
    if (columnExtension.createRowChange) {
      acc[columnExtension.columnName] = columnExtension.createRowChange;
    }
    return acc;
  }, {});

  return function (row, value, columnName) {
    if (map[columnName]) {
      return map[columnName](row, value, columnName);
    }
    return createRowChange(row, value, columnName);
  };
};

var getRowChange = function getRowChange(rowChanges, rowId) {
  return rowChanges[rowId] || {};
};

var TABLE_REORDERING_TYPE = 'reordering';

var changeColumnOrder = function changeColumnOrder(order, _ref) {
  var sourceColumnName = _ref.sourceColumnName,
      targetColumnName = _ref.targetColumnName;

  var sourceColumnIndex = order.indexOf(sourceColumnName);
  var targetColumnIndex = order.indexOf(targetColumnName);
  var newOrder = order.slice();

  newOrder.splice(sourceColumnIndex, 1);
  newOrder.splice(targetColumnIndex, 0, sourceColumnName);
  return newOrder;
};

var TABLE_DATA_TYPE = 'data';
var TABLE_NODATA_TYPE = 'nodata';

var orderedColumns = function orderedColumns(tableColumns, order) {
  return mergeSort(tableColumns, function (a, b) {
    if (a.type !== TABLE_DATA_TYPE || b.type !== TABLE_DATA_TYPE) return 0;

    var aPos = order.indexOf(a.column.name);
    var bPos = order.indexOf(b.column.name);
    return aPos - bPos;
  });
};

var tableHeaderRowsWithReordering = function tableHeaderRowsWithReordering(tableHeaderRows) {
  return [{
    key: TABLE_REORDERING_TYPE,
    type: TABLE_REORDERING_TYPE,
    height: 0
  }].concat(toConsumableArray(tableHeaderRows));
};

var draftOrder = function draftOrder(order, sourceColumnIndex, targetColumnIndex) {
  if (sourceColumnIndex === -1 || targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
    return order;
  }

  var result = order.slice();
  var sourceColumn = order[sourceColumnIndex];
  result.splice(sourceColumnIndex, 1);
  result.splice(targetColumnIndex, 0, sourceColumn);

  return result;
};

var UNSET_COLUMN_WIDTH_ERROR = ['The "$1" column\'s width is not specified.', 'The TableColumnResizing plugin requires that all columns have the specified width.'].join('\n');

var tableColumnsWithWidths = function tableColumnsWithWidths(tableColumns, columnWidths, draftColumnWidths) {
  return tableColumns.reduce(function (acc, tableColumn) {
    if (tableColumn.type === 'data') {
      var columnName = tableColumn.column.name;
      var isCurrentColumn = function isCurrentColumn(elem) {
        return elem.columnName === columnName;
      };
      var column = draftColumnWidths.find(isCurrentColumn) || columnWidths.find(isCurrentColumn);
      var width = column && column.width;
      if (width === undefined) {
        throw new Error(UNSET_COLUMN_WIDTH_ERROR.replace('$1', columnName));
      }
      acc.push(_extends({}, tableColumn, { width: width }));
    } else {
      acc.push(tableColumn);
    }
    return acc;
  }, []);
};

var MIN_SIZE = 40;

var changeTableColumnWidth = function changeTableColumnWidth(state, _ref) {
  var columnName = _ref.columnName,
      shift = _ref.shift;
  var columnWidths = state.columnWidths;

  var nextColumnWidth = columnWidths.slice();
  var index = nextColumnWidth.findIndex(function (elem) {
    return elem.columnName === columnName;
  });
  var updatedColumn = nextColumnWidth[index];
  var size = Math.max(MIN_SIZE, updatedColumn.width + shift);
  nextColumnWidth.splice(index, 1, { columnName: columnName, width: size });

  return {
    columnWidths: nextColumnWidth
  };
};

var draftTableColumnWidth = function draftTableColumnWidth(state, _ref2) {
  var columnName = _ref2.columnName,
      shift = _ref2.shift;
  var columnWidths = state.columnWidths;

  var updatedColumn = columnWidths.find(function (elem) {
    return elem.columnName === columnName;
  });
  var size = Math.max(MIN_SIZE, updatedColumn.width + shift);

  return {
    draftColumnWidths: [{ columnName: updatedColumn.columnName, width: size }]
  };
};

var cancelTableColumnWidthDraft = function cancelTableColumnWidthDraft() {
  return {
    draftColumnWidths: []
  };
};

var TABLE_EDIT_COMMAND_TYPE = 'editCommand';

var TABLE_ADDED_TYPE = 'added';
var TABLE_EDIT_TYPE = 'edit';

var TABLE_HEADING_TYPE = 'heading';

var isHeadingEditCommandsTableCell = function isHeadingEditCommandsTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_HEADING_TYPE && tableColumn.type === TABLE_EDIT_COMMAND_TYPE;
};
var isEditCommandsTableCell = function isEditCommandsTableCell(tableRow, tableColumn) {
  return (tableRow.type === TABLE_DATA_TYPE || tableRow.type === TABLE_ADDED_TYPE || tableRow.type === TABLE_EDIT_TYPE) && tableColumn.type === TABLE_EDIT_COMMAND_TYPE;
};

var tableColumnsWithEditing = function tableColumnsWithEditing(tableColumns, width) {
  return [{ key: TABLE_EDIT_COMMAND_TYPE, type: TABLE_EDIT_COMMAND_TYPE, width: width }].concat(toConsumableArray(tableColumns));
};

var isEditTableCell = function isEditTableCell(tableRow, tableColumn) {
  return (tableRow.type === TABLE_ADDED_TYPE || tableRow.type === TABLE_EDIT_TYPE) && tableColumn.type === TABLE_DATA_TYPE;
};
var isAddedTableRow = function isAddedTableRow(tableRow) {
  return tableRow.type === TABLE_ADDED_TYPE;
};
var isEditTableRow = function isEditTableRow(tableRow) {
  return tableRow.type === TABLE_EDIT_TYPE;
};

var tableRowsWithEditing = function tableRowsWithEditing(tableRows, editingRowIds, addedRows, rowHeight) {
  var rowIds = new Set(editingRowIds);
  var editedTableRows = tableRows.map(function (tableRow) {
    return tableRow.type === TABLE_DATA_TYPE && rowIds.has(tableRow.rowId) ? _extends({}, tableRow, {
      type: TABLE_EDIT_TYPE,
      height: rowHeight
    }) : tableRow;
  });

  var addedTableRows = addedRows.map(function (row, rowIndex) {
    return {
      key: TABLE_ADDED_TYPE + '_' + rowIndex,
      type: TABLE_ADDED_TYPE,
      rowId: rowIndex,
      height: rowHeight,
      row: row
    };
  });

  return [].concat(toConsumableArray(addedTableRows.reverse()), toConsumableArray(editedTableRows));
};

var TABLE_FILTER_TYPE = 'filter';

var isFilterTableCell = function isFilterTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_FILTER_TYPE && tableColumn.type === TABLE_DATA_TYPE;
};
var isFilterTableRow = function isFilterTableRow(tableRow) {
  return tableRow.type === TABLE_FILTER_TYPE;
};

var tableHeaderRowsWithFilter = function tableHeaderRowsWithFilter(headerRows, rowHeight) {
  return [].concat(toConsumableArray(headerRows), [{ key: TABLE_FILTER_TYPE, type: TABLE_FILTER_TYPE, height: rowHeight }]);
};

var TABLE_GROUP_TYPE = 'group';

var isGroupTableCell = function isGroupTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE && tableRow.row.groupedBy === tableColumn.column.name;
};
var isGroupIndentTableCell = function isGroupIndentTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE && tableRow.row.groupedBy !== tableColumn.column.name;
};
var isGroupTableRow = function isGroupTableRow(tableRow) {
  return tableRow.type === TABLE_GROUP_TYPE;
};

var tableColumnsWithDraftGrouping = function tableColumnsWithDraftGrouping(tableColumns, grouping, draftGrouping, showColumnWhenGrouped) {
  return tableColumns.reduce(function (acc, tableColumn) {
    if (tableColumn.type !== TABLE_DATA_TYPE) {
      acc.push(tableColumn);
      return acc;
    }

    var columnName = tableColumn.column.name;
    var columnGroupingExists = grouping.some(function (columnGrouping) {
      return columnGrouping.columnName === columnName;
    });
    var columnDraftGroupingExists = draftGrouping.some(function (columnGrouping) {
      return columnGrouping.columnName === columnName;
    });

    if (!columnGroupingExists && !columnDraftGroupingExists || showColumnWhenGrouped(columnName)) {
      acc.push(tableColumn);
    } else if (!columnGroupingExists && columnDraftGroupingExists || columnGroupingExists && !columnDraftGroupingExists) {
      acc.push(_extends({}, tableColumn, {
        draft: true
      }));
    }
    return acc;
  }, []);
};

var tableColumnsWithGrouping = function tableColumnsWithGrouping(columns, tableColumns, grouping, draftGrouping, indentColumnWidth, showColumnWhenGrouped) {
  return [].concat(toConsumableArray(grouping.map(function (columnGrouping) {
    var groupedColumn = columns.find(function (column) {
      return column.name === columnGrouping.columnName;
    });
    return {
      key: TABLE_GROUP_TYPE + '_' + groupedColumn.name,
      type: TABLE_GROUP_TYPE,
      column: groupedColumn,
      width: indentColumnWidth
    };
  })), toConsumableArray(tableColumnsWithDraftGrouping(tableColumns, grouping, draftGrouping, showColumnWhenGrouped)));
};

var tableRowsWithGrouping = function tableRowsWithGrouping(tableRows, isGroupRow) {
  return tableRows.map(function (tableRow) {
    if (tableRow.type !== TABLE_DATA_TYPE || !isGroupRow(tableRow.row)) {
      return tableRow;
    }
    return _extends({}, tableRow, {
      key: TABLE_GROUP_TYPE + '_' + tableRow.row.compoundKey,
      type: TABLE_GROUP_TYPE,
      colSpanStart: TABLE_GROUP_TYPE + '_' + tableRow.row.groupedBy
    });
  });
};

var isHeadingTableCell = function isHeadingTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_HEADING_TYPE && tableColumn.type === TABLE_DATA_TYPE;
};

var isHeadingTableRow = function isHeadingTableRow(tableRow) {
  return tableRow.type === TABLE_HEADING_TYPE;
};

var tableRowsWithHeading = function tableRowsWithHeading(headerRows) {
  return [{ key: TABLE_HEADING_TYPE, type: TABLE_HEADING_TYPE }].concat(toConsumableArray(headerRows));
};

var TABLE_DETAIL_TYPE = 'detail';

var isDetailRowExpanded = function isDetailRowExpanded(expandedDetailRowIds, rowId) {
  return expandedDetailRowIds.indexOf(rowId) > -1;
};
var isDetailToggleTableCell = function isDetailToggleTableCell(tableRow, tableColumn) {
  return tableColumn.type === TABLE_DETAIL_TYPE && tableRow.type === TABLE_DATA_TYPE;
};
var isDetailTableRow = function isDetailTableRow(tableRow) {
  return tableRow.type === TABLE_DETAIL_TYPE;
};

var toggleDetailRowExpanded = function toggleDetailRowExpanded(prevExpanded, _ref) {
  var rowId = _ref.rowId,
      state = _ref.state;

  var expandedDetailRowIds = prevExpanded.slice();
  var expandedIndex = expandedDetailRowIds.indexOf(rowId);
  var rowState = state !== undefined ? state : expandedIndex === -1;

  if (expandedIndex > -1 && !rowState) {
    expandedDetailRowIds.splice(expandedIndex, 1);
  } else if (expandedIndex === -1 && rowState) {
    expandedDetailRowIds.push(rowId);
  }

  return expandedDetailRowIds;
};

var tableRowsWithExpandedDetail = function tableRowsWithExpandedDetail(tableRows, expandedDetailRowIds, rowHeight) {
  var result = tableRows;
  expandedDetailRowIds.forEach(function (expandedRowId) {
    var rowIndex = result.findIndex(function (tableRow) {
      return tableRow.type === TABLE_DATA_TYPE && tableRow.rowId === expandedRowId;
    });
    if (rowIndex === -1) return;
    var insertIndex = rowIndex + 1;
    var _result$rowIndex = result[rowIndex],
        row = _result$rowIndex.row,
        rowId = _result$rowIndex.rowId;

    result = [].concat(toConsumableArray(result.slice(0, insertIndex)), [{
      key: TABLE_DETAIL_TYPE + '_' + rowId,
      type: TABLE_DETAIL_TYPE,
      rowId: rowId,
      row: row,
      colSpanStart: 0,
      height: rowHeight
    }], toConsumableArray(result.slice(insertIndex)));
  });
  return result;
};

var tableColumnsWithDetail = function tableColumnsWithDetail(tableColumns, toggleColumnWidth) {
  return [{ key: TABLE_DETAIL_TYPE, type: TABLE_DETAIL_TYPE, width: toggleColumnWidth }].concat(toConsumableArray(tableColumns));
};

var TABLE_SELECT_TYPE = 'select';

var isSelectTableCell = function isSelectTableCell(tableRow, tableColumn) {
  return tableColumn.type === TABLE_SELECT_TYPE && tableRow.type === TABLE_DATA_TYPE;
};
var isSelectAllTableCell = function isSelectAllTableCell(tableRow, tableColumn) {
  return tableColumn.type === TABLE_SELECT_TYPE && tableRow.type === TABLE_HEADING_TYPE;
};

var tableColumnsWithSelection = function tableColumnsWithSelection(tableColumns, selectionColumnWidth) {
  return [{ key: TABLE_SELECT_TYPE, type: TABLE_SELECT_TYPE, width: selectionColumnWidth }].concat(toConsumableArray(tableColumns));
};

var isNoDataTableRow = function isNoDataTableRow(tableRow) {
  return tableRow.type === TABLE_NODATA_TYPE;
};
var isDataTableCell = function isDataTableCell(tableRow, tableColumn) {
  return tableRow.type === TABLE_DATA_TYPE && tableColumn.type === TABLE_DATA_TYPE;
};
var isHeaderStubTableCell = function isHeaderStubTableCell(tableRow, headerRows) {
  return headerRows.indexOf(tableRow) > -1;
};
var isDataTableRow = function isDataTableRow(tableRow) {
  return tableRow.type === TABLE_DATA_TYPE;
};

var getColumnExtension = function getColumnExtension(columnExtensions, columnName) {
  if (!columnExtensions) {
    return {};
  }
  var columnExtension = columnExtensions.find(function (extension) {
    return extension.columnName === columnName;
  });
  if (!columnExtension) {
    return {};
  }
  return columnExtension;
};

var getColumnExtensionValueGetter = function getColumnExtensionValueGetter(columnExtensions, extensionName, defaultValue) {
  return function (columnName) {
    if (columnExtensions) {
      var columnExtension = getColumnExtension(columnExtensions, columnName);
      var extensionValue = columnExtension[extensionName];
      return extensionValue !== undefined ? extensionValue : defaultValue;
    }
    return defaultValue;
  };
};

var tableColumnsWithDataRows = function tableColumnsWithDataRows(columns, columnExtensions) {
  return columns.map(function (column) {
    var name = column.name;

    var columnExtension = getColumnExtension(columnExtensions, name);
    return {
      key: TABLE_DATA_TYPE + '_' + name,
      type: TABLE_DATA_TYPE,
      width: columnExtension.width,
      align: columnExtension.align,
      column: column
    };
  });
};

var tableRowsWithDataRows = function tableRowsWithDataRows(rows, getRowId) {
  return !rows.length ? [{ key: TABLE_NODATA_TYPE, type: TABLE_NODATA_TYPE, colSpanStart: 0 }] : rows.map(function (row) {
    var rowId = getRowId(row);
    return {
      row: row,
      rowId: rowId,
      type: TABLE_DATA_TYPE,
      key: TABLE_DATA_TYPE + '_' + rowId
    };
  });
};

var visibleTableColumns = function visibleTableColumns(tableColumns, hiddenColumnNames) {
  return tableColumns.filter(function (tableColumn) {
    return tableColumn.type !== TABLE_DATA_TYPE || hiddenColumnNames.indexOf(tableColumn.column.name) === -1;
  });
};

var tableDataColumnsExist = function tableDataColumnsExist(tableColumns) {
  return tableColumns.some(function (column) {
    return column.type === TABLE_DATA_TYPE;
  });
};

var columnChooserItems = function columnChooserItems(columns, hiddenColumnNames) {
  return columns.map(function (column) {
    return { column: column, hidden: hiddenColumnNames.indexOf(column.name) !== -1 };
  });
};

var toggleColumn = function toggleColumn(hiddenColumnNames, columnName) {
  return hiddenColumnNames.indexOf(columnName) === -1 ? [].concat(toConsumableArray(hiddenColumnNames), [columnName]) : hiddenColumnNames.filter(function (hiddenColumn) {
    return hiddenColumn !== columnName;
  });
};

var changeSearchValue = function changeSearchValue(prevSearchValue, searchValue) {
  return searchValue;
};

var pushSearchFilterExpression = function pushSearchFilterExpression(searchValue) {
  return function (_ref) {
    var filterExpression = _ref.filterExpression,
        columns = _ref.columns;

    var filters = columns.map(function (_ref2) {
      var name = _ref2.name;
      return { columnName: name, value: searchValue };
    });
    var selfFilterExpression = { operator: 'or', filters: filters };
    if (!filterExpression) {
      return selfFilterExpression;
    }
    return {
      operator: 'and',
      filters: [filterExpression, selfFilterExpression]
    };
  };
};

var getTargetColumnGeometries = function getTargetColumnGeometries(columnGeometries, sourceIndex) {
  var sourceWidth = columnGeometries[sourceIndex].right - columnGeometries[sourceIndex].left;
  var getWidthDifference = function getWidthDifference(index) {
    return columnGeometries[index].right - columnGeometries[index].left - sourceWidth;
  };

  return columnGeometries.map(function (_ref, targetIndex) {
    var top = _ref.top,
        right = _ref.right,
        bottom = _ref.bottom,
        left = _ref.left;

    var leftBorder = left;
    if (targetIndex > 0 && targetIndex <= sourceIndex) {
      leftBorder = Math.min(leftBorder, leftBorder - getWidthDifference(targetIndex - 1));
    }
    if (targetIndex > sourceIndex) {
      leftBorder = Math.max(leftBorder, leftBorder + getWidthDifference(targetIndex));
    }
    var rightBorder = right;
    if (targetIndex < columnGeometries.length - 1 && targetIndex >= sourceIndex) {
      rightBorder = Math.max(rightBorder, rightBorder + getWidthDifference(targetIndex + 1));
    }
    if (targetIndex < sourceIndex) {
      rightBorder = Math.min(rightBorder, rightBorder - getWidthDifference(targetIndex));
    }

    return {
      top: top,
      right: rightBorder,
      bottom: bottom,
      left: leftBorder
    };
  });
};

var getTableRowColumnsWithColSpan = function getTableRowColumnsWithColSpan(tableColumns, colSpanStart) {
  if (colSpanStart === undefined) return tableColumns;

  var span = false;
  return tableColumns.reduce(function (acc, tableColumn, columnIndex) {
    if (span) return acc;
    if (columnIndex === colSpanStart || tableColumn.key === colSpanStart) {
      span = true;
      return [].concat(toConsumableArray(acc), [_extends({}, tableColumn, { colSpan: tableColumns.length - columnIndex })]);
    }
    return [].concat(toConsumableArray(acc), [tableColumn]);
  }, []);
};

var getTableColumnGeometries = function getTableColumnGeometries(columns, tableWidth) {
  var columnWidths = columns.map(function (column) {
    return column.width;
  });

  var freeSpace = tableWidth;
  var restrictedSpace = columnWidths.reduce(function (accum, width) {
    return accum + (width || 0);
  }, 0);
  var freeSpacePortions = columnWidths.reduce(function (accum, width) {
    return accum + (width === undefined ? 1 : 0);
  }, 0);
  var freeSpacePortion = (freeSpace - restrictedSpace) / freeSpacePortions;

  var lastRightPosition = 0;
  return columnWidths.map(function (width) {
    return width === undefined ? freeSpacePortion : width;
  }).map(function (width) {
    lastRightPosition += width;
    return {
      left: lastRightPosition - width,
      right: lastRightPosition
    };
  });
};

var getTableTargetColumnIndex = function getTableTargetColumnIndex(columnGeometries, sourceIndex, offset) {
  return getTargetColumnGeometries(columnGeometries, sourceIndex).findIndex(function (_ref) {
    var left = _ref.left,
        right = _ref.right;
    return offset > left && offset < right;
  });
};

var ANIMATION_DURATION = 200;

var getAnimationProgress = function getAnimationProgress(animation) {
  return (new Date().getTime() - animation.startTime) / ANIMATION_DURATION;
};

var getAnimations = function getAnimations(prevColumns, nextColumns, tableWidth, prevAnimations) {
  var prevColumnGeometries = new Map(getTableColumnGeometries(prevColumns, tableWidth).map(function (geometry, index) {
    return [prevColumns[index].key, geometry];
  }).map(function (_ref2) {
    var _ref3 = slicedToArray(_ref2, 2),
        key = _ref3[0],
        geometry = _ref3[1];

    var animation = prevAnimations.get(key);
    if (!animation) return [key, geometry];
    var progress = easeOutCubic(getAnimationProgress(animation));
    var left = (animation.left.to - animation.left.from) * progress + animation.left.from;
    return [key, {
      left: left,
      right: geometry.right - (geometry.left - left)
    }];
  }));

  var nextColumnGeometries = new Map(getTableColumnGeometries(nextColumns, tableWidth).map(function (geometry, index) {
    return [nextColumns[index].key, geometry];
  }));

  return new Map([].concat(toConsumableArray(nextColumnGeometries.keys())).map(function (key) {
    var prev = prevColumnGeometries.get(key);
    var next = nextColumnGeometries.get(key);

    var result = { startTime: new Date().getTime(), style: {} };
    if (Math.abs(prev.left - next.left) > 1) {
      result.left = { from: prev.left, to: next.left };
    }
    return [key, result];
  }).filter(function (animation) {
    return animation[1].left;
  }));
};

var filterActiveAnimations = function filterActiveAnimations(animations) {
  return new Map([].concat(toConsumableArray(animations.entries())).filter(function (_ref4) {
    var _ref5 = slicedToArray(_ref4, 2),
        animation = _ref5[1];

    return getAnimationProgress(animation) < 1;
  }));
};

var evalAnimations = function evalAnimations(animations) {
  return new Map([].concat(toConsumableArray(animations.entries())).map(function (_ref6) {
    var _ref7 = slicedToArray(_ref6, 2),
        key = _ref7[0],
        animation = _ref7[1];

    var progress = easeOutCubic(getAnimationProgress(animation));
    var result = _extends({}, animation.style);
    if (animation.left) {
      var offset = (animation.left.to - animation.left.from) * (progress - 1);
      result.transform = 'translateX(' + offset + 'px)';
    }
    return [key, result];
  }));
};

var isOnTheSameLine = function isOnTheSameLine(geometry, y) {
  return y >= geometry.top && y <= geometry.bottom;
};

var rectToObject = function rectToObject(_ref) {
  var top = _ref.top,
      right = _ref.right,
      bottom = _ref.bottom,
      left = _ref.left;
  return {
    top: top, right: right, bottom: bottom, left: left
  };
};

var collapseGapsBetweenItems = function collapseGapsBetweenItems(geometries) {
  return geometries.map(function (geometry, index) {
    if (index !== geometries.length - 1 && geometry.top === geometries[index + 1].top) {
      return _extends({}, geometry, {
        right: geometries[index + 1].left
      });
    }
    return geometry;
  });
};

var getGroupCellTargetIndex = function getGroupCellTargetIndex(geometries, sourceIndex, _ref2) {
  var x = _ref2.x,
      y = _ref2.y;

  if (geometries.length === 0) return 0;

  var targetGeometries = sourceIndex !== -1 ? getTargetColumnGeometries(geometries, sourceIndex) : geometries.map(rectToObject);

  var targetIndex = collapseGapsBetweenItems(targetGeometries).findIndex(function (geometry, index) {
    var inVerticalBounds = isOnTheSameLine(geometry, y);
    var inHorizontalBounds = x >= geometry.left && x <= geometry.right;
    var shouldGoFirst = index === 0 && x < geometry.left;
    var shouldGoOnLineBreak = !inVerticalBounds && !!geometries[index - 1] && isOnTheSameLine(geometries[index - 1], y);

    return inVerticalBounds && inHorizontalBounds || shouldGoFirst || shouldGoOnLineBreak;
  });

  return targetIndex === -1 ? geometries.length : targetIndex;
};

var processPattern = function processPattern(pattern, params) {
  return Object.keys(params).reduce(function (msg, key) {
    return msg.replace('{' + key + '}', params[key]);
  }, pattern);
};

var getMessagesFormatter = function getMessagesFormatter(messages) {
  return function (key, params) {
    var message = messages[key];

    if (typeof message === 'function') {
      return message(params);
    }
    if (params) {
      return processPattern(message, params);
    }
    return message;
  };
};

return { getColumnExtension:getColumnExtension, getColumnExtensionValueGetter:getColumnExtensionValueGetter
	, getTableRowColumnsWithColSpan:getTableRowColumnsWithColSpan, getTableColumnGeometries:getTableColumnGeometries
	, getTableTargetColumnIndex:getTableTargetColumnIndex, getAnimations:getAnimations
	, filterActiveAnimations:filterActiveAnimations, evalAnimations:evalAnimations, getGroupCellTargetIndex:getGroupCellTargetIndex
	, getMessagesFormatter:getMessagesFormatter, rowIdGetter:rowIdGetter, cellValueGetter:cellValueGetter
	, changeColumnSorting:changeColumnSorting, getColumnSortingDirection:getColumnSortingDirection, getPersistentSortedColumns:getPersistentSortedColumns
	, calculateKeepOther:calculateKeepOther, sortedRows:sortedRows, changeColumnFilter:changeColumnFilter, pushFilterExpression:pushFilterExpression
	, getColumnFilterConfig:getColumnFilterConfig, filteredRows:filteredRows, GROUP_KEY_SEPARATOR:GROUP_KEY_SEPARATOR
	, changeColumnGrouping:changeColumnGrouping, toggleExpandedGroups:toggleExpandedGroups, draftColumnGrouping:draftColumnGrouping
	, cancelColumnGroupingDraft:cancelColumnGroupingDraft, groupRowChecker:groupRowChecker, groupRowLevelKeyGetter:groupRowLevelKeyGetter
	, groupedRows:groupedRows, expandedGroupRows:expandedGroupRows, customGroupedRows:customGroupedRows
	, customGroupingRowIdGetter:customGroupingRowIdGetter, groupingPanelItems:groupingPanelItems, setCurrentPage:setCurrentPage
	, setPageSize:setPageSize, paginatedRows:paginatedRows, rowsWithPageHeaders:rowsWithPageHeaders, pageCount:pageCount
	, rowCount:rowCount, firstRowOnPage:firstRowOnPage, lastRowOnPage:lastRowOnPage, toggleSelection:toggleSelection
	, rowsWithAvailableToSelect:rowsWithAvailableToSelect, someSelected:someSelected, allSelected:allSelected
	, unwrapSelectedRows:unwrapSelectedRows, startEditRows:startEditRows, stopEditRows:stopEditRows, addRow:addRow
	, changeAddedRow:changeAddedRow, cancelAddedRows:cancelAddedRows, changeRow:changeRow, cancelChanges:cancelChanges
	, deleteRows:deleteRows, cancelDeletedRows:cancelDeletedRows, changedRowsByIds:changedRowsByIds, addedRowsByIds:addedRowsByIds
	, createRowChangeGetter:createRowChangeGetter, getRowChange:getRowChange, TABLE_REORDERING_TYPE:TABLE_REORDERING_TYPE
	, changeColumnOrder:changeColumnOrder, orderedColumns:orderedColumns, tableHeaderRowsWithReordering:tableHeaderRowsWithReordering
	, draftOrder:draftOrder, tableColumnsWithWidths:tableColumnsWithWidths, changeTableColumnWidth:changeTableColumnWidth
	, draftTableColumnWidth:draftTableColumnWidth, cancelTableColumnWidthDraft:cancelTableColumnWidthDraft
	, TABLE_EDIT_COMMAND_TYPE:TABLE_EDIT_COMMAND_TYPE, isHeadingEditCommandsTableCell:isHeadingEditCommandsTableCell
	, isEditCommandsTableCell:isEditCommandsTableCell, tableColumnsWithEditing:tableColumnsWithEditing
	, TABLE_ADDED_TYPE:TABLE_ADDED_TYPE, TABLE_EDIT_TYPE:TABLE_EDIT_TYPE, isEditTableCell:isEditTableCell
	, isAddedTableRow:isAddedTableRow, isEditTableRow:isEditTableRow, tableRowsWithEditing:tableRowsWithEditing
	, TABLE_FILTER_TYPE:TABLE_FILTER_TYPE, isFilterTableCell:isFilterTableCell, isFilterTableRow:isFilterTableRow
	, tableHeaderRowsWithFilter:tableHeaderRowsWithFilter, TABLE_GROUP_TYPE:TABLE_GROUP_TYPE, isGroupTableCell:isGroupTableCell
	, isGroupIndentTableCell:isGroupIndentTableCell, isGroupTableRow:isGroupTableRow, tableColumnsWithGrouping:tableColumnsWithGrouping
	, tableRowsWithGrouping:tableRowsWithGrouping, TABLE_HEADING_TYPE:TABLE_HEADING_TYPE, isHeadingTableCell:isHeadingTableCell
	, isHeadingTableRow:isHeadingTableRow, tableRowsWithHeading:tableRowsWithHeading, TABLE_DETAIL_TYPE:TABLE_DETAIL_TYPE
	, isDetailRowExpanded:isDetailRowExpanded, isDetailToggleTableCell:isDetailToggleTableCell, isDetailTableRow:isDetailTableRow
	, toggleDetailRowExpanded:toggleDetailRowExpanded, tableRowsWithExpandedDetail:tableRowsWithExpandedDetail, tableColumnsWithDetail:tableColumnsWithDetail
	, TABLE_SELECT_TYPE:TABLE_SELECT_TYPE, isSelectTableCell:isSelectTableCell, isSelectAllTableCell:isSelectAllTableCell
	, tableColumnsWithSelection:tableColumnsWithSelection, TABLE_DATA_TYPE:TABLE_DATA_TYPE, TABLE_NODATA_TYPE:TABLE_NODATA_TYPE
	, isNoDataTableRow:isNoDataTableRow, isDataTableCell:isDataTableCell, isHeaderStubTableCell:isHeaderStubTableCell
	, isDataTableRow:isDataTableRow, tableColumnsWithDataRows:tableColumnsWithDataRows, tableRowsWithDataRows:tableRowsWithDataRows
	, visibleTableColumns:visibleTableColumns, tableDataColumnsExist:tableDataColumnsExist, columnChooserItems:columnChooserItems
	, toggleColumn:toggleColumn, changeSearchValue:changeSearchValue, pushSearchFilterExpression:pushSearchFilterExpression };
}();
//# sourceMappingURL=dx-grid-core.es.js.map
