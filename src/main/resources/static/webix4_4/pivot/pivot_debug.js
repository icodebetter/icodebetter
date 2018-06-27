/*
@license
Webix Pivot v.4.4.7
This software is covered by Webix Trial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
! function(t) {
	function e(o) {
		if (i[o]) return i[o].exports;
		var n = i[o] = {
			exports: {},
			id: o,
			loaded: !1
		};
		return t[o].call(n.exports, n, n.exports, e), n.loaded = !0, n.exports
	}
	var i = {};
	return e.m = t, e.c = i, e.p = "/codebase/", e(0)
}([function(t, e, i) {
	"use strict";
	i(3), i(5), i(6), i(7), i(29)
}, , , function(t, e) {
	"use strict"
}, , function(t, e) {
	"use strict";
	webix.i18n.pivot = webix.extend(webix.i18n.pivot || {}, {
		apply: "Apply",
		bar: "Bar",
		cancel: "Cancel",
		chartType: "Chart type",
		columns: "Columns",
		count: "count",
		date: "date",
		fields: "Fields",
		filters: "Filters",
		groupBy: "Group By",
		line: "Line",
		logScale: "Logarithmic scale",
		max: "max",
		min: "min",
		multicombo: "multi-select",
		operationNotDefined: "Operation is not defined",
		layoutIncorrect: "pivotLayout should be an Array instance",
		pivotMessage: "[Click to configure]",
		popupHeader: "Pivot Settings",
		radar: "Radar",
		radarArea: "Area Radar",
		rows: "Rows",
		select: "select",
		settings: "Settings",
		stackedBar: "Stacked Bar",
		sum: "sum",
		text: "text",
		total: "Total",
		values: "Values",
		valuesNotDefined: "Values or Group field are not defined",
		windowTitle: "Pivot Configuration",
		windowMessage: "move fields into a required sector"
	})
}, function(t, e) {
	"use strict";
	webix.protoUI({
		name: "webix_pivot_popup",
		_selected: null,
		defaults: {
			autoheight: !0,
			padding: 0
		},
		$init: function(t) {
			webix.extend(t, this._get_ui(t)), this.$ready.push(this._after_init)
		},
		_get_ui: function(t) {
			return {
				body: {
					id: "list",
					view: "list",
					borderless: !0,
					autoheight: !0,
					template: "#title#",
					data: t.data
				}
			}
		},
		_after_init: function() {
			this.attachEvent("onItemClick", function(t) {
				this._selected = this.$eventSource.getItem(t), this.hide()
			})
		},
		getSelected: function() {
			return this._selected
		}
	}, webix.ui.popup, webix.IdSpace)
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}
	var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		},
		r = i(8),
		a = o(r);
	i(9);
	var s = i(15),
		l = o(s),
		u = i(16),
		c = o(u),
		p = i(25),
		f = i(26),
		d = i(27),
		h = o(d),
		v = i(28);
	webix.protoUI({
		name: "pivot",
		version: "{{version}}",
		defaults: p.defaults,
		$init: function(t) {
			this.$view.className += " webix_pivot", this.data.provideApi(this, !0), this._setConfig(t), this._initDataStore(t), this.$separator = this.$divider, this.filters = new v.Filters
		},
		$divider: "_'_",
		_initDataStore: function(t) {
			t.externalProcessing ? h.init(this, t) : (this.data.attachEvent("onStoreUpdated", webix.bind(function() {
				this.$$("data") && this.render()
			}, this)), this.attachEvent("onFilterChange", function() {
				this.render(!0)
			}), this.$ready.push(this.render))
		},
		_setConfig: function(t) {
			t.structure || (t.structure = {}), webix.extend(t.structure, {
				rows: [],
				columns: [],
				values: [],
				filters: []
			}), webix.extend(t, this._getUI(t))
		},
		_getUI: function(t) {
			var e = {
					id: "filters",
					view: "toolbar",
					hidden: !0,
					cols: [{}]
				},
				i = {
					view: "treetable",
					id: "data",
					select: "row",
					navigation: !0,
					leftSplit: 1,
					resizeColumn: !0,
					on: {
						onHeaderClick: function(t) {
							var e = this.getTopParentView();
							0 !== this.getColumnIndex(t.column) || e.config.readonly || e.configure()
						}
					},
					columns: []
				};
			return t.datatable && "object" == n(t.datatable) && (delete t.datatable.id, webix.extend(i, t.datatable, !0)), {
				rows: [e, i]
			}
		},
		configure: function() {
			this._configPopup || this._createPopup();
			var t = [];
			for (var e in this.operations) t.push({
				name: e,
				title: this._applyLocale(e)
			});
			this._configPopup.define("operations", t);
			var i = webix.html.offset(this.$$("data").getNode());
			this._configPopup.setPosition(i.x + 10, i.y + 10), this._configPopup.define("data", this.getFields()), this._configPopup.show()
		},
		_createPopup: function() {
			var t = {
				view: "webix_pivot_config",
				operations: [],
				pivot: this.config.id
			};
			webix.extend(t, this.config.popup || {}), this._configPopup = webix.ui(t), this.callEvent("onPopup", [this._configPopup]), this._configPopup.attachEvent("onApply", webix.bind(this.setStructure, this))
		},
		destructor: function() {
			this._configPopup && (this._configPopup.destructor(), this._configPopup = null), webix.Destruction.destructor.call(this)
		},
		getFilterView: function() {
			return this.$$("filters")
		},
		render: function(t) {
			var e = this;
			webix.debug_pivot && window.console.time("pivot:full-processing"), this._getPivotData || webix.extend(this, new c._Pivot(this.config, this)), a.formatFilterValues(this.config.structure.filters), this._getPivotData(this.data.pull, this.data.order, function(i) {
				e._setData(i, t), webix.debug_pivot && webix.delay(function() {
					window.console.timeEnd("pivot:full-processing"), window.console.timeEnd("pivot:rendering")
				})
			})
		},
		_setData: function(t, e) {
			(0, f.setColumns)(this, t.header), e || (t.filters = a.processFilters(this)), this.callEvent("onBeforeRender", [t]), t.filters && a.showFilters(this, t.filters), this.config.readonly && (this.$$("data").$view.className += " webix_pivot_readonly"), this.config.totalColumn && this.$$("data").define("math", !0), this.config.footer && this.$$("data").define("footer", !0), webix.debug_pivot && window.console.time("pivot:rendering"), this.$$("data").clearAll(), this.$$("data").config.columns = t.header, this.$$("data").config.rightSplit = 0, this.$$("data").refreshColumns(), this.$$("data").parse(t.data), l.freezeTotals(this)
		},
		$exportView: function(t) {
			if (t.flatTree) {
				"object" !== n(t.flatTree) && (t.flatTree = {});
				var e = t.flatTree;
				if (e.id = this.$$("data").config.columns[0].id, !e.columns) {
					var i = this.config.structure.rows;
					e.columns = [];
					for (var o = 0; o < i.length; o++) e.columns.push({
						header: this._applyMap(i[o])
					})
				}
			}
			return webix.extend(t, {
				filterHTML: !0
			}), this.$$("data")
		},
		_applyLocale: function(t) {
			return webix.i18n.pivot[t] || t
		},
		_applyMap: function(t) {
			return this.config.fieldMap[t] || t
		},
		getFields: function() {
			var t, e, i, o, r = [],
				a = {},
				s = {},
				l = this.config.structure,
				u = {
					fields: [],
					rows: [],
					columns: [],
					values: [],
					filters: []
				},
				c = {};
			if (this._pivotFields)
				for (r = this._pivotFields, t = 0; t < r.length; t++) a[r[t]] = webix.uid();
			else
				for (t = 0; t < Math.min(this.data.count() || 5); t++) {
					i = this.data.getItem(this.data.getIdByIndex(t));
					for (e in i) "id" === e || 0 === e.indexOf("$") || a[e] || (r.push(e), a[e] = webix.uid())
				}
			for (t = 0; t < (l.filters || []).length; t++) e = l.filters[t], webix.isUndefined(a[e.name]) || (o = this._applyMap(e.name), u.filters.push({
				name: e.name,
				text: o,
				type: e.type,
				value: e.value,
				id: a[e.name]
			}));
			for (t = 0; t < l.rows.length; t++) e = l.rows[t], webix.isUndefined(a[e]) || (u.rows.push({
				name: e,
				text: this._applyMap(e),
				id: a[e]
			}), s[e] = !0);
			for (t = 0; t < l.columns.length; t++) e = "object" == n(l.columns[t]) ? l.columns[t].id || t : l.columns[t], !webix.isUndefined(a[e]) && webix.isUndefined(s[e]) && u.columns.push({
				name: e,
				text: this._applyMap(e),
				id: a[e]
			});
			for (t = 0; t < l.values.length; t++)
				if (e = l.values[t], !webix.isUndefined(a[e.name]))
					if (webix.isUndefined(c[e.name])) {
						c[e.name] = t, o = this._applyMap(e.name);
						var p = {
							name: e.name,
							text: o,
							id: a[e.name],
							operation: webix.isArray(e.operation) ? e.operation : [e.operation]
						};
						u.values.push(p)
					} else {
						var f = c[e.name];
						u.values[f].operation.push(e.operation)
					}
			for (r.sort(), t = 0; t < r.length; t++) e = r[t], webix.isUndefined(a[e]) || u.fields.push({
				name: e,
				text: this._applyMap(e),
				id: a[e]
			});
			return u
		},
		setStructure: function(t) {
			this.define("structure", t), this.render()
		},
		getStructure: function() {
			return this.config.structure
		},
		getConfigWindow: function() {
			return this._configPopup
		},
		profile_setter: function(t) {
			var e = window.console;
			t && (this.attachEvent("onBeforeLoad", function() {
				e.time("data loading")
			}), this.data.attachEvent("onParse", function() {
				e.timeEnd("data loading"), e.time("data parsing")
			}), this.data.attachEvent("onStoreLoad", function() {
				e.timeEnd("data parsing"), e.time("data processing")
			}), this.$ready.push(function() {
				this.$$("data").attachEvent("onBeforeRender", function() {
					this.count() && (e.timeEnd("data processing"), e.time("data rendering"))
				}), this.$$("data").attachEvent("onAfterRender", function() {
					this.count() && webix.delay(function() {
						e.timeEnd("data rendering")
					})
				})
			}))
		}
	}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings)
}, function(t, e) {
	"use strict";

	function i(t) {
		t = t || [];
		for (var e = 0; e < t.length; e++) t[e].fvalue = o(t[e].value)
	}

	function o(t) {
		return t = t || "", webix.isDate(t) ? t = t.valueOf().toString() : "string" == typeof t && t.trim && (t = t.trim()), t
	}

	function n(t) {
		var e, i, o, n = t.config,
			a = n.structure.filters || [],
			s = [],
			l = {};
		for (e = 0; e < a.length; e++) i = a[e], webix.isUndefined(l[i.type]) && (l[i.type] = []), l[i.type].push(e), o = {
			value: webix.isUndefined(i.value) ? "" : i.value,
			label: t._applyMap(i.name),
			field: i.name,
			view: i.type,
			labelAlign: n.filterLabelAlign,
			labelWidth: n.filterLabelWidth,
			minWidth: n.filterMinWidth,
			maxWidth: n.filterWidth
		}, n.filterPlaceholder && ("boolean" == typeof n.filterPlaceholder ? (o.placeholder = o.label, o.label = "") : o.placeholder = n.filterPlaceholder), "multicombo" == i.type && (o.tagMode = !1), t.filters.isSelect(i.type) && (o.options = r(t, i.name, i.type.indexOf("multi") == -1)), t.callEvent("onFilterCreate", [i, o]) && s.push(o);
		return s
	}

	function r(t, e, i) {
		var o, n = [],
			r = t.data.pull,
			a = {};
		if (i && n.push({
				value: "",
				id: ""
			}), t._pivotOptions && t._pivotOptions[e]) return n.concat(t._pivotOptions[e]);
		for (var s in r) o = r[s][e], webix.isUndefined(o) || !o && 0 !== o || a[o] || (n.push({
			value: o.toString(),
			id: o.toString()
		}), a[o] = !0);
		var l = function(t) {
			return !isNaN(parseFloat(t))
		};
		return n.sort(function(t, e) {
			var i = t.value,
				o = e.value;
			return o ? i ? (l(i) && l(o) || (i = i.toString().toLowerCase(), o = o.toString().toLowerCase()), i > o ? 1 : i < o ? -1 : 0) : -1 : 1
		}), n
	}

	function a(t, e) {
		s(t, e);
		var i = {
			elements: e
		};
		t.callEvent("onViewInit", ["filters", i]), i.elements && t.getFilterView() && (e.length > 0 ? (t.getFilterView().show(), webix.ui(e, t.getFilterView())) : t.getFilterView().hide())
	}

	function s(t, e) {
		for (var i = 0; i < e.length; i++) {
			var o = void 0,
				n = e[i];
			o = "text" == n.view ? "onTimedKeyPress" : "onChange", n.on = {}, n.on[o] = function() {
				var e = this.getValue();
				this.config.separator && (e = e.split(this.config.separator)), l(t, this.config.field, e)
			}
		}
	}

	function l(t, e, i) {
		for (var o = t.config.structure.filters, n = 0; n < o.length; n++)
			if (o[n].name == e) return o[n].value = i, t.callEvent("onFilterChange", [e, i]), !0;
		return !1
	}
	e.__esModule = !0, e.formatFilterValues = i, e.processFilters = n, e.showFilters = a
}, function(t, e, i) {
	"use strict";
	i(10);
	var o = i(14);
	webix.protoUI({
		name: "webix_pivot_config",
		defaults: {
			fieldsColumnWidth: 180
		},
		$init: function() {
			this.$view.className += " webix_popup webix_pivot"
		},
		_getUI: function(t) {
			var e = webix.copy((0, o.getStructureMap)(this, t));
			return this._setStructure(e, t)
		},
		_lists: ["filters", "columns", "rows", "values"],
		_dndCorrection: {
			rows: ["columns", "values"],
			columns: ["rows"],
			values: ["rows"]
		},
		_afterInit: function() {
			this.attachEvent("onItemClick", function(t) {
				var e = this.innerId(t);
				if ("cancel" == e || "apply" == e) {
					var i = this.getStructure();
					webix.$$(this.config.pivot).callEvent("onBefore" + e, [i]) && (this.callEvent("on" + e, [i]), this.hide())
				}
			})
		},
		getStructure: function() {
			var t = {
					rows: [],
					columns: [],
					values: [],
					filters: []
				},
				e = this.$$("rows");
			e.data.each(function(e) {
				t.rows.push(e.name)
			});
			var i = this.$$("columns");
			i.data.each(function(e) {
				t.columns.push(e.name)
			});
			var o = this.$$("values");
			o.data.each(function(e) {
				t.values.push(e)
			});
			var n = this.$$("filters");
			n.data.each(function(e) {
				t.filters.push(e)
			});
			var r = webix.$$(this.config.pivot);
			return r.config.structure.columnSort && (t.columnSort = r.config.structure.columnSort), t
		}
	}, webix.ui.webix_pivot_config_common)
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}
	var n = i(11),
		r = o(n),
		a = i(12),
		s = i(13);
	webix.protoUI({
		name: "webix_pivot_config_common",
		$init: function(t) {
			webix.extend(t, this.defaults), webix.extend(t, this._getUI(t), !0), this.$ready.push(this._afterInit)
		},
		defaults: {
			padding: 8,
			height: 500,
			width: 700,
			cancelButtonWidth: 100,
			applyButtonWidth: 100,
			head: !1,
			modal: !0,
			move: !0
		},
		_getUI: function() {
			return {}
		},
		_afterInit: function() {},
		setStructure: function(t) {
			this.define("structure", t), this.render()
		},
		getStructure: function() {
			return {}
		},
		_lists: [],
		_dndCorrection: {},
		data_setter: function(t) {
			t = webix.copy(t);
			var e, i, o = t.fields,
				n = this._lists;
			for (o.forEach(function(i) {
					n.forEach(function(o) {
						e = t[o], e.forEach(function(t) {
							t.name == i.name && (i.$css = " webix_pivot_field_selected")
						})
					})
				}), this.$$("fields").clearAll(), this.$$("fields").parse(o), i = 0; i < n.length; i++) this.$$(n[i]).clearAll(), this.$$(n[i]).parse(t[n[i]])
		},
		_dropField: function(t) {
			var e, i = t.from,
				o = t.to;
			if (o && o != i) return e = webix.copy(i.getItem(t.start)), o == this.$$("fields") ? this._removeListField(this.innerId(i.config.id), e) : this._addListField(this.innerId(o.config.id), e, t.index), !1
		},
		_addListField: function(t, e, i) {
			this._handlers[t].call(this, t, e, i)
		},
		_removeListField: function(t, e) {
			this.$$(t).remove(e.id);
			for (var i = this._lists, o = !1, n = 0; !o && n < i.length; n++) this.$$(i[n]).data.each(function(t) {
				t.name == e.name && (o = t)
			});
			o || this._setPivotFieldCss(e.name, "")
		},
		_setPivotFieldCss: function(t, e) {
			this.$$("fields").data.each(function(i) {
				i.name == t && (i.$css = " " + e, this.refresh(i.id))
			})
		},
		_handlers: {
			filters: function(t, e) {
				var i = !1,
					o = e.name,
					n = this.$$(t);
				n.data.each(function(t) {
					t.name == o && (i = !0)
				}), i || (delete e.id, n.add(e), this._setPivotFieldCss(o, "webix_pivot_field_selected"), this._correctLists(o, t))
			},
			rows: function(t, e) {
				var i = !1,
					o = e.name,
					n = this.$$(t);
				n.data.each(function(t) {
					t.name == o && (i = !0)
				}), i || (delete e.id, n.add(e), this._setPivotFieldCss(o, "webix_pivot_field_selected"), this._correctLists(o, t))
			},
			columns: function(t, e) {
				this._handlers.rows.call(this, t, e)
			},
			values: function(t, e, i) {
				var o = null,
					n = this.$$(t);
				n.data.each(function(t) {
					t.name == e.name && (o = t)
				}), o ? r.clickHandlers.add.call(this, {}, o.id) : (this._setPivotFieldCss(e.name, "webix_pivot_field_selected"), n.add(webix.copy(e), i)), this._correctLists(e.name, t)
			},
			groupBy: function(t, e) {
				if (this.$$(t).data.order.length) {
					var i = this.$$(t).getFirstId();
					this._removeListField(t, this.$$("groupBy").getItem(i))
				}
				this._setPivotFieldCss(e.name, "webix_pivot_field_selected"), delete e.id, this.$$(t).add(e), this._correctLists(e.name, t)
			}
		},
		_correctLists: function(t, e) {
			var i, o, n = this._dndCorrection[e];
			for (i = 0; n && i < n.length; i++) o = null, this.$$(n[i]).data.each(function(e) {
				e.name == t && (o = e)
			}), o && this.$$(n[i]).remove(o.id)
		},
		_setStructure: function(t, e) {
			return (0, a.setStructure)(this, "popup", t, e)
		},
		_listDragHTML: function(t) {
			if (t.start) {
				var e = this.getItem(t.start);
				t.html = this.type.templateStart(e, this.type) + s.popupTemplates.listDrag(e) + this.type.templateEnd(e, this.type)
			}
		},
		_getListEvents: function() {
			return {
				onBeforeDrop: webix.bind(this._dropField, this),
				onBeforeDrag: this._listDragHTML,
				onBeforeDragIn: function() {
					webix.html.addCss(webix.DragControl.getNode(), "webix_pivot_drag_zone", !0)
				}
			}
		}
	}, webix.ui.window, webix.IdSpace)
}, function(t, e) {
	"use strict";

	function i(t, e) {
		var i, o, n = [];
		for (i = 0; i < t.length; i++) o = t[i], n.push({
			name: o,
			title: e(o)
		});
		return n
	}
	e.__esModule = !0;
	var o = e.clickHandlers = {
		add: function(t, e) {
			var i = this.$$("values").getItem(e);
			i.operation.push("sum"), this.$$("values").updateItem(e), webix.delay(function() {
				for (var t = i.operation.length - 1, n = this.$$("values").getItemNode(e).childNodes, r = null, a = 0; a < n.length; a++)
					if (r = n[a], r.getAttribute) {
						var s = r.getAttribute("webix_operation");
						if (!webix.isUndefined(s) && s == t) break
					}
				null !== r && o.selector.call(this, r, e)
			}, this)
		},
		"filter-selector": function(t, e) {
			var o, n = webix.$$(this.config.pivot),
				r = {
					view: "webix_pivot_popup",
					autofit: !0,
					autoheight: !0,
					width: 150,
					data: i(n.filters.get(), n._applyLocale)
				};
			o = webix.ui(r), o.show(t), o.attachEvent("onHide", webix.bind(function() {
				var t = o.getSelected();
				if (null !== t) {
					var i = this.$$("filters").getItem(e);
					i.type = t.name, i.value = "", this.$$("filters").updateItem(e)
				}
				o.close()
			}, this))
		},
		selector: function(t, e) {
			var i = {
					view: "webix_pivot_popup",
					autofit: !0,
					width: 150,
					data: this.config.operations || []
				},
				o = webix.ui(i);
			o.show(t), o.attachEvent("onHide", webix.bind(function() {
				var i = webix.html.locate(t, "webix_operation"),
					n = o.getSelected();
				null !== n && (this.$$("values").getItem(e).operation[i] = n.name, this.$$("values").updateItem(e)), o.close()
			}, this))
		},
		remove: function(t, e) {
			var i = webix.$$(t),
				o = this.innerId(i.config.id),
				n = this.$$(o).getItem(e);
			if ("values" == o) {
				var r = webix.html.locate(t, "webix_operation");
				n.operation.length > 1 ? (n.operation.splice(r, 1), this.$$("values").updateItem(e)) : this._removeListField("values", n)
			} else this._removeListField(o, n);
			return !1
		}
	}
}, function(t, e) {
	"use strict";

	function i(t, e, i, o) {
		var n = ["rows", "cols"],
			r = ["head", "body"],
			a = t,
			s = o.on ? o.on.onViewInit : null,
			l = function u(t, o) {
				var l, c, p;
				for (l = 0; l < r.length; l++) p = null, o[r[l]] && ("string" == typeof o[r[l]] && (p = o[r[l]], o[r[l]] = i[p]), u(p, o[r[l]]));
				for (l = 0; l < n.length; l++)
					if (o[n[l]]) {
						var f = o[n[l]];
						for (c = 0; c < f.length; c++) p = null, "string" == typeof f[c] && (p = f[c], o[n[l]][c] = i[p]), u(p, o[n[l]][c])
					}
				t && t != e && !o.id && (o.id = t), t && s && s.apply(a, [t, o])
			};
		return l(e, i[e]), i[e]
	}
	e.__esModule = !0, e.setStructure = i
}, function(t, e) {
	"use strict";
	e.__esModule = !0;
	e.popupTemplates = {
		header: function(t) {
			return webix.i18n.pivot[t.value]
		},
		iconHeader: function(t) {
			return t.icon ? "<span class='webix_pivot_header_icon webix_icon fa-" + t.icon + "'></span>" + webix.i18n.pivot[t.value] : "<span class='webix_pivot_header_icon'>" + t.iconContent + "</span>" + webix.i18n.pivot[t.value]
		},
		tableValues: function(t) {
			t.operation = t.operation || ["sum"], webix.isArray(t.operation) || (t.operation = [t.operation]);
			for (var e = [], i = webix.$$(this.config.pivot)._applyLocale, o = 0; o < t.operation.length; o++) {
				var n = "<span class='webix_pivot_link' webix_operation='" + o + "'>";
				n += "<span>" + t.text + "</span>", n += "<span class='webix_link_selection'>" + i(t.operation[o]) + "</span>", n += "<span class='webix_pivot_minus webix_icon fa-times'></span>", n += "</span>", e.push(n)
			}
			return e.join(" ")
		},
		chartValues: function(t) {
			t.operation = t.operation || ["sum"], webix.isArray(t.operation) || (t.operation = [t.operation]);
			for (var e = [], i = webix.$$(this.config.pivot), o = i._applyLocale, n = 0; n < t.operation.length; n++) {
				t.color || (t.color = [i._getColor(this._valueLength)]), t.color[n] || t.color.push(i._getColor(this._valueLength));
				var r = "<div class='webix_pivot_link' webix_operation='" + n + "'>";
				r += "<div class='webix_color_selection'><div style='background-color:" + o(t.color[n]) + "'></div></div>", r += "<div class='webix_link_title'>" + t.text + "</div>", r += "<div class='webix_link_selection'>" + o(t.operation[n]) + "</div>", r += "<div class='webix_pivot_minus webix_icon fa-times'></div>", r += "</div>", e.push(r)
			}
			return this._increaseColorIndex && (this._increaseColorIndex = !1, this._valueLength++), e.join(" ")
		},
		filters: function(t) {
			var e = webix.$$(this.config.pivot);
			t.type = t.type || e.filters.getDefault();
			var i = "<a class='webix_pivot_link'>" + t.text;
			return i += " <span class='webix_link_selection'>" + e._applyLocale(t.type) + "</span>", i += "<span class='webix_pivot_minus webix_icon fa-times'></span>", i += "</a> "
		},
		rows: function(t) {
			var e = "<a class='webix_pivot_link'>" + t.text;
			return e += "<span class='webix_pivot_minus webix_icon fa-times'></span>", e += "</a> "
		},
		columns: function(t) {
			var e = "<a class='webix_pivot_link'>" + t.text;
			return e += "<span class='webix_pivot_minus webix_icon fa-times'></span>", e += "</a> "
		},
		groupBy: function(t) {
			var e = "<a class='webix_pivot_link'>" + t.text;
			return e += "<span class='webix_pivot_minus webix_icon fa-times'></span>", e += "</a> "
		},
		listDrag: function(t) {
			return "<a class='webix_pivot_link'>" + t.text + "</a> "
		}
	}
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		return {
			popup: {
				head: "toolbar",
				body: "body"
			},
			toolbar: {
				view: "toolbar",
				cols: ["configTitle", "cancel", "apply"]
			},
			configTitle: {
				id: "configTitle",
				view: "label",
				label: webix.i18n.pivot.windowTitle || ""
			},
			cancel: {
				view: "button",
				id: "cancel",
				label: webix.i18n.pivot.cancel,
				width: e.cancelButtonWidth
			},
			apply: {
				view: "button",
				id: "apply",
				type: "form",
				label: webix.i18n.pivot.apply,
				width: e.applyButtonWidth
			},
			body: {
				type: "wide",
				rows: [{
					cols: ["fieldsLayout", {
						type: "space",
						rows: [{
							type: "wide",
							rows: ["subTitle", {
								type: "wide",
								cols: ["filtersLayout", "columnsLayout"]
							}, {
								type: "wide",
								cols: ["rowsLayout", "valuesLayout"]
							}]
						}]
					}]
				}]
			},
			subTitle: {
				css: "webix_pivot_transparent",
				borderless: !0,
				template: "<div class='webix_pivot_fields_msg'>" + webix.i18n.pivot.windowMessage || "</div>",
				height: 25
			},
			fieldsLayout: {
				width: e.fieldsColumnWidth,
				rows: ["fieldsHeader", "fields"]
			},
			filtersLayout: {
				rows: ["filtersHeader", "filters"]
			},
			columnsLayout: {
				rows: ["columnsHeader", "columns"]
			},
			rowsLayout: {
				rows: ["rowsHeader", "rows"]
			},
			valuesLayout: {
				rows: ["valuesHeader", "values"]
			},
			fieldsHeader: {
				id: "fieldsHeader",
				data: {
					value: "fields"
				},
				css: "webix_pivot_header_fields",
				template: s.popupTemplates.header,
				height: 45
			},
			fields: {
				id: "fields",
				css: "webix_pivot_fields",
				view: "list",
				scroll: !0,
				type: {
					height: "auto"
				},
				drag: !0,
				template: "<span class='webix_pivot_list_marker'></span>#text#",
				on: t._getListEvents()
			},
			filtersHeader: {
				id: "filtersHeader",
				data: {
					value: "filters",
					icon: "filter"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			filters: {
				id: "filters",
				view: "list",
				drag: !0,
				css: "webix_pivot_values",
				template: webix.bind(s.popupTemplates.filters, t),
				type: {
					height: "auto"
				},
				onClick: {
					webix_pivot_link: webix.bind(a.clickHandlers["filter-selector"], t),
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				},
				on: t._getListEvents()
			},
			columnsHeader: {
				id: "columnsHeader",
				data: {
					value: "columns",
					icon: "columns"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			columns: {
				id: "columns",
				view: "list",
				drag: !0,
				type: {
					height: "auto"
				},
				template: webix.bind(s.popupTemplates.columns, t),
				on: t._getListEvents(),
				onClick: {
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				}
			},
			rowsHeader: {
				id: "rowsHeader",
				data: {
					value: "rows",
					icon: "list"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			rows: {
				id: "rows",
				view: "list",
				drag: !0,
				template: webix.bind(s.popupTemplates.rows, t),
				type: {
					height: "auto"
				},
				on: t._getListEvents(),
				onClick: {
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				}
			},
			valuesHeader: {
				id: "valuesHeader",
				data: {
					value: "values",
					icon: !1,
					iconContent: "<b>&Sigma;</b>"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			values: {
				id: "values",
				view: "list",
				scroll: !0,
				drag: !0,
				css: "webix_pivot_values",
				type: {
					height: "auto"
				},
				template: webix.bind(s.popupTemplates.tableValues, t),
				onClick: {
					webix_pivot_link: webix.bind(a.clickHandlers.selector, t),
					webix_pivot_plus: webix.bind(a.clickHandlers.add, t),
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				},
				on: t._getListEvents()
			}
		}
	}
	e.__esModule = !0, e.getStructureMap = n;
	var r = i(11),
		a = o(r),
		s = i(13)
}, function(t, e) {
	"use strict";

	function i(t) {
		if (t.config.freezeTotal) {
			var e, i = t.$$("data").config.columns,
				r = n(i),
				a = o(i);
			for (e = 0; e < t.$$("data").config.leftSplit; e++) r -= i[e].width;
			for (e = i.length - 1; e > i.length - a; e--) r -= i[e].width;
			r > 100 && (t.$$("data").config.rightSplit = a, t.$$("data").refreshColumns())
		}
	}

	function o(t) {
		for (var e = 0, i = t.length - 1; !e && i >= 0; i--) t[i].header[0] && "total" == t[i].header[0].name && (e = t.length - i);
		return e
	}

	function n(t) {
		var e, i = 0;
		for (e = 0; e < t.length; e++) i += t[e].width;
		return i
	}
	e.__esModule = !0, e.freezeTotals = i
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return !e || "object" != typeof e && "function" != typeof e ? t : e
	}

	function r(t, e) {
		if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
		t.prototype = Object.create(e && e.prototype, {
			constructor: {
				value: t,
				enumerable: !1,
				writable: !0,
				configurable: !0
			}
		}), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
	}

	function a(t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	}
	e.__esModule = !0, e.WebixPivot = e._Pivot = void 0;
	var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		},
		l = i(17),
		u = i(24),
		c = i(18),
		p = o(c),
		f = "_'_",
		d = e._Pivot = function() {
			function t(e, i) {
				a(this, t), this.$divider = f, this._initOperations(), this.config = e, this.view = i, e.webWorker && "undefined" !== !("undefined" == typeof Worker ? "undefined" : s(Worker)) && i ? (this._pivotWorker = new Worker(e.webWorker), this._pivotWorker.onmessage = function(t) {
					i._result && !i.$destructed && (i.callEvent("onWebWorkerEnd", []), t.data.id && t.data.id !== i._result_id || (i._result(t.data.data), i._result = null))
				}) : this._pivotData = new l.Data(this, this.config), this.config.structure || (this.config.structure = {}), p.extend(this.config.structure, {
					rows: [],
					columns: [],
					values: [],
					filters: []
				})
			}
			return t.prototype._getPivotData = function(t, e, i) {
				if (!this._pivotWorker) {
					var o = this._pivotData.process(t, e);
					return i && i(o), o
				}
				var n = this._result_id = webix.uid();
				this._result = i;
				var r = [],
					a = this.config.structure,
					s = this.config.footer;
				if (a && (a.rows.length || a.columns.length))
					for (var l = e.length - 1; l >= 0; l--) r[l] = t[e[l]];
				this.callEvent("onWebWorkerStart", []), this._pivotWorker.postMessage({
					footer: s,
					structure: a,
					data: r,
					id: n
				})
			}, t.prototype._initOperations = function() {
				var t = this._pivotOperations = new u.Operations;
				this.operations = t.pull
			}, t.prototype.addOperation = function(t, e, i) {
				this._pivotOperations.add(t, e, i)
			}, t.prototype.addTotalOperation = function(t, e, i) {
				this._pivotOperations.addTotal(t, e, i)
			}, t
		}();
	e.WebixPivot = function(t) {
		function e() {
			return a(this, e), n(this, t.apply(this, arguments))
		}
		return r(e, t), e.prototype.getData = function(t) {
			var e, i, o, n, r = [],
				a = {},
				s = this.config.structure.filters,
				l = {},
				u = {},
				c = {},
				f = this.operations,
				d = [],
				h = {};
			for (e = 0; e < s.length; e++) s[e].type.indexOf("select") != -1 && (u[s[e].name] = [], c[s[e].name] = {});
			for (e = 0; e < t.length; e++) {
				if (i = t[e].id = t[e].id || p.uid(), l[i] = t[e], d.push(i), e < 5)
					for (n in t[e]) a[n] || (r.push(n), a[n] = p.uid());
				for (o in u) {
					var v = t[e][o];
					p.isUndefined(v) || c[o][v] || (c[o][v] = 1, u[o].push(v))
				}
			}
			h.options = u, h.fields = r, h.data = this._getPivotData(l, d), h.operations = [];
			for (i in f) h.operations.push(i);
			return h
		}, e
	}(d)
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	}
	e.__esModule = !0, e.Data = void 0;
	var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		},
		a = function() {
			function t(t, e) {
				for (var i = 0; i < e.length; i++) {
					var o = e[i];
					o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o)
				}
			}
			return function(e, i, o) {
				return i && t(e.prototype, i), o && t(e, o), e
			}
		}(),
		s = i(18),
		l = o(s),
		u = i(19),
		c = i(20),
		p = i(21),
		f = i(22),
		d = o(f),
		h = i(23),
		v = o(h);
	e.Data = function() {
		function t(e, i) {
			n(this, t), this.master = e, this.config = i, this.count = 0, this.watch = new Date, this.ping = i.ping || this.ping
		}
		return t.prototype.process = function(t, e) {
			var i, o, n, a, s, f = this.structure;
			for (f._header = [], f._header_hash = {}, v.formatFilterValues(f.filters), v.setFilterValues(f.filters), a = 0; a < f.values.length; a++) f.values[a].operation = f.values[a].operation || ["sum"], l.isArray(f.values[a].operation) || (f.values[a].operation = [f.values[a].operation]);
			for (i = [], a = 0; a < f.columns.length; a++) i[a] = "object" == r(f.columns[a]) ? f.columns[a].id || a : f.columns[a];
			return o = f.rows.concat(i), s = this.group(t, e, o), n = {}, f.rows.length > 0 ? s = this.processRows(s, f.rows, f, n, "") : (this.processColumns(s, i, f, n), s = []), n = (0, u.processHeader)(this.master, n), s = (0, c.addTotalData)(this.master, s), this.config.footer && (0, p.addFooter)(this.master, n, s), delete f._header, delete f._header_hash, {
				header: n,
				data: s
			}
		}, t.prototype.processColumns = function(t, e, i, o, n, r) {
			var a;
			if (n = n || {
					$source: []
				}, e.length > 0) {
				r = r || "";
				for (var s in t) o[s] || (o[s] = {}), t[s] = this.processColumns(t[s], e.slice(1), i, o[s], n, (r.length > 0 ? r + this.divider : "") + s)
			} else {
				var u = i.values;
				for (var c in t) {
					n.$source.push(c);
					for (var p = 0; p < u.length; p++)
						for (var f = 0; f < u[p].operation.length; f++) a = r ? r + this.divider + u[p].operation[f] + this.divider + u[p].name : u[p].operation[f] + this.divider + u[p].name, i._header_hash[a] || (i._header.push(a), i._header_hash[a] = !0), l.isUndefined(n[a]) && (n[a] = [], o[u[p].operation[f] + this.divider + u[p].name] = {}), n[a].push({
							value: t[c][u[p].name],
							id: c
						})
				}
			}
			return n
		}, t.prototype.processRows = function(t, e, i, o, n) {
			var r, a, s, u, c, p = [];
			if (e.length > 1) {
				for (r in t) t[r] = this.processRows(t[r], e.slice(1), i, o, n + "_" + r);
				var f = i._header;
				for (r in t) {
					for (a = {
							data: t[r]
						}, s = 0; s < a.data.length; s++)
						for (u = 0; u < f.length; u++) c = f[u], l.isUndefined(a[c]) && (a[c] = []), a[c].push(a.data[s][c]);
					this.setItemValues(a), this.master.config.stableRowId && (a.id = n + "_" + r), a.name = r, a.open = !0, p.push(a)
				}
			} else
				for (r in t) a = this.processColumns(t[r], i.columns, i, o), a.name = r, this.master.config.stableRowId && (a.id = n + "_" + r), this.setItemValues(a), p.push(a);
			return p
		}, t.prototype.ping = function() {}, t.prototype.setItemValues = function(t) {
			return t = d.calculateItem(t, {
				header: this.structure._header,
				divider: this.divider,
				operations: this.operations
			}, this), t = d.setMinMax(t, {
				header: this.structure._header,
				max: this.config.max,
				min: this.config.min,
				values: this.structure.values
			}), this.count > 5e4 && (this.count = 0, this.ping(this.watch)), t
		}, t.prototype.group = function(t, e, i) {
			var o, n, r, a = {};
			for (o = 0; o < e.length; o++) n = e[o], r = t[n], r && v.filterItem(this.structure.filters, r, this.config.filterMap) && this.groupItem(a, r, i);
			return a
		}, t.prototype.groupItem = function(t, e, i) {
			if (i.length) {
				var o = e[i[0]];
				if ("undefined" == typeof o) return null;
				l.isUndefined(t[o]) && (t[o] = {}), this.groupItem(t[o], e, i.slice(1))
			} else t[e.id] = e
		}, t.prototype.filterItem = function(t) {
			for (var e = this.structure.filters || [], i = 0; i < e.length; i++) {
				var o = e[i];
				if (o.fvalue) {
					if (l.isUndefined(t[o.name])) return !1;
					var n = t[o.name].toString().toLowerCase(),
						r = o.func(o.fvalue, n);
					if (!r) return !1
				}
			}
			return !0
		}, a(t, [{
			key: "operations",
			get: function() {
				return this.master._pivotOperations
			}
		}, {
			key: "divider",
			get: function() {
				return this.master.$divider
			}
		}, {
			key: "structure",
			get: function() {
				return this.config.structure
			}
		}]), t
	}()
}, function(t, e) {
	"use strict";

	function i(t) {
		return Array.isArray ? Array.isArray(t) : "[object Array]" === Object.prototype.toString.call(t)
	}

	function o(t) {
		return "undefined" == typeof t
	}

	function n(t, e, i) {
		for (var o in e) t[o] && !i || (t[o] = e[o]);
		return t
	}

	function r() {
		return a || (a = (new Date).valueOf()), a++, a
	}
	e.__esModule = !0, e.isArray = i, e.isUndefined = o, e.extend = n, e.uid = r;
	var a
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		var i, o, n, r, a, u = t.config.structure.values;
		for (e = s(t.config.structure, e), e = l(t, e), i = 0; i < e.length; i++) {
			var c = [];
			for (o = 0; o < e[i].length; o++) c.push(e[i][o].name);
			a = null;
			var f = c[c.length - 1].split(t.$divider);
			for (o = 0; o < u.length && !a; o++)
				if (u[o].operation)
					for (n = 0; n < u[o].operation.length; n++) u[o].name == f[1] && u[o].operation[n] == f[0] && (a = u[o]);
			e[i] = {
				id: c.join(t.$divider),
				header: e[i]
			}, e[i].format = a && a.format ? a.format : "count" != f[0] ? t.config.format : null
		}
		return e.length && t.view && t.view.callEvent && t.view.callEvent("onHeaderInit", [e]), t.config.totalColumn && e.length && (e = (0, p.addTotalColumns)(t, e)), e.splice(0, 0, {
			id: "name",
			template: "{common.treetable()} #name#",
			header: {
				text: r
			}
		}), e
	}

	function r(t) {
		return !isNaN(parseFloat(t))
	}

	function a(t, e) {
		var i = f;
		return t && (t[e] ? i = t[e] : t.$default && (i = t.$default), i.dir && (i._dir = "desc" == i.dir ? -1 : 1), c.extend(i, f)), i
	}

	function s(t, e, i) {
		var o, n, r, l, u, c = [];
		if (Object.keys && t.columnSort !== !1)
			for (i = i || 0, o = t.columns[i], u = a(t.columnSort, o), l = Object.keys(e), i < t.columns.length && (l = l.sort(function(t, e) {
					return u.as(t, e) * u._dir
				})), i++, n = 0; n < l.length; n++) r = l[n], c.push({
				key: r,
				data: s(t, e[r], i)
			});
		else
			for (r in e) c.push({
				key: r,
				data: s(t, e[r])
			});
		return c
	}

	function l(t, e) {
		var i, o, n, r, a, s = [];
		for (o = 0; o < e.length; o++)
			if (n = e[o], n.data.length) {
				var u = l(t, n.data);
				for (i = !1, r = 0; r < u.length; r++) a = u[r], a.splice(0, 0, {
					name: n.key
				}), i || (a[0].colspan = u.length, i = !0), s.push(a)
			} else {
				var c = e[o].key.split(t.$divider);
				s.push([{
					name: e[o].key,
					operation: c[0],
					text: c[1]
				}])
			}
		return s
	}
	e.__esModule = !0, e.processHeader = n;
	var u = i(18),
		c = o(u),
		p = i(20),
		f = {
			dir: 1,
			as: function(t, e) {
				return r(t) && r(e) ? d["int"](t, e) : d.string(t, e)
			}
		},
		d = {
			date: function(t, e) {
				return t -= 0, e -= 0, t > e ? 1 : t < e ? -1 : 0
			},
			"int": function(t, e) {
				return t = 1 * t, e = 1 * e, t > e ? 1 : t < e ? -1 : 0
			},
			string: function(t, e) {
				return e ? t ? (t = t.toString().toLowerCase(), e = e.toString().toLowerCase(), t > e ? 1 : t < e ? -1 : 0) : -1 : 1
			}
		}
}, function(t, e) {
	"use strict";

	function i(t, e) {
		return "$webixtotal" + t.$divider + e
	}

	function o(t, e) {
		var i, o, n = [];
		for (i = 0; i < e.length; i++) o = t[e[i]], isNaN(parseFloat(o)) || n.push(o);
		return n
	}

	function n(t, e) {
		var o, n, a, s, l, u, c, p = [];
		if (u = e[0].header.length, u < 2) return e;
		n = r(t, e), o = n.groups, t._pivotColumnGroups = o;
		for (a in o) {
			for (s = {
					id: i(t, a),
					header: [],
					sort: "int",
					width: t.config.columnWidth,
					format: t.config.format
				}, l = 0; l < u - 1; l++) l || p.length ? s.header.push("") : s.header.push({
				name: "total",
				rowspan: u - 1,
				colspan: n.count
			});
			c = a.split(t.$divider), s.header.push({
				name: a,
				operation: c[0],
				text: c[1]
			}), p.push(s)
		}
		return e.concat(p)
	}

	function r(t, e) {
		var i, o, n, r, a, s = {},
			l = 0;
		for (o = 0; o < e.length; o++) a = e[o].id.split(t.$divider), n = a.pop(), r = a.pop(), "sum" != r && "sumOnly" == t.config.totalColumn || (i = r + t.$divider + n, s[i] || (l++, s[i] = {
			operation: r,
			ids: [],
			format: e.format
		}), s[i].ids.push(e[o].id));
		return {
			groups: s,
			count: l
		}
	}

	function a(t, e) {
		var n = t._pivotColumnGroups;
		if (n) {
			var r = void 0,
				s = void 0,
				l = void 0,
				u = void 0;
			for (u in n)
				for (r = n[u], l = r.ids, s = 0; s < e.length; s++) {
					var c = void 0,
						p = i(t, u),
						f = "",
						d = o(e[s], l);
					d.length && (c = t._pivotOperations.getTotal(u.split(t.$divider)[0])) && (f = c.call(t, d, p, e[s])), e[s][p] = f, e[s].data && (e[s].data = a(t, e[s].data))
				}
		}
		return e
	}
	e.__esModule = !0, e.addTotalColumns = n, e.addTotalData = a
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e, i) {
		var o, n, a, l;
		for (n = 1; n < e.length; n++) {
			o = null, a = e[n].id.split(t.$divider), l = a[a.length - 2], "sumOnly" == t.config.footer && "sum" != l && (o = " ");
			var c = t._pivotOperations.getTotal(l);
			if (!o && c) {
				var p = t._pivotOperations.getTotalOptions(l),
					f = r(i, e[n].id, c, p && p.leavesOnly);
				o = {
					$pivotValue: f,
					$pivotOperation: l
				}
			} else o = " ";
			e[n].footer = o, "object" == s(t.config.footer) && u.extend(e[n].footer, t.config.footer, !0)
		}
	}

	function r(t, e, i, o) {
		var n, r, s = [],
			l = [];
		for (t = a(t, o), n = 0; n < t.length; n++) r = t[n][e], isNaN(parseFloat(r)) || (l.push(1 * r), s.push(t[n]));
		return i(l, e, s)
	}

	function a(t, e, i) {
		i || (i = []);
		for (var o = 0; o < t.length; o++) e && t[o].data ? a(t[o].data, e, i) : i.push(t[o]);
		return i
	}
	e.__esModule = !0;
	var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	};
	e.addFooter = n;
	var l = i(18),
		u = o(l)
}, function(t, e) {
	"use strict";

	function i(t, e, i) {
		var n, a, s, l, u, c, p, f = e.header;
		for (n = 0; n < f.length; n++) {
			if (s = f[n], c = s.split(e.divider), u = c[c.length - 2], p = t[s], l = e.operations.getOption(u, "leavesOnly"), a = e.operations.getOption(u, "ids"), l && t.data && (p = [], o(t.data, s, p)), p) {
				for (var d = [], h = [], v = 0; v < p.length; v++) {
					var g = p[v],
						_ = null;
					"object" == ("undefined" == typeof g ? "undefined" : r(g)) && (g = g.value, _ = p[v].id), (g || "0" == g) && (d.push(g), _ && h.push(_))
				}
				d.length ? t[s] = e.operations.get(u)(d, s, t, a ? h : null) : t[s] = ""
			} else t[s] = "";
			i.count++
		}
		return t
	}

	function o(t, e, i) {
		var n;
		for (n = 0; n < t.length; n++) t[n].data ? o(t[n].data, e, i) : i.push(t[n][e])
	}

	function n(t, e) {
		var i, o, n, r, a, s, l, u, c = e.header,
			p = e.max,
			f = e.min,
			d = e.values;
		if (!f && !p) return t;
		for (t.$cellCss || (t.$cellCss = {}), i = 0; i < d.length; i++) {
			for (u = d[i], r = [], a = -99999999, s = [], l = 99999999, o = 0; o < c.length; o++) n = c[o], isNaN(t[n]) || n.indexOf(u.name) !== -1 && (p && t[n] > a ? (r = [n], a = t[n]) : t[n] == a && r.push(n), f && t[n] < l ? (s = [n], l = t[n]) : t[n] == l && s.push(n));
			for (o = 0; o < s.length; o++) t.$cellCss[s[o]] = "webix_min";
			for (o = 0; o < r.length; o++) t.$cellCss[r[o]] = "webix_max"
		}
		return t
	}
	e.__esModule = !0;
	var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	};
	e.calculateItem = i, e.setMinMax = n
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e, i) {
		if ("object" == ("undefined" == typeof t ? "undefined" : l(t))) {
			for (var o = 0; o < t.length; o++)
				if (t[o] = parseFloat(t[o]), isNaN(t[o])) return !0
		} else if (t = parseFloat(t), isNaN(t)) return !0;
		return !isNaN(e) && i(t, e)
	}

	function r(t) {
		t = t || [];
		for (var e = 0; e < t.length; e++) {
			var i = t[e],
				o = i.fvalue;
			"function" == typeof o ? i.func = o : i.type.indexOf("multi") > -1 ? i.func = p.multi : "=" == o.substr(0, 1) ? (i.func = p.equal, o = o.substr(1)) : "<>" == o.substr(0, 2) ? (i.func = p.not_equal, o = o.substr(2)) : ">=" == o.substr(0, 2) ? (i.func = p.more_equal, o = o.substr(2)) : ">" == o.substr(0, 1) ? (i.func = p.more, o = o.substr(1)) : "<=" == o.substr(0, 2) ? (i.func = p.less_equal, o = o.substr(2)) : "<" == o.substr(0, 1) ? (i.func = p.less, o = o.substr(1)) : o.indexOf("...") > 0 ? (i.func = p.range, o = o.split("...")) : o.indexOf("..") > 0 ? (i.func = p.range_inc, o = o.split("..")) : "datepicker" == i.type ? i.func = function(t, e) {
				return t == e
			} : i.func = p.contains, i.fvalue = o
		}
	}

	function a(t) {
		var e, i;
		for (t = t || [], e = 0; e < t.length; e++) i = t[e].fvalue || t[e].value || "", "string" == typeof i && i.trim && (i = i.trim()), t[e].fvalue = i
	}

	function s(t, e, i) {
		if (t) {
			var o = void 0,
				n = void 0;
			for (o = 0; o < t.length; o++)
				if (n = t[o], n.fvalue) {
					var r = i && i[n.name] ? i[n.name] : n.name;
					if (c.isUndefined(e[r])) return !1;
					var a = e[r];
					if (0 !== !a && !a) return !1;
					var s = a.toString().toLowerCase(),
						l = n.func(n.fvalue, s);
					if (!l) return !1
				}
		}
		return !0
	}
	e.__esModule = !0, e.rules = void 0;
	var l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	};
	e.setFilterValues = r, e.formatFilterValues = a, e.filterItem = s;
	var u = i(18),
		c = o(u),
		p = e.rules = {
			contains: function(t, e) {
				return e.indexOf(t.toString().toLowerCase()) >= 0
			},
			equal: function(t, e) {
				return n(t, e, function(t, e) {
					return t == e
				})
			},
			not_equal: function(t, e) {
				return n(t, e, function(t, e) {
					return t != e
				})
			},
			less: function(t, e) {
				return n(t, e, function(t, e) {
					return e < t
				})
			},
			less_equal: function(t, e) {
				return n(t, e, function(t, e) {
					return e <= t
				})
			},
			more: function(t, e) {
				return n(t, e, function(t, e) {
					return e > t
				})
			},
			more_equal: function(t, e) {
				return n(t, e, function(t, e) {
					return e >= t
				})
			},
			multi: function(t, e) {
				var i = !1;
				"string" == typeof t && (t = t.split(","));
				for (var o = 0; o < t.length; o++) i = i || e.indexOf(t[o].toString().toLowerCase()) >= 0;
				return i
			},
			range: function(t, e) {
				return n(t, e, function(t, e) {
					return e < t[1] && e >= t[0]
				})
			},
			range_inc: function(t, e) {
				return n(t, e, function(t, e) {
					return e <= t[1] && e >= t[0]
				})
			}
		}
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	}
	e.__esModule = !0, e.Operations = void 0;
	var r = i(18),
		a = o(r),
		s = {
			sum: function u(t) {
				for (var u = 0, e = 0; e < t.length; e++) {
					var i = t[e];
					i = parseFloat(i, 10), isNaN(i) || (u += i)
				}
				return u
			},
			count: function c(t, e, i) {
				var c = 0;
				if (i.data)
					for (var o = 0; o < i.data.length; o++) c += i.data[o][e] || 0;
				else c = t.length;
				return c
			},
			max: function(t) {
				return 1 == t.length ? t[0] : Math.max.apply(this, t)
			},
			min: function(t) {
				return 1 == t.length ? t[0] : Math.min.apply(this, t)
			}
		},
		l = {
			sum: function p(t) {
				var e, p = 0;
				for (e = 0; e < t.length; e++) p += t[e];
				return p
			},
			min: function(t) {
				return 1 == t.length ? t[0] : Math.min.apply(null, t)
			},
			max: function(t) {
				return 1 == t.length ? t[0] : Math.max.apply(null, t)
			},
			count: function(t) {
				var e = l.sum.call(this, t);
				return e ? parseInt(e, 10) : ""
			}
		};
	e.Operations = function() {
		function t() {
			n(this, t), this.pull = a.extend({}, s), this.options = {}, this.pullTotal = a.extend({}, l), this.totalOptions = {}
		}
		return t.prototype.add = function(t, e, i) {
			this.pull[t] = e, i && (this.options[t] = i)
		}, t.prototype.addTotal = function(t, e, i) {
			this.pullTotal[t] = e, i && (this.totalOptions[t] = i)
		}, t.prototype.get = function(t) {
			return this.pull[t] || null
		}, t.prototype.getOptions = function(t) {
			return this.options[t] || null
		}, t.prototype.getOption = function(t, e) {
			return this.options[t] ? this.options[t][e] : null
		}, t.prototype.getTotal = function(t) {
			return this.pullTotal[t] || this.pull[t] || null
		}, t.prototype.getTotalOptions = function(t) {
			return this.pullTotal[t] ? this.totalOptions[t] || null : this.options[t] || null
		}, t.prototype.getTotalOption = function(t, e) {
			var i = this.getTotalOptions(t);
			return i ? i[t][e] : null
		}, t
	}()
}, function(t, e) {
	"use strict";
	e.__esModule = !0;
	e.defaults = {
		fieldMap: {},
		yScaleWidth: 300,
		columnWidth: 150,
		filterLabelAlign: "right",
		filterPlaceholder: !1,
		filterWidth: 300,
		filterMinWidth: 150,
		filterLabelWidth: 100,
		headerTemplate: function(t) {
			return this._applyMap(t.text || t.name) + " (" + this._applyLocale(t.operation) + ")"
		},
		format: function(t) {
			return t && "0" != t ? parseFloat(t).toFixed(3) : t
		}
	}
}, function(t, e) {
	"use strict";

	function i(t, e) {
		for (var i = t.config.format, n = 0; n < e.length; n++)
			if (n) {
				webix.extend(e[n], {
					format: i,
					sort: "int",
					width: t.config.columnWidth
				});
				for (var r = e[n].header, a = 0; a < r.length; a++) {
					var s = r[a];
					s && (a || "total" != s.name ? a == r.length - 1 ? s.text = t.config.headerTemplate.call(t, s) : s.text = s.name : s.text = t._applyLocale("total"))
				}
				var l = e[n].footer,
					u = e[n].format;
				if (l) {
					"string" == typeof l && (l = {
						text: l
					});
					var c = webix.isUndefined(l.$pivotValue) ? l.text : l.$pivotValue;
					l.text = !u || "count" == l.$pivotOperation && u == i ? c : u(c)
				}
			} else o(t, e[n])
	}

	function o(t, e) {
		var i = "";
		i = t.config.readonly ? t.config.readonlyTitle || "" : "<div class='webix_pivot_config_msg'>" + webix.i18n.pivot.pivotMessage + "</div>", e.header = i, e.width = t.config.yScaleWidth, e.exportAsTree = !0, t.config.footer && (e.footer = t._applyLocale("total"))
	}
	e.__esModule = !0, e.setColumns = i
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t) {
		webix.extend(t, s, !0), t.attachEvent("onFilterChange", function() {
			a.formatFilterValues(this.config.structure.filters), this._loadResults(!0)
		})
	}
	e.__esModule = !0, e.init = n;
	var r = i(8),
		a = o(r),
		s = {
			render: function(t) {
				this.data.silent(function() {
					var t = this.url;
					this.clearAll(), this.url = t
				}), a.formatFilterValues(this.config.structure.filters), t ? this._setData(t) : this._loadResults()
			},
			$onLoad: function(t) {
				if (t.fields && (this._pivotFields = t.fields), t.options && (this._pivotOptions = t.options), t.structure && (this.config.structure = t.structure), t.operations) {
					this.operations = {};
					for (var e = 0; e < t.operations.length; e++) this.operations[t.operations[e]] = 1
				}
				t.data.columns && (t.data.header = t.data.columns), t.data && this.render(t.data)
			},
			_loadResults: function() {
				var t = this.config.structure,
					e = this.data.url;
				e && (e.load ? e.load(this, {
					success: function(t) {
						this.parse(JSON.parse(t))
					}
				}, {
					structure: t
				}) : "string" == typeof e && this.load("post->" + e, "json", {
					structure: t
				}))
			}
		}
}, function(t, e) {
	"use strict";

	function i(t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	}
	e.__esModule = !0;
	e.Filters = function() {
		function t() {
			i(this, t), this._filters = ["datepicker", "multicombo", "select", "text"], this._selects = {
				multicombo: 1,
				multiselect: 1,
				select: 1,
				richselect: 1
			}
		}
		return t.prototype.add = function(t, e) {
			this._filters.push(t), webix.isUndefined(e) || (this._selects[t] = e)
		}, t.prototype.isSelect = function(t) {
			return this._selects[t]
		}, t.prototype.clear = function() {
			this._filters = []
		}, t.prototype.remove = function(t) {
			var e = this.getIndex(t);
			e >= 0 && this._filters.splice(e, 1)
		}, t.prototype.getIndex = function(t) {
			for (var e = 0; e < this._filters.length; e++)
				if (this._filters[e] == t) return e;
			return -1
		}, t.prototype.getDefault = function() {
			return this.getIndex("select") != -1 ? "select" : this._filters[0]
		}, t.prototype.get = function() {
			return this._filters
		}, t
	}()
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}
	var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
			return typeof t
		} : function(t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		},
		r = i(8),
		a = o(r);
	i(30);
	var s = i(32),
		l = i(23),
		u = i(28);
	webix.protoUI({
		name: "pivot-chart",
		version: "{{version}}",
		defaults: s.defaults,
		templates: {
			groupNameToStr: function(t, e) {
				return t + "_" + e
			},
			groupNameToObject: function(t) {
				var e = t.split("_");
				return {
					name: e[0],
					operation: e[1]
				}
			},
			seriesTitle: function(t, e) {
				var i = this.config.fieldMap[t.name] || this._capitalize(t.name),
					o = webix.isArray(t.operation) ? t.operation[e] : t.operation;
				return i + " ( " + (webix.i18n.pivot[o] || o) + ")"
			}
		},
		templates_setter: function(t) {
			"object" == ("undefined" == typeof t ? "undefined" : n(t)) && webix.extend(this.templates, t)
		},
		chartMap: {
			bar: function(t) {
				return {
					border: 0,
					alpha: 1,
					radius: 0,
					color: t
				}
			},
			line: function(t) {
				return {
					alpha: 1,
					item: {
						borderColor: t,
						color: t
					},
					line: {
						color: t,
						width: 2
					}
				}
			},
			radar: function(t) {
				return {
					alpha: 1,
					fill: !1,
					disableItems: !0,
					item: {
						borderColor: t,
						color: t
					},
					line: {
						color: t,
						width: 2
					}
				}
			}
		},
		chartMap_setter: function(t) {
			"object" == ("undefined" == typeof t ? "undefined" : n(t)) && webix.extend(this.chartMap, t, !0)
		},
		$init: function(t) {
			this.data.provideApi(this, !0), t.structure || (t.structure = {}), webix.extend(t.structure, {
				groupBy: "",
				values: [],
				filters: []
			}), this.$view.className += " webix_pivot_chart", webix.extend(t, {
				editButtonWidth: this.defaults.editButtonWidth
			}), webix.extend(t, this.getUI(t)), this.$ready.push(webix.bind(function() {
				webix.delay(this.render, this)
			}, this)), this.data.attachEvent("onStoreUpdated", webix.bind(function() {
				this.$$("chart") && this.render()
			}, this)), this.attachEvent("onFilterChange", function() {
				this.render(!0)
			}), this.filters = new u.Filters
		},
		getUI: function(t) {
			var e = [];
			e.push({
				id: "filters",
				hidden: !0,
				cols: []
			}), t.readonly || e.push({}, {
				id: "edit",
				view: "icon",
				type: "iconButton",
				align: "right",
				icon: "pencil-square-o",
				inputWidth: t.editButtonWidth,
				tooltip: this._applyLocale("settings"),
				click: webix.bind(this.configure, this)
			});
			var i = {
					paddingY: 10,
					paddingX: 5,
					margin: 10,
					maxHeight: 5,
					id: "toolbar",
					cols: e
				},
				o = {
					id: "bodyLayout",
					type: "line",
					margin: 10,
					cols: [{
						id: "chart",
						view: "chart"
					}]
				};
			return {
				type: "clean",
				rows: [i, o]
			}
		},
		configure: function() {
			if (!this._pivotPopup) {
				var t = {
					view: "webix_pivot_chart_config",
					operations: [],
					pivot: this.config.id
				};
				webix.extend(t, this.config.popup || {}), this._pivotPopup = webix.ui(t), this.callEvent("onPopup", [this._pivotPopup]), this._pivotPopup.attachEvent("onApply", webix.bind(function(t) {
					this.config.chartType = this._pivotPopup.$$("chartType") ? this._pivotPopup.$$("chartType").getValue() : "bar", this.config.chart.scale = this._pivotPopup.$$("logScale").getValue() ? "logarithmic" : "linear", webix.extend(this.config.structure, t, !0), this.render()
				}, this))
			}
			var e = [];
			for (var i in this.operations) e.push({
				name: i,
				title: this._applyLocale(i)
			});
			this._pivotPopup._valueLength = this._valueLength, this._pivotPopup.define("operations", e);
			var o = webix.html.offset(this.$$("chart").getNode());
			this._pivotPopup.setPosition(o.x + 10, o.y + 10), this._pivotPopup.define("data", this.getFields()), this._pivotPopup.show()
		},
		destructor: function() {
			this._pivotPopup && (this._pivotPopup.destructor(), this._pivotPopup = null), webix.Destruction.destructor.call(this)
		},
		render: function(t) {
			if (!t) {
				var e = a.processFilters(this);
				a.showFilters(this, e)
			}
			this._valueLength = 0;
			var i = this.config.structure;
			i && i.groupBy && i.values && i.values.length && (this._setChartConfig(), this._loadFilteredData())
		},
		_setChartConfig: function() {
			for (var t = this.config, e = t.structure.values, i = 0; i < e.length; i++) e[i].operation = e[i].operation || ["sum"], webix.isArray(e[i].operation) || (e[i].operation = [e[i].operation]);
			var o = this.config.chartType || "bar",
				n = this.chartMap[o],
				r = {
					type: n && n("").type ? n("").type : o,
					xAxis: webix.extend({
						template: "#id#"
					}, t.chart.xAxis || {}, !0),
					yAxis: webix.extend({}, t.chart.yAxis || {})
				};
			webix.extend(r, t.chart), r.padding || (r.padding = {
				top: 17
			});
			var a = this._getSeries();
			r.series = a.series, r.legend = !1, (t.singleLegendItem || this._valueLength > 1) && (r.legend = a.legend), r.scheme = {
				$group: this._pivot_group,
				$sort: {
					by: "id"
				}
			}, this.$$("chart").removeAllSeries();
			for (var s in r) this.$$("chart").define(s, r[s])
		},
		_applyLocale: function(t) {
			return webix.i18n.pivot[t] || t
		},
		_capitalize: function(t) {
			return t.charAt(0).toUpperCase() + t.slice(1)
		},
		_applyMap: function(t, e) {
			return this.config.fieldMap[t] || (e ? this._capitalize(t) : t)
		},
		_loadFilteredData: function() {
			var t = this.config.structure.filters;
			a.formatFilterValues(t), (0, l.setFilterValues)(t), this.data.silent(function() {
				var e = this;
				this.data.filter(function(i) {
					return (0, l.filterItem)(t, i, e.config.filterMap)
				})
			}, this), this.$$("chart").data.silent(function() {
				this.$$("chart").clearAll()
			}, this), this.$$("chart").parse(this.data.getRange()), this.data.silent(function() {
				this.data.filter("")
			}, this)
		},
		groupNameToStr: function(t) {
			return t.name + "_" + t.operation
		},
		groupNameToObject: function(t) {
			var e = t.split("_");
			return {
				name: e[0],
				operation: e[1]
			}
		},
		_getSeries: function() {
			var t, e, i, o, n, r = {},
				a = [],
				s = this.config.structure.values;
			for (i = {
					valign: "middle",
					align: "right",
					width: 140,
					layout: "y"
				}, webix.extend(i, this.config.chart.legend || {}, !0), i.values = [], i.marker || (i.marker = {}), i.marker.type = "line" == this.config.chartType ? "item" : "s", this.series_names = [], this._valueLength = 0, t = 0; t < s.length; t++)
				for (webix.isArray(s[t].operation) || (s[t].operation = [s[t].operation]), webix.isArray(s[t].color) || (s[t].color = [s[t].color || this._getColor(this._valueLength)]), e = 0; e < s[t].operation.length; e++) {
					o = this.templates.groupNameToStr(s[t].name, s[t].operation[e]), this.series_names.push(o), s[t].color[e] || (s[t].color[e] = this._getColor(this._valueLength));
					var l = s[t].color[e],
						u = this.chartMap[this.config.chartType](l) || {};
					u.value = "#" + o + "#", u.tooltip = {
						template: webix.bind(function(t) {
							return t[this].toFixed(3)
						}, o)
					}, a.push(u), n = this.templates.seriesTitle.call(this, s[t], e), i.values.push({
						text: n,
						color: l
					}), r[o] = [s[t].name, s[t].operation[e]], this._valueLength++
				}
			return this._pivot_group = {}, s.length && (this._pivot_group = webix.copy({
				by: this.config.structure.groupBy,
				map: r
			})), {
				series: a,
				legend: i
			}
		},
		_getColor: function(t) {
			var e = this.config.palette,
				i = t / e[0].length;
			i = i > e.length ? 0 : parseInt(i, 10);
			var o = t % e[0].length;
			return e[i][o]
		},
		operations: {
			sum: 1,
			count: 1,
			max: 1,
			min: 1
		},
		addGroupMethod: function(t, e) {
			this.operations[t] = 1, e && (webix.GroupMethods[t] = e)
		},
		removeGroupMethod: function(t) {
			delete this.operations[t]
		},
		groupMethods_setter: function(t) {
			for (var e in t) t.hasOwnProperty(e) && this.addGroupMethod(e, t[e])
		},
		getFields: function() {
			var t, e = [],
				i = {};
			for (t = 0; t < Math.min(this.data.count() || 5); t++) {
				var o = this.data.getItem(this.data.getIdByIndex(t));
				for (var r in o) i[r] || (e.push(r), i[r] = webix.uid())
			}
			var a = this.config.structure,
				s = {
					fields: [],
					groupBy: [],
					values: [],
					filters: []
				},
				l = "object" == n(a.groupBy) ? a.groupBy[0] : a.groupBy;
			webix.isUndefined(i[l]) || s.groupBy.push({
				name: l,
				text: this._applyMap(l),
				id: i[l]
			});
			var u, c = {};
			for (t = 0; t < a.values.length; t++)
				if (l = a.values[t], !webix.isUndefined(i[l.name]))
					if (u = this._applyMap(l.name), webix.isUndefined(c[l.name])) c[l.name] = s.values.length, s.values.push({
						name: l.name,
						text: u,
						operation: l.operation,
						color: l.color || [this._getColor(t)],
						id: i[l.name]
					});
					else {
						var p = s.values[c[l.name]];
						p.operation = p.operation.concat(l.operation), p.color = p.color.concat(l.color || [this._getColor(t)])
					}
			for (t = 0; t < (a.filters || []).length; t++) l = a.filters[t], webix.isUndefined(i[l.name]) || (u = this._applyMap(l.name), s.filters.push({
				name: l.name,
				text: u,
				type: l.type,
				value: l.value,
				id: i[l]
			}));
			for (e.sort(), t = 0; t < e.length; t++) l = e[t], webix.isUndefined(i[l]) || s.fields.push({
				name: l,
				text: this._applyMap(l),
				id: i[l]
			});
			return s
		},
		getStructure: function() {
			return this.config.structure
		},
		getConfigWindow: function() {
			return this._pivotPopup
		},
		getFilterView: function() {
			return this.$$("filters")
		}
	}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings)
}, function(t, e, i) {
	"use strict";
	i(10);
	var o = i(31);
	webix.protoUI({
		name: "webix_pivot_chart_config",
		$init: function() {
			this.$view.className += " webix_pivot_chart_popup"
		},
		defaults: {
			chartTypeLabelWidth: 80,
			chartTypeWidth: 250,
			logScaleLabelWidth: 125,
			fieldsColumnWidth: 280
		},
		_getUI: function(t) {
			var e = webix.copy((0, o.getStructureMap)(this, t));
			return this._setStructure(e, t)
		},
		_lists: ["filters", "values", "groupBy"],
		_dndCorrection: {
			values: ["groupBy"],
			groupBy: ["values"]
		},
		_hidePopups: function() {
			webix.callEvent("onClick", [])
		},
		_afterInit: function() {
			this.attachEvent("onItemClick", function(t) {
				if ("button" == this.$eventSource.name) {
					var e = this.innerId(t),
						i = this.getStructure();
					"apply" != e || i.values.length && i.groupBy ? webix.$$(this.config.pivot).callEvent("onBefore" + e, [i]) && (this.callEvent("on" + e, [i]), this.hide()) : webix.alert(webix.i18n.pivot.valuesNotDefined)
				}
			})
		},
		getStructure: function() {
			var t = {
					groupBy: "",
					values: [],
					filters: []
				},
				e = this.$$("groupBy");
			e.count() && (t.groupBy = e.getItem(e.getFirstId()).name);
			var i, o = this.$$("values");
			o.data.each(webix.bind(function(e) {
				for (var o = 0; o < e.operation.length; o++) i = webix.copy(e), webix.extend(i, {
					operation: e.operation[o],
					color: e.color[o] || webix.$$(this.config.pivot).config.color
				}, !0), t.values.push(i)
			}, this));
			var n = this.$$("filters");
			return n.data.each(function(e) {
				t.filters.push(e)
			}), t
		}
	}, webix.ui.webix_pivot_config_common)
}, function(t, e, i) {
	"use strict";

	function o(t) {
		if (t && t.__esModule) return t;
		var e = {};
		if (null != t)
			for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e["default"] = t, e
	}

	function n(t, e) {
		var i = [],
			o = webix.$$(e.pivot),
			n = o.chartMap;
		for (var r in n) i.push({
			id: r,
			value: o._applyLocale(r)
		});
		return {
			popup: {
				head: "toolbar",
				body: "body"
			},
			toolbar: {
				view: "toolbar",
				cols: ["configTitle", "cancel", "apply"]
			},
			configTitle: {
				id: "configTitle",
				view: "label",
				label: webix.i18n.pivot.windowTitle
			},
			cancel: {
				view: "button",
				id: "cancel",
				label: o._applyLocale("cancel"),
				width: e.cancelButtonWidth
			},
			apply: {
				view: "button",
				id: "apply",
				type: "form",
				css: "webix_pivot_apply",
				label: o._applyLocale("apply"),
				width: e.applyButtonWidth
			},
			body: {
				type: "space",
				rows: [{
					type: "wide",
					cols: ["fieldsLayout", {
						type: "wide",
						rows: ["filtersLayout", "valuesLayout", "groupLayout"]
					}]
				}, "footer"]
			},
			fieldsLayout: {
				width: e.fieldsColumnWidth,
				rows: ["fieldsHeader", "fields"]
			},
			fieldsHeader: {
				css: "webix_pivot_header_fields",
				template: "<div class='webix_pivot_fields_msg'>" + webix.i18n.pivot.windowMessage || "</div>",
				height: 40
			},
			fields: {
				view: "list",
				type: {
					height: "auto"
				},
				drag: !0,
				template: "<span class='webix_pivot_list_marker'></span>#text#",
				on: t._getListEvents()
			},
			filtersLayout: {
				rows: ["filtersHeader", "filters"]
			},
			filtersHeader: {
				data: {
					value: "filters",
					icon: "filter"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			filters: {
				view: "list",
				scroll: !0,
				type: {
					height: "auto"
				},
				gravity: 2,
				drag: !0,
				css: "webix_pivot_values",
				template: webix.bind(s.popupTemplates.filters, t),
				onClick: {
					webix_link_selection: webix.bind(l["filter-selector"], t),
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				},
				on: t._getListEvents()
			},
			valuesLayout: {
				rows: ["valuesHeader", "values"]
			},
			valuesHeader: {
				data: {
					value: "values",
					icon: "bar-chart"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			values: {
				view: "list",
				scroll: !0,
				gravity: 3,
				drag: !0,
				css: "webix_pivot_values",
				type: {
					height: "auto"
				},
				template: webix.bind(s.popupTemplates.chartValues, t),
				onClick: {
					webix_link_title: webix.bind(l.selector, t),
					webix_link_selection: webix.bind(l.selector, t),
					webix_color_selection: webix.bind(l.color, t),
					webix_pivot_minus: webix.bind(l.remove, t)
				},
				on: t._getListEvents()
			},
			groupLayout: {
				rows: ["groupHeader", "groupBy"]
			},
			groupHeader: {
				data: {
					value: "groupBy",
					icon: "sitemap"
				},
				template: s.popupTemplates.iconHeader,
				css: "webix_pivot_popup_title",
				height: 40
			},
			groupBy: {
				view: "list",
				yCount: 1,
				scroll: !1,
				drag: !0,
				type: {
					height: 35
				},
				template: webix.bind(s.popupTemplates.groupBy, t),
				on: t._getListEvents(),
				onClick: {
					webix_pivot_minus: webix.bind(a.clickHandlers.remove, t)
				}
			},
			footer: {
				borderless: !0,
				css: "webix_pivot_footer",
				cols: ["logScale", {}, "chartType"]
			},
			logScale: {
				view: "checkbox",
				value: o.config.chart.scale && "logarithmic" == o.config.chart.scale,
				label: webix.i18n.pivot.logScale,
				labelWidth: e.logScaleLabelWidth,
				width: e.logScaleLabelWidth + 20
			},
			chartType: {
				view: "select",
				value: o.config.chartType,
				label: webix.i18n.pivot.chartType,
				options: i,
				labelWidth: e.chartTypeLabelWidth,
				width: e.chartTypeWidth
			}
		}
	}
	e.__esModule = !0, e.getStructureMap = n;
	var r = i(11),
		a = o(r),
		s = i(13),
		l = webix.extend({
			color: function(t, e) {
				var i = {
					view: "colorboard",
					borderless: !0
				};
				webix.$$(this.config.pivot).config.colorboard ? webix.extend(i, webix.$$(this.config.pivot).config.colorboard) : webix.extend(i, {
					width: 150,
					height: 150,
					palette: webix.$$(this.config.pivot).config.palette
				});
				var o = webix.ui({
					view: "popup",
					id: "colorsPopup",
					body: i
				});
				return o.show(t), o.getBody().attachEvent("onSelect", function() {
					o.hide()
				}), o.attachEvent("onHide", webix.bind(function() {
					var i = webix.html.locate(t, "webix_operation"),
						n = o.getBody().getValue();
					n && (this.$$("values").getItem(e).color[i] = n, this.$$("values").updateItem(e)), o.close()
				}, this)), !1
			}
		}, a.clickHandlers)
}, function(t, e) {
	"use strict";
	e.__esModule = !0;
	e.defaults = {
		fieldMap: {},
		rows: [],
		filterLabelAlign: "right",
		filterWidth: 300,
		filterMinWidth: 180,
		editButtonWidth: 110,
		filterLabelWidth: 100,
		filterPlaceholder: !1,
		chartType: "bar",
		color: "#36abee",
		chart: {},
		singleLegendItem: 1,
		palette: [
			["#e33fc7", "#a244ea", "#476cee", "#36abee", "#58dccd", "#a7ee70"],
			["#d3ee36", "#eed236", "#ee9336", "#ee4339", "#595959", "#b85981"],
			["#c670b8", "#9984ce", "#b9b9e2", "#b0cdfa", "#a0e4eb", "#7faf1b"],
			["#b4d9a4", "#f2f79a", "#ffaa7d", "#d6806f", "#939393", "#d9b0d1"],
			["#780e3b", "#684da9", "#242464", "#205793", "#5199a4", "#065c27"],
			["#54b15a", "#ecf125", "#c65000", "#990001", "#363636", "#800f3e"]
		]
	}
}]);