(function ($) {
    $.extend($.ui, { timepicker: { version: "0.3.2" } }); var PROP_NAME = "timepicker", tpuuid = (new Date).getTime(); function Timepicker() {
        this.debug = true; this._curInst = null; this._disabledInputs = []; this._timepickerShowing = false; this._inDialog = false; this._dialogClass = "ui-timepicker-dialog"; this._mainDivId = "ui-timepicker-div"; this._inlineClass = "ui-timepicker-inline"; this._currentClass = "ui-timepicker-current"; this._dayOverClass = "ui-timepicker-days-cell-over"; this.regional = []; this.regional[""] = {
            hourText: "\u0633\u0627\u0639\u062a",
            minuteText: "\u062f\u0642\u06cc\u0642\u0647", amPmText: ["AM", "PM"], closeButtonText: "\u062a\u0623\u06cc\u06cc\u062f", nowButtonText: "\u0627\u06a9\u0646\u0648\u0646", deselectButtonText: "\u0631\u06cc\u0633\u062a \u06a9\u0631\u062f\u0646"
        }; this._defaults = {
            showOn: "focus", button: null, showAnim: "fadeIn", showOptions: {}, appendText: "", beforeShow: null, onSelect: null, onClose: null, timeSeparator: ":", periodSeparator: " ", showPeriod: false, showPeriodLabels: true, showLeadingZero: true, showMinutesLeadingZero: true, altField: "",
            defaultTime: "now", myPosition: "left top", atPosition: "left bottom", onHourShow: null, onMinuteShow: null, hours: { starts: 0, ends: 23 }, minutes: { starts: 0, ends: 55, interval: 5 }, rows: 4, showHours: true, showMinutes: true, optionalMinutes: false, showCloseButton: false, showNowButton: false, showDeselectButton: false
        }; $.extend(this._defaults, this.regional[""]); this.tpDiv = $('<div id="' + this._mainDivId + '" class="ui-timepicker ui-widget ui-helper-clearfix ui-corner-all " style="display: none"></div>')
    } $.extend(Timepicker.prototype,
    {
        markerClassName: "hasTimepicker", log: function () { if (this.debug) console.log.apply("", arguments) }, _widgetTimepicker: function () { return this.tpDiv }, setDefaults: function (settings) { extendRemove(this._defaults, settings || {}); return this }, _attachTimepicker: function (target, settings) {
            var inlineSettings = null; for (var attrName in this._defaults) {
                var attrValue = target.getAttribute("time:" + attrName); if (attrValue) {
                    inlineSettings = inlineSettings || {}; try { inlineSettings[attrName] = eval(attrValue) } catch (err) {
                        inlineSettings[attrName] =
                        attrValue
                    }
                }
            } var nodeName = target.nodeName.toLowerCase(); var inline = nodeName == "div" || nodeName == "span"; if (!target.id) { this.uuid += 1; target.id = "tp" + this.uuid } var inst = this._newInst($(target), inline); inst.settings = $.extend({}, settings || {}, inlineSettings || {}); if (nodeName == "input") { this._connectTimepicker(target, inst); this._setTimeFromField(inst) } else if (inline) this._inlineTimepicker(target, inst)
        }, _newInst: function (target, inline) {
            var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1"); return {
                id: id, input: target,
                inline: inline, tpDiv: !inline ? this.tpDiv : $('<div class="' + this._inlineClass + ' ui-timepicker ui-widget  ui-helper-clearfix"></div>')
            }
        }, _connectTimepicker: function (target, inst) {
            var input = $(target); inst.append = $([]); inst.trigger = $([]); if (input.hasClass(this.markerClassName)) return; this._attachments(input, inst); input.addClass(this.markerClassName).keydown(this._doKeyDown).keyup(this._doKeyUp).bind("setData.timepicker", function (event, key, value) { inst.settings[key] = value }).bind("getData.timepicker", function (event,
            key) { return this._get(inst, key) }); $.data(target, PROP_NAME, inst)
        }, _doKeyDown: function (event) {
            var inst = $.timepicker._getInst(event.target); var handled = true; inst._keyEvent = true; if ($.timepicker._timepickerShowing) switch (event.keyCode) { case 9: $.timepicker._hideTimepicker(); handled = false; break; case 13: $.timepicker._updateSelectedValue(inst); $.timepicker._hideTimepicker(); return false; break; case 27: $.timepicker._hideTimepicker(); break; default: handled = false } else if (event.keyCode == 36 && event.ctrlKey) $.timepicker._showTimepicker(this);
            else handled = false; if (handled) { event.preventDefault(); event.stopPropagation() }
        }, _doKeyUp: function (event) { var inst = $.timepicker._getInst(event.target); $.timepicker._setTimeFromField(inst); $.timepicker._updateTimepicker(inst) }, _attachments: function (input, inst) {
            var appendText = this._get(inst, "appendText"); var isRTL = this._get(inst, "isRTL"); if (inst.append) inst.append.remove(); if (appendText) { inst.append = $('<span class="' + this._appendClass + '">' + appendText + "</span>"); input[isRTL ? "before" : "after"](inst.append) } input.unbind("focus.timepicker",
            this._showTimepicker); input.unbind("click.timepicker", this._adjustZIndex); if (inst.trigger) inst.trigger.remove(); var showOn = this._get(inst, "showOn"); if (showOn == "focus" || showOn == "both") { input.bind("focus.timepicker", this._showTimepicker); input.bind("click.timepicker", this._adjustZIndex) } if (showOn == "button" || showOn == "both") {
                var button = this._get(inst, "button"); $(button).bind("click.timepicker", function () {
                    if ($.timepicker._timepickerShowing && $.timepicker._lastInput == input[0]) $.timepicker._hideTimepicker();
                    else if (!inst.input.is(":disabled")) $.timepicker._showTimepicker(input[0]); return false
                })
            }
        }, _inlineTimepicker: function (target, inst) {
            var divSpan = $(target); if (divSpan.hasClass(this.markerClassName)) return; divSpan.addClass(this.markerClassName).append(inst.tpDiv).bind("setData.timepicker", function (event, key, value) { inst.settings[key] = value }).bind("getData.timepicker", function (event, key) { return this._get(inst, key) }); $.data(target, PROP_NAME, inst); this._setTimeFromField(inst); this._updateTimepicker(inst);
            inst.tpDiv.show()
        }, _adjustZIndex: function (input) { input = input.target || input; var inst = $.timepicker._getInst(input); inst.tpDiv.css("zIndex", $.timepicker._getZIndex(input) + 1) }, _showTimepicker: function (input) {
            input = input.target || input; if (input.nodeName.toLowerCase() != "input") input = $("input", input.parentNode)[0]; if ($.timepicker._isDisabledTimepicker(input) || $.timepicker._lastInput == input) return; $.timepicker._hideTimepicker(); var inst = $.timepicker._getInst(input); if ($.timepicker._curInst && $.timepicker._curInst !=
            inst) $.timepicker._curInst.tpDiv.stop(true, true); var beforeShow = $.timepicker._get(inst, "beforeShow"); extendRemove(inst.settings, beforeShow ? beforeShow.apply(input, [input, inst]) : {}); inst.lastVal = null; $.timepicker._lastInput = input; $.timepicker._setTimeFromField(inst); if ($.timepicker._inDialog) input.value = ""; if (!$.timepicker._pos) { $.timepicker._pos = $.timepicker._findPos(input); $.timepicker._pos[1] += input.offsetHeight } var isFixed = false; $(input).parents().each(function () {
                isFixed |= $(this).css("position") ==
                "fixed"; return !isFixed
            }); if (isFixed && $.browser.opera) { $.timepicker._pos[0] -= document.documentElement.scrollLeft; $.timepicker._pos[1] -= document.documentElement.scrollTop } var offset = { left: $.timepicker._pos[0], top: $.timepicker._pos[1] }; $.timepicker._pos = null; inst.tpDiv.css({ position: "absolute", display: "block", top: "-1000px" }); $.timepicker._updateTimepicker(inst); if (!inst.inline && typeof $.ui.position == "object") {
                inst.tpDiv.position({
                    of: inst.input, my: $.timepicker._get(inst, "myPosition"), at: $.timepicker._get(inst,
                    "atPosition"), collision: "flip"
                }); var offset = inst.tpDiv.offset(); $.timepicker._pos = [offset.top, offset.left]
            } inst._hoursClicked = false; inst._minutesClicked = false; offset = $.timepicker._checkOffset(inst, offset, isFixed); inst.tpDiv.css({ position: $.timepicker._inDialog && $.blockUI ? "static" : isFixed ? "fixed" : "absolute", display: "none", left: offset.left + "px", top: offset.top + "px" }); if (!inst.inline) {
                var showAnim = $.timepicker._get(inst, "showAnim"); var duration = $.timepicker._get(inst, "duration"); var postProcess = function () {
                    $.timepicker._timepickerShowing =
                    true; var borders = $.timepicker._getBorders(inst.tpDiv); inst.tpDiv.find("iframe.ui-timepicker-cover").css({ left: -borders[0], top: -borders[1], width: inst.tpDiv.outerWidth(), height: inst.tpDiv.outerHeight() })
                }; $.timepicker._adjustZIndex(input); if ($.effects && $.effects[showAnim]) inst.tpDiv.show(showAnim, $.timepicker._get(inst, "showOptions"), duration, postProcess); else inst.tpDiv.show(showAnim ? duration : null, postProcess); if (!showAnim || !duration) postProcess(); if (inst.input.is(":visible") && !inst.input.is(":disabled")) inst.input.focus();
                $.timepicker._curInst = inst
            }
        }, _getZIndex: function (target) { var elem = $(target), position, value; while (elem.length && elem[0] !== document) { position = elem.css("position"); if (position === "absolute" || position === "relative" || position === "fixed") { value = parseInt(elem.css("zIndex"), 10); if (!isNaN(value) && value !== 0) return value } elem = elem.parent() } }, _refreshTimepicker: function (target) { var inst = this._getInst(target); if (inst) this._updateTimepicker(inst) }, _updateTimepicker: function (inst) {
            inst.tpDiv.empty().append(this._generateHTML(inst));
            this._rebindDialogEvents(inst)
        }, _rebindDialogEvents: function (inst) {
            var borders = $.timepicker._getBorders(inst.tpDiv), self = this; inst.tpDiv.find("iframe.ui-timepicker-cover").css({ left: -borders[0], top: -borders[1], width: inst.tpDiv.outerWidth(), height: inst.tpDiv.outerHeight() }).end().find(".ui-timepicker-minute-cell").unbind().bind("click", { fromDoubleClick: false }, $.proxy($.timepicker.selectMinutes, this)).bind("dblclick", { fromDoubleClick: true }, $.proxy($.timepicker.selectMinutes, this)).end().find(".ui-timepicker-hour-cell").unbind().bind("click",
            { fromDoubleClick: false }, $.proxy($.timepicker.selectHours, this)).bind("dblclick", { fromDoubleClick: true }, $.proxy($.timepicker.selectHours, this)).end().find(".ui-timepicker td a").unbind().bind("mouseout", function () { $(this).removeClass("ui-state-hover"); if (this.className.indexOf("ui-timepicker-prev") != -1) $(this).removeClass("ui-timepicker-prev-hover"); if (this.className.indexOf("ui-timepicker-next") != -1) $(this).removeClass("ui-timepicker-next-hover") }).bind("mouseover", function () {
                if (!self._isDisabledTimepicker(inst.inline ?
                inst.tpDiv.parent()[0] : inst.input[0])) { $(this).parents(".ui-timepicker-calendar").find("a").removeClass("ui-state-hover"); $(this).addClass("ui-state-hover"); if (this.className.indexOf("ui-timepicker-prev") != -1) $(this).addClass("ui-timepicker-prev-hover"); if (this.className.indexOf("ui-timepicker-next") != -1) $(this).addClass("ui-timepicker-next-hover") }
            }).end().find("." + this._dayOverClass + " a").trigger("mouseover").end().find(".ui-timepicker-now").bind("click", function (e) { $.timepicker.selectNow(e) }).end().find(".ui-timepicker-deselect").bind("click",
            function (e) { $.timepicker.deselectTime(e) }).end().find(".ui-timepicker-close").bind("click", function (e) { $.timepicker._hideTimepicker() }).end()
        }, _generateHTML: function (inst) {
            var h, m, row, col, html, hoursHtml, minutesHtml = "", showPeriod = this._get(inst, "showPeriod") == true, showPeriodLabels = this._get(inst, "showPeriodLabels") == true, showLeadingZero = this._get(inst, "showLeadingZero") == true, showHours = this._get(inst, "showHours") == true, showMinutes = this._get(inst, "showMinutes") == true, amPmText = this._get(inst, "amPmText"),
            rows = this._get(inst, "rows"), amRows = 0, pmRows = 0, amItems = 0, pmItems = 0, amFirstRow = 0, pmFirstRow = 0, hours = Array(), hours_options = this._get(inst, "hours"), hoursPerRow = null, hourCounter = 0, hourLabel = this._get(inst, "hourText"), showCloseButton = this._get(inst, "showCloseButton"), closeButtonText = this._get(inst, "closeButtonText"), showNowButton = this._get(inst, "showNowButton"), nowButtonText = this._get(inst, "nowButtonText"), showDeselectButton = this._get(inst, "showDeselectButton"), deselectButtonText = this._get(inst, "deselectButtonText"),
            showButtonPanel = showCloseButton || showNowButton || showDeselectButton; for (h = hours_options.starts; h <= hours_options.ends; h++) hours.push(h); hoursPerRow = Math.ceil(hours.length / rows); if (showPeriodLabels) {
                for (hourCounter = 0; hourCounter < hours.length; hourCounter++) if (hours[hourCounter] < 12) amItems++; else pmItems++; hourCounter = 0; amRows = Math.floor(amItems / hours.length * rows); pmRows = Math.floor(pmItems / hours.length * rows); if (rows != amRows + pmRows) if (amItems && (!pmItems || !amRows || pmRows && amItems / amRows >= pmItems / pmRows)) amRows++;
                else pmRows++; amFirstRow = Math.min(amRows, 1); pmFirstRow = amRows + 1; if (amRows == 0) hoursPerRow = Math.ceil(pmItems / pmRows); else if (pmRows == 0) hoursPerRow = Math.ceil(amItems / amRows); else hoursPerRow = Math.ceil(Math.max(amItems / amRows, pmItems / pmRows))
            } html = '<table class="ui-timepicker-table ui-widget-content ui-corner-all"><tr>'; if (showHours) {
                html += '<td class="ui-timepicker-hours">' + '<div class="ui-timepicker-title ui-widget-header ui-helper-clearfix ui-corner-all">' + hourLabel + "</div>" + '<table class="ui-timepicker">';
                for (row = 1; row <= rows; row++) {
                    html += "<tr>"; if (row == amFirstRow && showPeriodLabels) html += '<th rowspan="' + amRows.toString() + '" class="periods" scope="row">' + amPmText[0] + "</th>"; if (row == pmFirstRow && showPeriodLabels) html += '<th rowspan="' + pmRows.toString() + '" class="periods" scope="row">' + amPmText[1] + "</th>"; for (col = 1; col <= hoursPerRow; col++) if (showPeriodLabels && row < pmFirstRow && hours[hourCounter] >= 12) html += this._generateHTMLHourCell(inst, undefined, showPeriod, showLeadingZero); else {
                        html += this._generateHTMLHourCell(inst,
                        hours[hourCounter], showPeriod, showLeadingZero); hourCounter++
                    } html += "</tr>"
                } html += "</table>" + "</td>"
            } if (showMinutes) { html += '<td class="ui-timepicker-minutes">'; html += this._generateHTMLMinutes(inst); html += "</td>" } html += "</tr>"; if (showButtonPanel) {
                var buttonPanel = '<tr><td colspan="3"><div class="ui-timepicker-buttonpane ui-widget-content">'; if (showNowButton) buttonPanel += '<button type="button" class="ui-timepicker-now ui-state-default ui-corner-all" ' + ' data-timepicker-instance-id="#' + inst.id.replace(/\\\\/g,
                "\\") + '" >' + nowButtonText + "</button>"; if (showDeselectButton) buttonPanel += '<button type="button" class="ui-timepicker-deselect ui-state-default ui-corner-all" ' + ' data-timepicker-instance-id="#' + inst.id.replace(/\\\\/g, "\\") + '" >' + deselectButtonText + "</button>"; if (showCloseButton) buttonPanel += '<button type="button" class="ui-timepicker-close ui-state-default ui-corner-all" ' + ' data-timepicker-instance-id="#' + inst.id.replace(/\\\\/g, "\\") + '" >' + closeButtonText + "</button>"; html += buttonPanel + "</div></td></tr>"
            } html +=
            "</table>"; return html
        }, _updateMinuteDisplay: function (inst) { var newHtml = this._generateHTMLMinutes(inst); inst.tpDiv.find("td.ui-timepicker-minutes").html(newHtml); this._rebindDialogEvents(inst) }, _generateHTMLMinutes: function (inst) {
            var m, row, html = "", rows = this._get(inst, "rows"), minutes = Array(), minutes_options = this._get(inst, "minutes"), minutesPerRow = null, minuteCounter = 0, showMinutesLeadingZero = this._get(inst, "showMinutesLeadingZero") == true, onMinuteShow = this._get(inst, "onMinuteShow"), minuteLabel = this._get(inst,
            "minuteText"); if (!minutes_options.starts) minutes_options.starts = 0; if (!minutes_options.ends) minutes_options.ends = 59; for (m = minutes_options.starts; m <= minutes_options.ends; m += minutes_options.interval) minutes.push(m); minutesPerRow = Math.round(minutes.length / rows + 0.49); if (onMinuteShow && onMinuteShow.apply(inst.input ? inst.input[0] : null, [inst.hours, inst.minutes]) == false) for (minuteCounter = 0; minuteCounter < minutes.length; minuteCounter += 1) {
                m = minutes[minuteCounter]; if (onMinuteShow.apply(inst.input ? inst.input[0] :
                null, [inst.hours, m])) { inst.minutes = m; break }
            } html += '<div class="ui-timepicker-title ui-widget-header ui-helper-clearfix ui-corner-all">' + minuteLabel + "</div>" + '<table class="ui-timepicker">'; minuteCounter = 0; for (row = 1; row <= rows; row++) { html += "<tr>"; while (minuteCounter < row * minutesPerRow) { var m = minutes[minuteCounter]; var displayText = ""; if (m !== undefined) displayText = m < 10 && showMinutesLeadingZero ? "0" + m.toString() : m.toString(); html += this._generateHTMLMinuteCell(inst, m, displayText); minuteCounter++ } html += "</tr>" } html +=
            "</table>"; return html
        }, _generateHTMLHourCell: function (inst, hour, showPeriod, showLeadingZero) {
            var displayHour = hour; if (hour > 12 && showPeriod) displayHour = hour - 12; if (displayHour == 0 && showPeriod) displayHour = 12; if (displayHour < 10 && showLeadingZero) displayHour = "0" + displayHour; var html = ""; var enabled = true; var onHourShow = this._get(inst, "onHourShow"); if (hour == undefined) { html = '<td><span class="ui-state-default ui-state-disabled">&nbsp;</span></td>'; return html } if (onHourShow) enabled = onHourShow.apply(inst.input ? inst.input[0] :
            null, [hour]); if (enabled) html = '<td class="ui-timepicker-hour-cell" data-timepicker-instance-id="#' + inst.id.replace(/\\\\/g, "\\") + '" data-hour="' + hour.toString() + '">' + '<a class="ui-state-default ' + (hour == inst.hours ? "ui-state-active" : "") + '">' + displayHour.toString() + "</a></td>"; else html = "<td>" + '<span class="ui-state-default ui-state-disabled ' + (hour == inst.hours ? " ui-state-active " : " ") + '">' + displayHour.toString() + "</span>" + "</td>"; return html
        }, _generateHTMLMinuteCell: function (inst, minute, displayText) {
            var html =
            ""; var enabled = true; var onMinuteShow = this._get(inst, "onMinuteShow"); if (onMinuteShow) enabled = onMinuteShow.apply(inst.input ? inst.input[0] : null, [inst.hours, minute]); if (minute == undefined) { html = '<td><span class="ui-state-default ui-state-disabled">&nbsp;</span></td>'; return html } if (enabled) html = '<td class="ui-timepicker-minute-cell" data-timepicker-instance-id="#' + inst.id.replace(/\\\\/g, "\\") + '" data-minute="' + minute.toString() + '" >' + '<a class="ui-state-default ' + (minute == inst.minutes ? "ui-state-active" :
            "") + '" >' + displayText + "</a></td>"; else html = "<td>" + '<span class="ui-state-default ui-state-disabled" >' + displayText + "</span>" + "</td>"; return html
        }, _destroyTimepicker: function (target) {
            var $target = $(target); var inst = $.data(target, PROP_NAME); if (!$target.hasClass(this.markerClassName)) return; var nodeName = target.nodeName.toLowerCase(); $.removeData(target, PROP_NAME); if (nodeName == "input") {
                inst.append.remove(); inst.trigger.remove(); $target.removeClass(this.markerClassName).unbind("focus.timepicker", this._showTimepicker).unbind("click.timepicker",
                this._adjustZIndex)
            } else if (nodeName == "div" || nodeName == "span") $target.removeClass(this.markerClassName).empty()
        }, _enableTimepicker: function (target) {
            var $target = $(target), target_id = $target.attr("id"), inst = $.data(target, PROP_NAME); if (!$target.hasClass(this.markerClassName)) return; var nodeName = target.nodeName.toLowerCase(); if (nodeName == "input") {
                target.disabled = false; var button = this._get(inst, "button"); $(button).removeClass("ui-state-disabled").disabled = false; inst.trigger.filter("button").each(function () {
                    this.disabled =
                    false
                }).end()
            } else if (nodeName == "div" || nodeName == "span") { var inline = $target.children("." + this._inlineClass); inline.children().removeClass("ui-state-disabled"); inline.find("button").each(function () { this.disabled = false }) } this._disabledInputs = $.map(this._disabledInputs, function (value) { return value == target_id ? null : value })
        }, _disableTimepicker: function (target) {
            var $target = $(target); var inst = $.data(target, PROP_NAME); if (!$target.hasClass(this.markerClassName)) return; var nodeName = target.nodeName.toLowerCase();
            if (nodeName == "input") { var button = this._get(inst, "button"); $(button).addClass("ui-state-disabled").disabled = true; target.disabled = true; inst.trigger.filter("button").each(function () { this.disabled = true }).end() } else if (nodeName == "div" || nodeName == "span") { var inline = $target.children("." + this._inlineClass); inline.children().addClass("ui-state-disabled"); inline.find("button").each(function () { this.disabled = true }) } this._disabledInputs = $.map(this._disabledInputs, function (value) { return value == target ? null : value });
            this._disabledInputs[this._disabledInputs.length] = $target.attr("id")
        }, _isDisabledTimepicker: function (target_id) { if (!target_id) return false; for (var i = 0; i < this._disabledInputs.length; i++) if (this._disabledInputs[i] == target_id) return true; return false }, _checkOffset: function (inst, offset, isFixed) {
            var tpWidth = inst.tpDiv.outerWidth(); var tpHeight = inst.tpDiv.outerHeight(); var inputWidth = inst.input ? inst.input.outerWidth() : 0; var inputHeight = inst.input ? inst.input.outerHeight() : 0; var viewWidth = document.documentElement.clientWidth +
            $(document).scrollLeft(); var viewHeight = document.documentElement.clientHeight + $(document).scrollTop(); offset.left -= this._get(inst, "isRTL") ? tpWidth - inputWidth : 0; offset.left -= isFixed && offset.left == inst.input.offset().left ? $(document).scrollLeft() : 0; offset.top -= isFixed && offset.top == inst.input.offset().top + inputHeight ? $(document).scrollTop() : 0; offset.left -= Math.min(offset.left, offset.left + tpWidth > viewWidth && viewWidth > tpWidth ? Math.abs(offset.left + tpWidth - viewWidth) : 0); offset.top -= Math.min(offset.top, offset.top +
            tpHeight > viewHeight && viewHeight > tpHeight ? Math.abs(tpHeight + inputHeight) : 0); return offset
        }, _findPos: function (obj) { var inst = this._getInst(obj); var isRTL = this._get(inst, "isRTL"); while (obj && (obj.type == "hidden" || obj.nodeType != 1)) obj = obj[isRTL ? "previousSibling" : "nextSibling"]; var position = $(obj).offset(); return [position.left, position.top] }, _getBorders: function (elem) { var convert = function (value) { return { thin: 1, medium: 2, thick: 3 }[value] || value }; return [parseFloat(convert(elem.css("border-left-width"))), parseFloat(convert(elem.css("border-top-width")))] },
        _checkExternalClick: function (event) { if (!$.timepicker._curInst) return; var $target = $(event.target); if ($target[0].id != $.timepicker._mainDivId && $target.parents("#" + $.timepicker._mainDivId).length == 0 && !$target.hasClass($.timepicker.markerClassName) && !$target.hasClass($.timepicker._triggerClass) && $.timepicker._timepickerShowing && !($.timepicker._inDialog && $.blockUI)) $.timepicker._hideTimepicker() }, _hideTimepicker: function (input) {
            var inst = this._curInst; if (!inst || input && inst != $.data(input, PROP_NAME)) return;
            if (this._timepickerShowing) {
                var showAnim = this._get(inst, "showAnim"); var duration = this._get(inst, "duration"); var postProcess = function () { $.timepicker._tidyDialog(inst); this._curInst = null }; if ($.effects && $.effects[showAnim]) inst.tpDiv.hide(showAnim, $.timepicker._get(inst, "showOptions"), duration, postProcess); else inst.tpDiv[showAnim == "slideDown" ? "slideUp" : showAnim == "fadeIn" ? "fadeOut" : "hide"](showAnim ? duration : null, postProcess); if (!showAnim) postProcess(); this._timepickerShowing = false; this._lastInput = null;
                if (this._inDialog) { this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }); if ($.blockUI) { $.unblockUI(); $("body").append(this.tpDiv) } } this._inDialog = false; var onClose = this._get(inst, "onClose"); if (onClose) onClose.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : "", inst])
            }
        }, _tidyDialog: function (inst) { inst.tpDiv.removeClass(this._dialogClass).unbind(".ui-timepicker") }, _getInst: function (target) {
            try { return $.data(target, PROP_NAME) } catch (err) {
                throw "Missing instance data for this timepicker";
            }
        }, _get: function (inst, name) { return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name] }, _setTimeFromField: function (inst) {
            if (inst.input.val() == inst.lastVal) return; var defaultTime = this._get(inst, "defaultTime"); var timeToParse = defaultTime == "now" ? this._getCurrentTimeRounded(inst) : defaultTime; if (inst.inline == false && inst.input.val() != "") timeToParse = inst.input.val(); if (timeToParse instanceof Date) { inst.hours = timeToParse.getHours(); inst.minutes = timeToParse.getMinutes() } else {
                var timeVal =
                inst.lastVal = timeToParse; if (timeToParse == "") { inst.hours = -1; inst.minutes = -1 } else { var time = this.parseTime(inst, timeVal); inst.hours = time.hours; inst.minutes = time.minutes }
            } $.timepicker._updateTimepicker(inst)
        }, _optionTimepicker: function (target, name, value) {
            var inst = this._getInst(target); if (arguments.length == 2 && typeof name == "string") return name == "defaults" ? $.extend({}, $.timepicker._defaults) : inst ? name == "all" ? $.extend({}, inst.settings) : this._get(inst, name) : null; var settings = name || {}; if (typeof name == "string") {
                settings =
                {}; settings[name] = value
            } if (inst) { if (this._curInst == inst) this._hideTimepicker(); extendRemove(inst.settings, settings); this._updateTimepicker(inst) }
        }, _setTimeTimepicker: function (target, time) { var inst = this._getInst(target); if (inst) { this._setTime(inst, time); this._updateTimepicker(inst); this._updateAlternate(inst, time) } }, _setTime: function (inst, time, noChange) {
            var origHours = inst.hours; var origMinutes = inst.minutes; if (time instanceof Date) { inst.hours = time.getHours(); inst.minutes = time.getMinutes() } else {
                var time =
                this.parseTime(inst, time); inst.hours = time.hours; inst.minutes = time.minutes
            } if ((origHours != inst.hours || origMinutes != inst.minutes) && !noChange) inst.input.trigger("change"); this._updateTimepicker(inst); this._updateSelectedValue(inst)
        }, _getCurrentTimeRounded: function (inst) { var currentTime = new Date, currentMinutes = currentTime.getMinutes(), adjustedMinutes = Math.round(currentMinutes / 5) * 5; currentTime.setMinutes(adjustedMinutes); return currentTime }, parseTime: function (inst, timeVal) {
            var retVal = new Object; retVal.hours =
            -1; retVal.minutes = -1; if (!timeVal) return ""; var timeSeparator = this._get(inst, "timeSeparator"), amPmText = this._get(inst, "amPmText"), showHours = this._get(inst, "showHours"), showMinutes = this._get(inst, "showMinutes"), optionalMinutes = this._get(inst, "optionalMinutes"), showPeriod = this._get(inst, "showPeriod") == true, p = timeVal.indexOf(timeSeparator); if (p != -1) { retVal.hours = parseInt(timeVal.substr(0, p), 10); retVal.minutes = parseInt(timeVal.substr(p + 1), 10) } else if (showHours && (!showMinutes || optionalMinutes)) retVal.hours =
            parseInt(timeVal, 10); else if (!showHours && showMinutes) retVal.minutes = parseInt(timeVal, 10); if (showHours) { var timeValUpper = timeVal.toUpperCase(); if (retVal.hours < 12 && showPeriod && timeValUpper.indexOf(amPmText[1].toUpperCase()) != -1) retVal.hours += 12; if (retVal.hours == 12 && showPeriod && timeValUpper.indexOf(amPmText[0].toUpperCase()) != -1) retVal.hours = 0 } return retVal
        }, selectNow: function (event) {
            var id = $(event.target).attr("data-timepicker-instance-id"), $target = $(id), inst = this._getInst($target[0]); var currentTime =
            new Date; inst.hours = currentTime.getHours(); inst.minutes = currentTime.getMinutes(); this._updateSelectedValue(inst); this._updateTimepicker(inst); this._hideTimepicker()
        }, deselectTime: function (event) { var id = $(event.target).attr("data-timepicker-instance-id"), $target = $(id), inst = this._getInst($target[0]); inst.hours = -1; inst.minutes = -1; this._updateSelectedValue(inst); this._hideTimepicker() }, selectHours: function (event) {
            var $td = $(event.currentTarget), id = $td.attr("data-timepicker-instance-id"), newHours = parseInt($td.attr("data-hour")),
            fromDoubleClick = event.data.fromDoubleClick, $target = $(id), inst = this._getInst($target[0]), showMinutes = this._get(inst, "showMinutes") == true; if ($.timepicker._isDisabledTimepicker($target.attr("id"))) return false; $td.parents(".ui-timepicker-hours:first").find("a").removeClass("ui-state-active"); $td.children("a").addClass("ui-state-active"); inst.hours = newHours; var onMinuteShow = this._get(inst, "onMinuteShow"); if (onMinuteShow) this._updateMinuteDisplay(inst); this._updateSelectedValue(inst); inst._hoursClicked =
            true; if (inst._minutesClicked || fromDoubleClick || showMinutes == false) $.timepicker._hideTimepicker(); return false
        }, selectMinutes: function (event) {
            var $td = $(event.currentTarget), id = $td.attr("data-timepicker-instance-id"), newMinutes = parseInt($td.attr("data-minute")), fromDoubleClick = event.data.fromDoubleClick, $target = $(id), inst = this._getInst($target[0]), showHours = this._get(inst, "showHours") == true; if ($.timepicker._isDisabledTimepicker($target.attr("id"))) return false; $td.parents(".ui-timepicker-minutes:first").find("a").removeClass("ui-state-active");
            $td.children("a").addClass("ui-state-active"); inst.minutes = newMinutes; this._updateSelectedValue(inst); inst._minutesClicked = true; if (inst._hoursClicked || fromDoubleClick || showHours == false) { $.timepicker._hideTimepicker(); return false } return false
        }, _updateSelectedValue: function (inst) {
            var newTime = this._getParsedTime(inst); if (inst.input) { inst.input.val(newTime); inst.input.trigger("change") } var onSelect = this._get(inst, "onSelect"); if (onSelect) onSelect.apply(inst.input ? inst.input[0] : null, [newTime, inst]); this._updateAlternate(inst,
            newTime); return newTime
        }, _getParsedTime: function (inst) {
            if (inst.hours == -1 && inst.minutes == -1) return ""; if (inst.hours < inst.hours.starts || inst.hours > inst.hours.ends) inst.hours = 0; if (inst.minutes < inst.minutes.starts || inst.minutes > inst.minutes.ends) inst.minutes = 0; var period = "", showPeriod = this._get(inst, "showPeriod") == true, showLeadingZero = this._get(inst, "showLeadingZero") == true, showHours = this._get(inst, "showHours") == true, showMinutes = this._get(inst, "showMinutes") == true, optionalMinutes = this._get(inst, "optionalMinutes") ==
            true, amPmText = this._get(inst, "amPmText"), selectedHours = inst.hours ? inst.hours : 0, selectedMinutes = inst.minutes ? inst.minutes : 0, displayHours = selectedHours ? selectedHours : 0, parsedTime = ""; if (displayHours == -1) displayHours = 0; if (selectedMinutes == -1) selectedMinutes = 0; if (showPeriod) { if (inst.hours == 0) displayHours = 12; if (inst.hours < 12) period = amPmText[0]; else { period = amPmText[1]; if (displayHours > 12) displayHours -= 12 } } var h = displayHours.toString(); if (showLeadingZero && displayHours < 10) h = "0" + h; var m = selectedMinutes.toString();
            if (selectedMinutes < 10) m = "0" + m; if (showHours) parsedTime += h; if (showHours && showMinutes && (!optionalMinutes || m != 0)) parsedTime += this._get(inst, "timeSeparator"); if (showMinutes && (!optionalMinutes || m != 0)) parsedTime += m; if (showHours) if (period.length > 0) parsedTime += this._get(inst, "periodSeparator") + period; return parsedTime
        }, _updateAlternate: function (inst, newTime) { var altField = this._get(inst, "altField"); if (altField) $(altField).each(function (i, e) { $(e).val(newTime) }) }, _getTimeAsDateTimepicker: function (input) {
            var inst =
            this._getInst(input); if (inst.hours == -1 && inst.minutes == -1) return ""; if (inst.hours < inst.hours.starts || inst.hours > inst.hours.ends) inst.hours = 0; if (inst.minutes < inst.minutes.starts || inst.minutes > inst.minutes.ends) inst.minutes = 0; return new Date(0, 0, 0, inst.hours, inst.minutes, 0)
        }, _getTimeTimepicker: function (input) { var inst = this._getInst(input); return this._getParsedTime(inst) }, _getHourTimepicker: function (input) { var inst = this._getInst(input); if (inst == undefined) return -1; return inst.hours }, _getMinuteTimepicker: function (input) {
            var inst =
            this._getInst(input); if (inst == undefined) return -1; return inst.minutes
        }
    }); $.fn.timepicker = function (options) {
        if (!$.timepicker.initialized) { $(document).mousedown($.timepicker._checkExternalClick).find("body").append($.timepicker.tpDiv); $.timepicker.initialized = true } var otherArgs = Array.prototype.slice.call(arguments, 1); if (typeof options == "string" && (options == "getTime" || options == "getTimeAsDate" || options == "getHour" || options == "getMinute")) return $.timepicker["_" + options + "Timepicker"].apply($.timepicker, [this[0]].concat(otherArgs));
        if (options == "option" && arguments.length == 2 && typeof arguments[1] == "string") return $.timepicker["_" + options + "Timepicker"].apply($.timepicker, [this[0]].concat(otherArgs)); return this.each(function () { typeof options == "string" ? $.timepicker["_" + options + "Timepicker"].apply($.timepicker, [this].concat(otherArgs)) : $.timepicker._attachTimepicker(this, options) })
    }; function extendRemove(target, props) {
        $.extend(target, props); for (var name in props) if (props[name] == null || props[name] == undefined) target[name] = props[name];
        return target
    } $.timepicker = new Timepicker; $.timepicker.initialized = false; $.timepicker.uuid = (new Date).getTime(); $.timepicker.version = "0.3.2"; window["TP_jQuery_" + tpuuid] = $
})(jQuery);
