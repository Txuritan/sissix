(() => {
  // src/libraries/mithril.js
  function e(e2, t2, n2, r2, o2, l2) {
    return { tag: e2, key: t2, attrs: n2, children: r2, text: o2, dom: l2, domSize: void 0, state: void 0, events: void 0, instance: void 0 };
  }
  e.normalize = function(t2) {
    return Array.isArray(t2) ? e("[", void 0, void 0, e.normalizeChildren(t2), void 0, void 0) : null == t2 || "boolean" == typeof t2 ? null : "object" == typeof t2 ? t2 : e("#", void 0, void 0, String(t2), void 0, void 0);
  }, e.normalizeChildren = function(t2) {
    var n2 = [];
    if (t2.length) {
      for (var r2 = null != t2[0] && null != t2[0].key, o2 = 1; o2 < t2.length; o2++) if ((null != t2[o2] && null != t2[o2].key) !== r2) throw new TypeError(!r2 || null == t2[o2] && "boolean" != typeof t2[o2] ? "In fragments, vnodes must either all have keys or none have keys." : "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole.");
      for (o2 = 0; o2 < t2.length; o2++) n2[o2] = e.normalize(t2[o2]);
    }
    return n2;
  };
  var t = e;
  var n = t;
  var r = function() {
    var e2, t2 = arguments[this], r2 = this + 1;
    if (null == t2 ? t2 = {} : ("object" != typeof t2 || null != t2.tag || Array.isArray(t2)) && (t2 = {}, r2 = this), arguments.length === r2 + 1) e2 = arguments[r2], Array.isArray(e2) || (e2 = [e2]);
    else for (e2 = []; r2 < arguments.length; ) e2.push(arguments[r2++]);
    return n("", t2.key, t2, e2);
  };
  var o = {}.hasOwnProperty;
  var l = t;
  var a = r;
  var i = o;
  var s = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
  var u = {};
  function f(e2) {
    for (var t2 in e2) if (i.call(e2, t2)) return false;
    return true;
  }
  var c = function(e2) {
    if (null == e2 || "string" != typeof e2 && "function" != typeof e2 && "function" != typeof e2.view) throw Error("The selector must be either a string or a component.");
    var t2 = a.apply(1, arguments);
    return "string" == typeof e2 && (t2.children = l.normalizeChildren(t2.children), "[" !== e2) ? function(e3, t3) {
      var n2 = t3.attrs, r2 = i.call(n2, "class"), o2 = r2 ? n2.class : n2.className;
      if (t3.tag = e3.tag, t3.attrs = {}, !f(e3.attrs) && !f(n2)) {
        var l2 = {};
        for (var a2 in n2) i.call(n2, a2) && (l2[a2] = n2[a2]);
        n2 = l2;
      }
      for (var a2 in e3.attrs) i.call(e3.attrs, a2) && "className" !== a2 && !i.call(n2, a2) && (n2[a2] = e3.attrs[a2]);
      for (var a2 in null == o2 && null == e3.attrs.className || (n2.className = null != o2 ? null != e3.attrs.className ? String(e3.attrs.className) + " " + String(o2) : o2 : null != e3.attrs.className ? e3.attrs.className : null), r2 && (n2.class = null), n2) if (i.call(n2, a2) && "key" !== a2) {
        t3.attrs = n2;
        break;
      }
      return t3;
    }(u[e2] || function(e3) {
      for (var t3, n2 = "div", r2 = [], o2 = {}; t3 = s.exec(e3); ) {
        var l2 = t3[1], a2 = t3[2];
        if ("" === l2 && "" !== a2) n2 = a2;
        else if ("#" === l2) o2.id = a2;
        else if ("." === l2) r2.push(a2);
        else if ("[" === t3[3][0]) {
          var i2 = t3[6];
          i2 && (i2 = i2.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")), "class" === t3[4] ? r2.push(i2) : o2[t3[4]] = "" === i2 ? i2 : i2 || true;
        }
      }
      return r2.length > 0 && (o2.className = r2.join(" ")), u[e3] = { tag: n2, attrs: o2 };
    }(e2), t2) : (t2.tag = e2, t2);
  };
  var d = t;
  var p = t;
  var m = r;
  var v = c;
  v.trust = function(e2) {
    return null == e2 && (e2 = ""), d("<", void 0, void 0, e2, void 0, void 0);
  }, v.fragment = function() {
    var e2 = m.apply(0, arguments);
    return e2.tag = "[", e2.children = p.normalizeChildren(e2.children), e2;
  };
  var h = v;
  var y = /* @__PURE__ */ new WeakMap();
  var g = { delayedRemoval: y, domFor: function* ({ dom: e2, domSize: t2 }, { generation: n2 } = {}) {
    if (null != e2) do {
      const { nextSibling: r2 } = e2;
      y.get(e2) === n2 && (yield e2, t2--), e2 = r2;
    } while (t2);
  } };
  var w = t;
  var b = g.delayedRemoval;
  var x = g.domFor;
  var k = function(e2) {
    var t2, n2, r2 = e2 && e2.document, o2 = { svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML" };
    function l2(e3) {
      return e3.attrs && e3.attrs.xmlns || o2[e3.tag];
    }
    function a2(e3, t3) {
      if (e3.state !== t3) throw new Error("'vnode.state' must not be modified.");
    }
    function i2(e3) {
      var t3 = e3.state;
      try {
        return this.apply(t3, arguments);
      } finally {
        a2(e3, t3);
      }
    }
    function s2() {
      try {
        return r2.activeElement;
      } catch (e3) {
        return null;
      }
    }
    function u2(e3, t3, n3, r3, o3, l3, a3) {
      for (var i3 = n3; i3 < r3; i3++) {
        var s3 = t3[i3];
        null != s3 && f2(e3, s3, o3, a3, l3);
      }
    }
    function f2(e3, t3, n3, o3, a3) {
      var s3 = t3.tag;
      if ("string" == typeof s3) switch (t3.state = {}, null != t3.attrs && q2(t3.attrs, t3, n3), s3) {
        case "#":
          !function(e4, t4, n4) {
            t4.dom = r2.createTextNode(t4.children), k2(e4, t4.dom, n4);
          }(e3, t3, a3);
          break;
        case "<":
          d2(e3, t3, o3, a3);
          break;
        case "[":
          !function(e4, t4, n4, o4, l3) {
            var a4 = r2.createDocumentFragment();
            if (null != t4.children) {
              var i3 = t4.children;
              u2(a4, i3, 0, i3.length, n4, null, o4);
            }
            t4.dom = a4.firstChild, t4.domSize = a4.childNodes.length, k2(e4, a4, l3);
          }(e3, t3, n3, o3, a3);
          break;
        default:
          !function(e4, t4, n4, o4, a4) {
            var i3 = t4.tag, s4 = t4.attrs, f3 = s4 && s4.is;
            o4 = l2(t4) || o4;
            var c3 = o4 ? f3 ? r2.createElementNS(o4, i3, { is: f3 }) : r2.createElementNS(o4, i3) : f3 ? r2.createElement(i3, { is: f3 }) : r2.createElement(i3);
            t4.dom = c3, null != s4 && function(e5, t5, n5) {
              "input" === e5.tag && null != t5.type && e5.dom.setAttribute("type", t5.type);
              var r3 = null != t5 && "input" === e5.tag && "file" === t5.type;
              for (var o5 in t5) C2(e5, o5, null, t5[o5], n5, r3);
            }(t4, s4, o4);
            if (k2(e4, c3, a4), !S2(t4) && null != t4.children) {
              var d3 = t4.children;
              u2(c3, d3, 0, d3.length, n4, null, o4), "select" === t4.tag && null != s4 && function(e5, t5) {
                if ("value" in t5) if (null === t5.value) -1 !== e5.dom.selectedIndex && (e5.dom.value = null);
                else {
                  var n5 = "" + t5.value;
                  e5.dom.value === n5 && -1 !== e5.dom.selectedIndex || (e5.dom.value = n5);
                }
                "selectedIndex" in t5 && C2(e5, "selectedIndex", null, t5.selectedIndex, void 0);
              }(t4, s4);
            }
          }(e3, t3, n3, o3, a3);
      }
      else !function(e4, t4, n4, r3, o4) {
        (function(e5, t5) {
          var n5;
          if ("function" == typeof e5.tag.view) {
            if (e5.state = Object.create(e5.tag), null != (n5 = e5.state.view).$$reentrantLock$$) return;
            n5.$$reentrantLock$$ = true;
          } else {
            if (e5.state = void 0, null != (n5 = e5.tag).$$reentrantLock$$) return;
            n5.$$reentrantLock$$ = true, e5.state = null != e5.tag.prototype && "function" == typeof e5.tag.prototype.view ? new e5.tag(e5) : e5.tag(e5);
          }
          q2(e5.state, e5, t5), null != e5.attrs && q2(e5.attrs, e5, t5);
          if (e5.instance = w.normalize(i2.call(e5.state.view, e5)), e5.instance === e5) throw Error("A view cannot return the vnode it received as argument");
          n5.$$reentrantLock$$ = null;
        })(t4, n4), null != t4.instance ? (f2(e4, t4.instance, n4, r3, o4), t4.dom = t4.instance.dom, t4.domSize = null != t4.dom ? t4.instance.domSize : 0) : t4.domSize = 0;
      }(e3, t3, n3, o3, a3);
    }
    var c2 = { caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup" };
    function d2(e3, t3, n3, o3) {
      var l3 = t3.children.match(/^\s*?<(\w+)/im) || [], a3 = r2.createElement(c2[l3[1]] || "div");
      "http://www.w3.org/2000/svg" === n3 ? (a3.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + t3.children + "</svg>", a3 = a3.firstChild) : a3.innerHTML = t3.children, t3.dom = a3.firstChild, t3.domSize = a3.childNodes.length;
      for (var i3, s3 = r2.createDocumentFragment(); i3 = a3.firstChild; ) s3.appendChild(i3);
      k2(e3, s3, o3);
    }
    function p2(e3, t3, n3, r3, o3, l3) {
      if (t3 !== n3 && (null != t3 || null != n3)) if (null == t3 || 0 === t3.length) u2(e3, n3, 0, n3.length, r3, o3, l3);
      else if (null == n3 || 0 === n3.length) E2(e3, t3, 0, t3.length);
      else {
        var a3 = null != t3[0] && null != t3[0].key, i3 = null != n3[0] && null != n3[0].key, s3 = 0, c3 = 0;
        if (!a3) for (; c3 < t3.length && null == t3[c3]; ) c3++;
        if (!i3) for (; s3 < n3.length && null == n3[s3]; ) s3++;
        if (a3 !== i3) E2(e3, t3, c3, t3.length), u2(e3, n3, s3, n3.length, r3, o3, l3);
        else if (i3) {
          for (var d3, p3, w2, b2, x2, k3 = t3.length - 1, S3 = n3.length - 1; k3 >= c3 && S3 >= s3 && (w2 = t3[k3], b2 = n3[S3], w2.key === b2.key); ) w2 !== b2 && m2(e3, w2, b2, r3, o3, l3), null != b2.dom && (o3 = b2.dom), k3--, S3--;
          for (; k3 >= c3 && S3 >= s3 && (d3 = t3[c3], p3 = n3[s3], d3.key === p3.key); ) c3++, s3++, d3 !== p3 && m2(e3, d3, p3, r3, y2(t3, c3, o3), l3);
          for (; k3 >= c3 && S3 >= s3 && s3 !== S3 && d3.key === b2.key && w2.key === p3.key; ) g2(e3, w2, x2 = y2(t3, c3, o3)), w2 !== p3 && m2(e3, w2, p3, r3, x2, l3), ++s3 <= --S3 && g2(e3, d3, o3), d3 !== b2 && m2(e3, d3, b2, r3, o3, l3), null != b2.dom && (o3 = b2.dom), c3++, w2 = t3[--k3], b2 = n3[S3], d3 = t3[c3], p3 = n3[s3];
          for (; k3 >= c3 && S3 >= s3 && w2.key === b2.key; ) w2 !== b2 && m2(e3, w2, b2, r3, o3, l3), null != b2.dom && (o3 = b2.dom), S3--, w2 = t3[--k3], b2 = n3[S3];
          if (s3 > S3) E2(e3, t3, c3, k3 + 1);
          else if (c3 > k3) u2(e3, n3, s3, S3 + 1, r3, o3, l3);
          else {
            var j3, A3, C3 = o3, O3 = S3 - s3 + 1, T3 = new Array(O3), N3 = 0, $3 = 0, L3 = 2147483647, P3 = 0;
            for ($3 = 0; $3 < O3; $3++) T3[$3] = -1;
            for ($3 = S3; $3 >= s3; $3--) {
              null == j3 && (j3 = v2(t3, c3, k3 + 1));
              var R3 = j3[(b2 = n3[$3]).key];
              null != R3 && (L3 = R3 < L3 ? R3 : -1, T3[$3 - s3] = R3, w2 = t3[R3], t3[R3] = null, w2 !== b2 && m2(e3, w2, b2, r3, o3, l3), null != b2.dom && (o3 = b2.dom), P3++);
            }
            if (o3 = C3, P3 !== k3 - c3 + 1 && E2(e3, t3, c3, k3 + 1), 0 === P3) u2(e3, n3, s3, S3 + 1, r3, o3, l3);
            else if (-1 === L3) for (A3 = function(e4) {
              var t4 = [0], n4 = 0, r4 = 0, o4 = 0, l4 = h2.length = e4.length;
              for (o4 = 0; o4 < l4; o4++) h2[o4] = e4[o4];
              for (o4 = 0; o4 < l4; ++o4) if (-1 !== e4[o4]) {
                var a4 = t4[t4.length - 1];
                if (e4[a4] < e4[o4]) h2[o4] = a4, t4.push(o4);
                else {
                  for (n4 = 0, r4 = t4.length - 1; n4 < r4; ) {
                    var i4 = (n4 >>> 1) + (r4 >>> 1) + (n4 & r4 & 1);
                    e4[t4[i4]] < e4[o4] ? n4 = i4 + 1 : r4 = i4;
                  }
                  e4[o4] < e4[t4[n4]] && (n4 > 0 && (h2[o4] = t4[n4 - 1]), t4[n4] = o4);
                }
              }
              n4 = t4.length, r4 = t4[n4 - 1];
              for (; n4-- > 0; ) t4[n4] = r4, r4 = h2[r4];
              return h2.length = 0, t4;
            }(T3), N3 = A3.length - 1, $3 = S3; $3 >= s3; $3--) p3 = n3[$3], -1 === T3[$3 - s3] ? f2(e3, p3, r3, l3, o3) : A3[N3] === $3 - s3 ? N3-- : g2(e3, p3, o3), null != p3.dom && (o3 = n3[$3].dom);
            else for ($3 = S3; $3 >= s3; $3--) p3 = n3[$3], -1 === T3[$3 - s3] && f2(e3, p3, r3, l3, o3), null != p3.dom && (o3 = n3[$3].dom);
          }
        } else {
          var I3 = t3.length < n3.length ? t3.length : n3.length;
          for (s3 = s3 < c3 ? s3 : c3; s3 < I3; s3++) (d3 = t3[s3]) === (p3 = n3[s3]) || null == d3 && null == p3 || (null == d3 ? f2(e3, p3, r3, l3, y2(t3, s3 + 1, o3)) : null == p3 ? z2(e3, d3) : m2(e3, d3, p3, r3, y2(t3, s3 + 1, o3), l3));
          t3.length > I3 && E2(e3, t3, s3, t3.length), n3.length > I3 && u2(e3, n3, s3, n3.length, r3, o3, l3);
        }
      }
    }
    function m2(e3, t3, n3, r3, o3, a3) {
      var s3 = t3.tag;
      if (s3 === n3.tag) {
        if (n3.state = t3.state, n3.events = t3.events, function(e4, t4) {
          do {
            var n4;
            if (null != e4.attrs && "function" == typeof e4.attrs.onbeforeupdate) {
              if (void 0 !== (n4 = i2.call(e4.attrs.onbeforeupdate, e4, t4)) && !n4) break;
            }
            if ("string" != typeof e4.tag && "function" == typeof e4.state.onbeforeupdate) {
              if (void 0 !== (n4 = i2.call(e4.state.onbeforeupdate, e4, t4)) && !n4) break;
            }
            return false;
          } while (0);
          return e4.dom = t4.dom, e4.domSize = t4.domSize, e4.instance = t4.instance, e4.attrs = t4.attrs, e4.children = t4.children, e4.text = t4.text, true;
        }(n3, t3)) return;
        if ("string" == typeof s3) switch (null != n3.attrs && D2(n3.attrs, n3, r3), s3) {
          case "#":
            !function(e4, t4) {
              e4.children.toString() !== t4.children.toString() && (e4.dom.nodeValue = t4.children);
              t4.dom = e4.dom;
            }(t3, n3);
            break;
          case "<":
            !function(e4, t4, n4, r4, o4) {
              t4.children !== n4.children ? (j2(e4, t4, void 0), d2(e4, n4, r4, o4)) : (n4.dom = t4.dom, n4.domSize = t4.domSize);
            }(e3, t3, n3, a3, o3);
            break;
          case "[":
            !function(e4, t4, n4, r4, o4, l3) {
              p2(e4, t4.children, n4.children, r4, o4, l3);
              var a4 = 0, i3 = n4.children;
              if (n4.dom = null, null != i3) {
                for (var s4 = 0; s4 < i3.length; s4++) {
                  var u3 = i3[s4];
                  null != u3 && null != u3.dom && (null == n4.dom && (n4.dom = u3.dom), a4 += u3.domSize || 1);
                }
                1 !== a4 && (n4.domSize = a4);
              }
            }(e3, t3, n3, r3, o3, a3);
            break;
          default:
            !function(e4, t4, n4, r4) {
              var o4 = t4.dom = e4.dom;
              r4 = l2(t4) || r4, "textarea" === t4.tag && null == t4.attrs && (t4.attrs = {});
              (function(e5, t5, n5, r5) {
                t5 && t5 === n5 && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major");
                if (null != n5) {
                  "input" === e5.tag && null != n5.type && e5.dom.setAttribute("type", n5.type);
                  var o5 = "input" === e5.tag && "file" === n5.type;
                  for (var l3 in n5) C2(e5, l3, t5 && t5[l3], n5[l3], r5, o5);
                }
                var a4;
                if (null != t5) for (var l3 in t5) null == (a4 = t5[l3]) || null != n5 && null != n5[l3] || O2(e5, l3, a4, r5);
              })(t4, e4.attrs, t4.attrs, r4), S2(t4) || p2(o4, e4.children, t4.children, n4, null, r4);
            }(t3, n3, r3, a3);
        }
        else !function(e4, t4, n4, r4, o4, l3) {
          if (n4.instance = w.normalize(i2.call(n4.state.view, n4)), n4.instance === n4) throw Error("A view cannot return the vnode it received as argument");
          D2(n4.state, n4, r4), null != n4.attrs && D2(n4.attrs, n4, r4);
          null != n4.instance ? (null == t4.instance ? f2(e4, n4.instance, r4, l3, o4) : m2(e4, t4.instance, n4.instance, r4, o4, l3), n4.dom = n4.instance.dom, n4.domSize = n4.instance.domSize) : null != t4.instance ? (z2(e4, t4.instance), n4.dom = void 0, n4.domSize = 0) : (n4.dom = t4.dom, n4.domSize = t4.domSize);
        }(e3, t3, n3, r3, o3, a3);
      } else z2(e3, t3), f2(e3, n3, r3, a3, o3);
    }
    function v2(e3, t3, n3) {
      for (var r3 = /* @__PURE__ */ Object.create(null); t3 < n3; t3++) {
        var o3 = e3[t3];
        if (null != o3) {
          var l3 = o3.key;
          null != l3 && (r3[l3] = t3);
        }
      }
      return r3;
    }
    var h2 = [];
    function y2(e3, t3, n3) {
      for (; t3 < e3.length; t3++) if (null != e3[t3] && null != e3[t3].dom) return e3[t3].dom;
      return n3;
    }
    function g2(e3, t3, n3) {
      if (null != t3.dom) {
        var o3;
        if (null == t3.domSize) o3 = t3.dom;
        else for (var l3 of (o3 = r2.createDocumentFragment(), x(t3))) o3.appendChild(l3);
        k2(e3, o3, n3);
      }
    }
    function k2(e3, t3, n3) {
      null != n3 ? e3.insertBefore(t3, n3) : e3.appendChild(t3);
    }
    function S2(e3) {
      if (null == e3.attrs || null == e3.attrs.contenteditable && null == e3.attrs.contentEditable) return false;
      var t3 = e3.children;
      if (null != t3 && 1 === t3.length && "<" === t3[0].tag) {
        var n3 = t3[0].children;
        e3.dom.innerHTML !== n3 && (e3.dom.innerHTML = n3);
      } else if (null != t3 && 0 !== t3.length) throw new Error("Child node of a contenteditable must be trusted.");
      return true;
    }
    function E2(e3, t3, n3, r3) {
      for (var o3 = n3; o3 < r3; o3++) {
        var l3 = t3[o3];
        null != l3 && z2(e3, l3);
      }
    }
    function z2(e3, t3) {
      var r3, o3, l3, s3, u3 = 0, f3 = t3.state;
      "string" != typeof t3.tag && "function" == typeof t3.state.onbeforeremove && (null != (l3 = i2.call(t3.state.onbeforeremove, t3)) && "function" == typeof l3.then && (u3 = 1, r3 = l3));
      t3.attrs && "function" == typeof t3.attrs.onbeforeremove && (null != (l3 = i2.call(t3.attrs.onbeforeremove, t3)) && "function" == typeof l3.then && (u3 |= 2, o3 = l3));
      if (a2(t3, f3), u3) {
        for (var c3 of (s3 = n2, x(t3))) b.set(c3, s3);
        null != r3 && r3.finally(function() {
          1 & u3 && ((u3 &= 2) || (a2(t3, f3), A2(t3), j2(e3, t3, s3)));
        }), null != o3 && o3.finally(function() {
          2 & u3 && ((u3 &= 1) || (a2(t3, f3), A2(t3), j2(e3, t3, s3)));
        });
      } else A2(t3), j2(e3, t3, s3);
    }
    function j2(e3, t3, n3) {
      if (null != t3.dom) if (null == t3.domSize) b.get(t3.dom) === n3 && e3.removeChild(t3.dom);
      else for (var r3 of x(t3, { generation: n3 })) e3.removeChild(r3);
    }
    function A2(e3) {
      if ("string" != typeof e3.tag && "function" == typeof e3.state.onremove && i2.call(e3.state.onremove, e3), e3.attrs && "function" == typeof e3.attrs.onremove && i2.call(e3.attrs.onremove, e3), "string" != typeof e3.tag) null != e3.instance && A2(e3.instance);
      else {
        var t3 = e3.children;
        if (Array.isArray(t3)) for (var n3 = 0; n3 < t3.length; n3++) {
          var r3 = t3[n3];
          null != r3 && A2(r3);
        }
      }
    }
    function C2(e3, t3, n3, o3, l3, a3) {
      if (!("key" === t3 || "is" === t3 || null == o3 || T2(t3) || n3 === o3 && !function(e4, t4) {
        return "value" === t4 || "checked" === t4 || "selectedIndex" === t4 || "selected" === t4 && e4.dom === s2() || "option" === e4.tag && e4.dom.parentNode === r2.activeElement;
      }(e3, t3) && "object" != typeof o3 || "type" === t3 && "input" === e3.tag)) {
        if ("o" === t3[0] && "n" === t3[1]) return _2(e3, t3, o3);
        if ("xlink:" === t3.slice(0, 6)) e3.dom.setAttributeNS("http://www.w3.org/1999/xlink", t3.slice(6), o3);
        else if ("style" === t3) I2(e3.dom, n3, o3);
        else if (N2(e3, t3, l3)) {
          if ("value" === t3) {
            if (("input" === e3.tag || "textarea" === e3.tag) && e3.dom.value === "" + o3 && (a3 || e3.dom === s2())) return;
            if ("select" === e3.tag && null !== n3 && e3.dom.value === "" + o3) return;
            if ("option" === e3.tag && null !== n3 && e3.dom.value === "" + o3) return;
            if (a3 && "" + o3 != "") return void console.error("`value` is read-only on file inputs!");
          }
          e3.dom[t3] = o3;
        } else "boolean" == typeof o3 ? o3 ? e3.dom.setAttribute(t3, "") : e3.dom.removeAttribute(t3) : e3.dom.setAttribute("className" === t3 ? "class" : t3, o3);
      }
    }
    function O2(e3, t3, n3, r3) {
      if ("key" !== t3 && "is" !== t3 && null != n3 && !T2(t3)) if ("o" === t3[0] && "n" === t3[1]) _2(e3, t3, void 0);
      else if ("style" === t3) I2(e3.dom, n3, null);
      else if (!N2(e3, t3, r3) || "className" === t3 || "title" === t3 || "value" === t3 && ("option" === e3.tag || "select" === e3.tag && -1 === e3.dom.selectedIndex && e3.dom === s2()) || "input" === e3.tag && "type" === t3) {
        var o3 = t3.indexOf(":");
        -1 !== o3 && (t3 = t3.slice(o3 + 1)), false !== n3 && e3.dom.removeAttribute("className" === t3 ? "class" : t3);
      } else e3.dom[t3] = null;
    }
    function T2(e3) {
      return "oninit" === e3 || "oncreate" === e3 || "onupdate" === e3 || "onremove" === e3 || "onbeforeremove" === e3 || "onbeforeupdate" === e3;
    }
    function N2(e3, t3, n3) {
      return void 0 === n3 && (e3.tag.indexOf("-") > -1 || null != e3.attrs && e3.attrs.is || "href" !== t3 && "list" !== t3 && "form" !== t3 && "width" !== t3 && "height" !== t3) && t3 in e3.dom;
    }
    var $2, L2 = /[A-Z]/g;
    function P2(e3) {
      return "-" + e3.toLowerCase();
    }
    function R2(e3) {
      return "-" === e3[0] && "-" === e3[1] ? e3 : "cssFloat" === e3 ? "float" : e3.replace(L2, P2);
    }
    function I2(e3, t3, n3) {
      if (t3 === n3) ;
      else if (null == n3) e3.style = "";
      else if ("object" != typeof n3) e3.style = n3;
      else if (null == t3 || "object" != typeof t3) for (var r3 in e3.style.cssText = "", n3) {
        null != (o3 = n3[r3]) && e3.style.setProperty(R2(r3), String(o3));
      }
      else {
        for (var r3 in n3) {
          var o3;
          null != (o3 = n3[r3]) && (o3 = String(o3)) !== String(t3[r3]) && e3.style.setProperty(R2(r3), o3);
        }
        for (var r3 in t3) null != t3[r3] && null == n3[r3] && e3.style.removeProperty(R2(r3));
      }
    }
    function F2() {
      this._ = t2;
    }
    function _2(e3, n3, r3) {
      if (null != e3.events) {
        if (e3.events._ = t2, e3.events[n3] === r3) return;
        null == r3 || "function" != typeof r3 && "object" != typeof r3 ? (null != e3.events[n3] && e3.dom.removeEventListener(n3.slice(2), e3.events, false), e3.events[n3] = void 0) : (null == e3.events[n3] && e3.dom.addEventListener(n3.slice(2), e3.events, false), e3.events[n3] = r3);
      } else null == r3 || "function" != typeof r3 && "object" != typeof r3 || (e3.events = new F2(), e3.dom.addEventListener(n3.slice(2), e3.events, false), e3.events[n3] = r3);
    }
    function q2(e3, t3, n3) {
      "function" == typeof e3.oninit && i2.call(e3.oninit, t3), "function" == typeof e3.oncreate && n3.push(i2.bind(e3.oncreate, t3));
    }
    function D2(e3, t3, n3) {
      "function" == typeof e3.onupdate && n3.push(i2.bind(e3.onupdate, t3));
    }
    return F2.prototype = /* @__PURE__ */ Object.create(null), F2.prototype.handleEvent = function(e3) {
      var t3, n3 = this["on" + e3.type];
      "function" == typeof n3 ? t3 = n3.call(e3.currentTarget, e3) : "function" == typeof n3.handleEvent && n3.handleEvent(e3), this._ && false !== e3.redraw && (0, this._)(), false === t3 && (e3.preventDefault(), e3.stopPropagation());
    }, function(e3, r3, o3) {
      if (!e3) throw new TypeError("DOM element being rendered to does not exist.");
      if (null != $2 && e3.contains($2)) throw new TypeError("Node is currently being rendered to and thus is locked.");
      var l3 = t2, a3 = $2, i3 = [], u3 = s2(), f3 = e3.namespaceURI;
      $2 = e3, t2 = "function" == typeof o3 ? o3 : void 0, n2 = {};
      try {
        null == e3.vnodes && (e3.textContent = ""), r3 = w.normalizeChildren(Array.isArray(r3) ? r3 : [r3]), p2(e3, e3.vnodes, r3, i3, null, "http://www.w3.org/1999/xhtml" === f3 ? void 0 : f3), e3.vnodes = r3, null != u3 && s2() !== u3 && "function" == typeof u3.focus && u3.focus();
        for (var c3 = 0; c3 < i3.length; c3++) i3[c3]();
      } finally {
        t2 = l3, $2 = a3;
      }
    };
  }("undefined" != typeof window ? window : null);
  var S = t;
  var E = function(e2, t2, n2) {
    var r2 = [], o2 = false, l2 = -1;
    function a2() {
      for (l2 = 0; l2 < r2.length; l2 += 2) try {
        e2(r2[l2], S(r2[l2 + 1]), i2);
      } catch (e3) {
        n2.error(e3);
      }
      l2 = -1;
    }
    function i2() {
      o2 || (o2 = true, t2(function() {
        o2 = false, a2();
      }));
    }
    return i2.sync = a2, { mount: function(t3, n3) {
      if (null != n3 && null == n3.view && "function" != typeof n3) throw new TypeError("m.mount expects a component, not a vnode.");
      var o3 = r2.indexOf(t3);
      o3 >= 0 && (r2.splice(o3, 2), o3 <= l2 && (l2 -= 2), e2(t3, [])), null != n3 && (r2.push(t3, n3), e2(t3, S(n3), i2));
    }, redraw: i2 };
  }(k, "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : null, "undefined" != typeof console ? console : null);
  var z = function(e2) {
    if ("[object Object]" !== Object.prototype.toString.call(e2)) return "";
    var t2 = [];
    for (var n2 in e2) r2(n2, e2[n2]);
    return t2.join("&");
    function r2(e3, n3) {
      if (Array.isArray(n3)) for (var o2 = 0; o2 < n3.length; o2++) r2(e3 + "[" + o2 + "]", n3[o2]);
      else if ("[object Object]" === Object.prototype.toString.call(n3)) for (var o2 in n3) r2(e3 + "[" + o2 + "]", n3[o2]);
      else t2.push(encodeURIComponent(e3) + (null != n3 && "" !== n3 ? "=" + encodeURIComponent(n3) : ""));
    }
  };
  var j = o;
  var A = Object.assign || function(e2, t2) {
    for (var n2 in t2) j.call(t2, n2) && (e2[n2] = t2[n2]);
  };
  var C = z;
  var O = A;
  var T = function(e2, t2) {
    if (/:([^\/\.-]+)(\.{3})?:/.test(e2)) throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
    if (null == t2) return e2;
    var n2 = e2.indexOf("?"), r2 = e2.indexOf("#"), o2 = r2 < 0 ? e2.length : r2, l2 = n2 < 0 ? o2 : n2, a2 = e2.slice(0, l2), i2 = {};
    O(i2, t2);
    var s2 = a2.replace(/:([^\/\.-]+)(\.{3})?/g, function(e3, n3, r3) {
      return delete i2[n3], null == t2[n3] ? e3 : r3 ? t2[n3] : encodeURIComponent(String(t2[n3]));
    }), u2 = s2.indexOf("?"), f2 = s2.indexOf("#"), c2 = f2 < 0 ? s2.length : f2, d2 = u2 < 0 ? c2 : u2, p2 = s2.slice(0, d2);
    n2 >= 0 && (p2 += e2.slice(n2, o2)), u2 >= 0 && (p2 += (n2 < 0 ? "?" : "&") + s2.slice(u2, c2));
    var m2 = C(i2);
    return m2 && (p2 += (n2 < 0 && u2 < 0 ? "?" : "&") + m2), r2 >= 0 && (p2 += e2.slice(r2)), f2 >= 0 && (p2 += (r2 < 0 ? "" : "&") + s2.slice(f2)), p2;
  };
  var N = T;
  var $ = o;
  var L = function(e2, t2) {
    function n2(e3) {
      return new Promise(e3);
    }
    function r2(e3, t3) {
      for (var n3 in e3.headers) if ($.call(e3.headers, n3) && n3.toLowerCase() === t3) return true;
      return false;
    }
    return n2.prototype = Promise.prototype, n2.__proto__ = Promise, { request: function(o2, l2) {
      "string" != typeof o2 ? (l2 = o2, o2 = o2.url) : null == l2 && (l2 = {});
      var a2 = function(t3, n3) {
        return new Promise(function(o3, l3) {
          t3 = N(t3, n3.params);
          var a3, i3 = null != n3.method ? n3.method.toUpperCase() : "GET", s3 = n3.body, u2 = (null == n3.serialize || n3.serialize === JSON.serialize) && !(s3 instanceof e2.FormData || s3 instanceof e2.URLSearchParams), f2 = n3.responseType || ("function" == typeof n3.extract ? "" : "json"), c2 = new e2.XMLHttpRequest(), d2 = false, p2 = false, m2 = c2, v2 = c2.abort;
          for (var h2 in c2.abort = function() {
            d2 = true, v2.call(this);
          }, c2.open(i3, t3, false !== n3.async, "string" == typeof n3.user ? n3.user : void 0, "string" == typeof n3.password ? n3.password : void 0), u2 && null != s3 && !r2(n3, "content-type") && c2.setRequestHeader("Content-Type", "application/json; charset=utf-8"), "function" == typeof n3.deserialize || r2(n3, "accept") || c2.setRequestHeader("Accept", "application/json, text/*"), n3.withCredentials && (c2.withCredentials = n3.withCredentials), n3.timeout && (c2.timeout = n3.timeout), c2.responseType = f2, n3.headers) $.call(n3.headers, h2) && c2.setRequestHeader(h2, n3.headers[h2]);
          c2.onreadystatechange = function(e3) {
            if (!d2 && 4 === e3.target.readyState) try {
              var r3, a4 = e3.target.status >= 200 && e3.target.status < 300 || 304 === e3.target.status || /^file:\/\//i.test(t3), i4 = e3.target.response;
              if ("json" === f2) {
                if (!e3.target.responseType && "function" != typeof n3.extract) try {
                  i4 = JSON.parse(e3.target.responseText);
                } catch (e4) {
                  i4 = null;
                }
              } else f2 && "text" !== f2 || null == i4 && (i4 = e3.target.responseText);
              if ("function" == typeof n3.extract ? (i4 = n3.extract(e3.target, n3), a4 = true) : "function" == typeof n3.deserialize && (i4 = n3.deserialize(i4)), a4) {
                if ("function" == typeof n3.type) if (Array.isArray(i4)) for (var s4 = 0; s4 < i4.length; s4++) i4[s4] = new n3.type(i4[s4]);
                else i4 = new n3.type(i4);
                o3(i4);
              } else {
                var u3 = function() {
                  try {
                    r3 = e3.target.responseText;
                  } catch (e4) {
                    r3 = i4;
                  }
                  var t4 = new Error(r3);
                  t4.code = e3.target.status, t4.response = i4, l3(t4);
                };
                0 === c2.status ? setTimeout(function() {
                  p2 || u3();
                }) : u3();
              }
            } catch (e4) {
              l3(e4);
            }
          }, c2.ontimeout = function(e3) {
            p2 = true;
            var t4 = new Error("Request timed out");
            t4.code = e3.target.status, l3(t4);
          }, "function" == typeof n3.config && (c2 = n3.config(c2, n3, t3) || c2) !== m2 && (a3 = c2.abort, c2.abort = function() {
            d2 = true, a3.call(this);
          }), null == s3 ? c2.send() : "function" == typeof n3.serialize ? c2.send(n3.serialize(s3)) : s3 instanceof e2.FormData || s3 instanceof e2.URLSearchParams ? c2.send(s3) : c2.send(JSON.stringify(s3));
        });
      }(o2, l2);
      if (true === l2.background) return a2;
      var i2 = 0;
      function s2() {
        0 == --i2 && "function" == typeof t2 && t2();
      }
      return function e3(t3) {
        var r3 = t3.then;
        return t3.constructor = n2, t3.then = function() {
          i2++;
          var n3 = r3.apply(t3, arguments);
          return n3.then(s2, function(e4) {
            if (s2(), 0 === i2) throw e4;
          }), e3(n3);
        }, t3;
      }(a2);
    } };
  }("undefined" != typeof window ? window : null, E.redraw);
  function P(e2) {
    try {
      return decodeURIComponent(e2);
    } catch (t2) {
      return e2;
    }
  }
  var R = function(e2) {
    if ("" === e2 || null == e2) return {};
    "?" === e2.charAt(0) && (e2 = e2.slice(1));
    for (var t2 = e2.split("&"), n2 = {}, r2 = {}, o2 = 0; o2 < t2.length; o2++) {
      var l2 = t2[o2].split("="), a2 = P(l2[0]), i2 = 2 === l2.length ? P(l2[1]) : "";
      "true" === i2 ? i2 = true : "false" === i2 && (i2 = false);
      var s2 = a2.split(/\]\[?|\[/), u2 = r2;
      a2.indexOf("[") > -1 && s2.pop();
      for (var f2 = 0; f2 < s2.length; f2++) {
        var c2 = s2[f2], d2 = s2[f2 + 1], p2 = "" == d2 || !isNaN(parseInt(d2, 10));
        if ("" === c2) null == n2[a2 = s2.slice(0, f2).join()] && (n2[a2] = Array.isArray(u2) ? u2.length : 0), c2 = n2[a2]++;
        else if ("__proto__" === c2) break;
        if (f2 === s2.length - 1) u2[c2] = i2;
        else {
          var m2 = Object.getOwnPropertyDescriptor(u2, c2);
          null != m2 && (m2 = m2.value), null == m2 && (u2[c2] = m2 = p2 ? [] : {}), u2 = m2;
        }
      }
    }
    return r2;
  };
  var I = R;
  var F = function(e2) {
    var t2 = e2.indexOf("?"), n2 = e2.indexOf("#"), r2 = n2 < 0 ? e2.length : n2, o2 = t2 < 0 ? r2 : t2, l2 = e2.slice(0, o2).replace(/\/{2,}/g, "/");
    return l2 ? "/" !== l2[0] && (l2 = "/" + l2) : l2 = "/", { path: l2, params: t2 < 0 ? {} : I(e2.slice(t2 + 1, r2)) };
  };
  var _ = F;
  var q = o;
  var D = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
  var M = function(e2, t2) {
    var n2 = {};
    if (null != t2) for (var r2 in e2) q.call(e2, r2) && !D.test(r2) && t2.indexOf(r2) < 0 && (n2[r2] = e2[r2]);
    else for (var r2 in e2) q.call(e2, r2) && !D.test(r2) && (n2[r2] = e2[r2]);
    return n2;
  };
  var U = t;
  var H = c;
  var Q = T;
  var K = F;
  var J = function(e2) {
    var t2 = _(e2), n2 = Object.keys(t2.params), r2 = [], o2 = new RegExp("^" + t2.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function(e3, t3, n3) {
      return null == t3 ? "\\" + e3 : (r2.push({ k: t3, r: "..." === n3 }), "..." === n3 ? "(.*)" : "." === n3 ? "([^/]+)\\." : "([^/]+)" + (n3 || ""));
    }) + "$");
    return function(e3) {
      for (var l2 = 0; l2 < n2.length; l2++) if (t2.params[n2[l2]] !== e3.params[n2[l2]]) return false;
      if (!r2.length) return o2.test(e3.path);
      var a2 = o2.exec(e3.path);
      if (null == a2) return false;
      for (l2 = 0; l2 < r2.length; l2++) e3.params[r2[l2].k] = r2[l2].r ? a2[l2 + 1] : decodeURIComponent(a2[l2 + 1]);
      return true;
    };
  };
  var B = A;
  var G = M;
  var V = {};
  function W(e2) {
    try {
      return decodeURIComponent(e2);
    } catch (t2) {
      return e2;
    }
  }
  var X = function(e2, t2) {
    var n2, r2, o2, l2, a2, i2, s2 = null == e2 ? null : "function" == typeof e2.setImmediate ? e2.setImmediate : e2.setTimeout, u2 = Promise.resolve(), f2 = false, c2 = false, d2 = 0, p2 = V, m2 = { onbeforeupdate: function() {
      return !(!(d2 = d2 ? 2 : 1) || V === p2);
    }, onremove: function() {
      e2.removeEventListener("popstate", y2, false), e2.removeEventListener("hashchange", h2, false);
    }, view: function() {
      if (d2 && V !== p2) {
        var e3 = [U(o2, l2.key, l2)];
        return p2 && (e3 = p2.render(e3[0])), e3;
      }
    } }, v2 = w2.SKIP = {};
    function h2() {
      f2 = false;
      var s3 = e2.location.hash;
      "#" !== w2.prefix[0] && (s3 = e2.location.search + s3, "?" !== w2.prefix[0] && "/" !== (s3 = e2.location.pathname + s3)[0] && (s3 = "/" + s3));
      var c3 = s3.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, W).slice(w2.prefix.length), m3 = K(c3);
      function h3(e3) {
        console.error(e3), g2(r2, null, { replace: true });
      }
      B(m3.params, e2.history.state), function e3(s4) {
        for (; s4 < n2.length; s4++) if (n2[s4].check(m3)) {
          var f3 = n2[s4].component, y3 = n2[s4].route, w3 = f3, b2 = i2 = function(n3) {
            if (b2 === i2) {
              if (n3 === v2) return e3(s4 + 1);
              o2 = null == n3 || "function" != typeof n3.view && "function" != typeof n3 ? "div" : n3, l2 = m3.params, a2 = c3, i2 = null, p2 = f3.render ? f3 : null, 2 === d2 ? t2.redraw() : (d2 = 2, t2.redraw.sync());
            }
          };
          return void (f3.view || "function" == typeof f3 ? (f3 = {}, b2(w3)) : f3.onmatch ? u2.then(function() {
            return f3.onmatch(m3.params, c3, y3);
          }).then(b2, c3 === r2 ? null : h3) : b2("div"));
        }
        if (c3 === r2) throw new Error("Could not resolve default route " + r2 + ".");
        g2(r2, null, { replace: true });
      }(0);
    }
    function y2() {
      f2 || (f2 = true, s2(h2));
    }
    function g2(t3, n3, r3) {
      if (t3 = Q(t3, n3), c2) {
        y2();
        var o3 = r3 ? r3.state : null, l3 = r3 ? r3.title : null;
        r3 && r3.replace ? e2.history.replaceState(o3, l3, w2.prefix + t3) : e2.history.pushState(o3, l3, w2.prefix + t3);
      } else e2.location.href = w2.prefix + t3;
    }
    function w2(o3, l3, a3) {
      if (!o3) throw new TypeError("DOM element being rendered to does not exist.");
      if (n2 = Object.keys(a3).map(function(e3) {
        if ("/" !== e3[0]) throw new SyntaxError("Routes must start with a '/'.");
        if (/:([^\/\.-]+)(\.{3})?:/.test(e3)) throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
        return { route: e3, component: a3[e3], check: J(e3) };
      }), r2 = l3, null != l3) {
        var i3 = K(l3);
        if (!n2.some(function(e3) {
          return e3.check(i3);
        })) throw new ReferenceError("Default route doesn't match any known routes.");
      }
      "function" == typeof e2.history.pushState ? e2.addEventListener("popstate", y2, false) : "#" === w2.prefix[0] && e2.addEventListener("hashchange", h2, false), c2 = true, t2.mount(o3, m2), h2();
    }
    return w2.set = function(e3, t3, n3) {
      null != i2 && ((n3 = n3 || {}).replace = true), i2 = null, g2(e3, t3, n3);
    }, w2.get = function() {
      return a2;
    }, w2.prefix = "#!", w2.Link = { view: function(e3) {
      var t3, n3, r3, o3 = H(e3.attrs.selector || "a", G(e3.attrs, ["options", "params", "selector", "onclick"]), e3.children);
      return (o3.attrs.disabled = Boolean(o3.attrs.disabled)) ? (o3.attrs.href = null, o3.attrs["aria-disabled"] = "true") : (t3 = e3.attrs.options, n3 = e3.attrs.onclick, r3 = Q(o3.attrs.href, e3.attrs.params), o3.attrs.href = w2.prefix + r3, o3.attrs.onclick = function(e4) {
        var o4;
        "function" == typeof n3 ? o4 = n3.call(e4.currentTarget, e4) : null == n3 || "object" != typeof n3 || "function" == typeof n3.handleEvent && n3.handleEvent(e4), false === o4 || e4.defaultPrevented || 0 !== e4.button && 0 !== e4.which && 1 !== e4.which || e4.currentTarget.target && "_self" !== e4.currentTarget.target || e4.ctrlKey || e4.metaKey || e4.shiftKey || e4.altKey || (e4.preventDefault(), e4.redraw = false, w2.set(r3, null, t3));
      }), o3;
    } }, w2.param = function(e3) {
      return l2 && null != e3 ? l2[e3] : l2;
    }, w2;
  }("undefined" != typeof window ? window : null, E);
  var Y = h;
  var Z = L;
  var ee = E;
  var te = g;
  var ne = function() {
    return Y.apply(this, arguments);
  };
  ne.m = Y, ne.trust = Y.trust, ne.fragment = Y.fragment, ne.Fragment = "[", ne.mount = ee.mount, ne.route = X, ne.render = k, ne.redraw = ee.redraw, ne.request = Z.request, ne.parseQueryString = R, ne.buildQueryString = z, ne.parsePathname = F, ne.buildPathname = T, ne.vnode = t, ne.censor = M, ne.domFor = te.domFor;
  var re = ne;
  var oe = re.Fragment;
  var le = re.buildPathname;
  var ae = re.buildQueryString;
  var ie = re.censor;
  var se = re.domFor;
  var ue = re.fragment;
  var fe = re.m;
  var ce = re.mount;
  var de = re.parsePathname;
  var pe = re.parseQueryString;
  var me = re.redraw;
  var ve = re.render;
  var he = re.request;
  var ye = re.route;
  var ge = re.trust;
  var we = re.vnode;

  // src/libraries/nanoid.ts
  var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  var nanoid = (size = 21) => {
    let id = "";
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    while (size--) {
      id += urlAlphabet[bytes[size] & 63];
    }
    return id;
  };

  // src/libraries/mithril-toast.ts
  var state = {
    list: [],
    destroy: (toast) => {
      const index = state.list.findIndex((entry) => entry.id === toast.id);
      state.list.slice(index, 1);
    }
  };
  var addInfo = (text, timeout = 3e3) => {
    state.list.push({ id: nanoid(), type: 0 /* Info */, text, timeout });
  };
  var Drawer = () => {
    return {
      view: () => {
        return re(
          "div",
          state.list.map((toast) => {
            return re("div", { key: toast.id }, re(Bread, { toast }));
          })
        );
      }
    };
  };
  var Bread = () => {
    return {
      oninit: (vnode) => {
        setTimeout(() => {
          state.destroy(vnode.attrs.toast);
        }, vnode.attrs.toast.timeout);
      },
      onbeforeremove: (vnode) => {
        vnode.dom.classList.add("");
        setTimeout(() => {
          state.destroy(vnode.attrs.toast);
          re.redraw();
        }, 300);
      },
      view: (vnode) => {
        return re("div");
      }
    };
  };

  // src/pages/add-bulk.ts
  var AddBulk = (vnode) => {
    return {
      view: (vnode2) => {
      }
    };
  };
  var add_bulk_default = AddBulk;

  // src/pages/add-scan.ts
  var AddScan = (vnode) => {
    return {
      view: (vnode2) => {
      }
    };
  };
  var add_scan_default = AddScan;

  // src/pages/add-search.ts
  var AddSearch = (vnode) => {
    return {
      view: (vnode2) => {
      }
    };
  };
  var add_search_default = AddSearch;

  // src/libraries/mithril-material-3/fab.ts
  var SIZE = {
    small: "-small",
    medium: "-medium",
    large: "-large"
  };
  var Fab = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs || { size: "medium" };
        const size = SIZE[attrs.size || "medium"];
        return re("div", { class: `a-fab ${size}` }, vnode.children);
      }
    };
  };

  // src/components/base/icons.ts
  var Wrapper = (vnode) => {
    const props = vnode.attrs || {};
    const width = props.width || "24px";
    const height = props.height || "24px";
    const fill = props.fill || "currentColor";
    return {
      view: (vnode2) => {
        return re(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 -960 960 960",
            width,
            height,
            fill
          },
          vnode2.children
        );
      }
    };
  };
  var Add = () => {
    return {
      view: (vnode) => {
        return re(
          Wrapper,
          { ...vnode.attrs },
          re("path", {
            d: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
          })
        );
      }
    };
  };

  // src/components/base/button.ts
  var COLOR = {
    default: "",
    error: "btn-error",
    success: "btn-success"
  };
  var KIND = {
    default: "",
    primary: "bg-green-600 active:bg-green-700 text-white",
    link: "btn-link"
  };
  var SIZE2 = {
    default: "",
    block: "btn-block",
    large: "h-12 min-w-12",
    small: "btn-sm"
  };
  var STATE = {
    default: "",
    active: "active",
    disabled: "disabled",
    loading: "loading"
  };
  var TYPE = {
    default: "",
    action: "",
    circle: "rounded-full"
  };
  var Button = (vnode) => {
    const props = vnode.attrs;
    const className = props?.class || "";
    const color = COLOR[props?.color || "default"];
    const kind = KIND[props?.kind || "default"];
    const size = SIZE2[props?.size || "default"];
    const state3 = STATE[props?.state || "default"];
    const type = TYPE[props?.type || "default"];
    return {
      view: (vnode2) => {
        return re(
          "button",
          {
            class: `flex items-center justify-center ${color} ${kind} ${size} ${state3} ${type} ${className}`
          },
          vnode2.children
        );
      }
    };
  };
  var button_default = Button;

  // src/pages/library-bookshelf.ts
  var LibraryBooks = (vnode) => {
    return {
      view: (vnode2) => {
        return [
          re(Fab, [
            re(button_default, { kind: "primary", size: "large", type: "circle" }, re(Add))
          ]),
          re("h1", "Books!")
        ];
      }
    };
  };
  var library_bookshelf_default = LibraryBooks;

  // src/utils/index.ts
  var Option = class _Option {
    constructor(inner) {
      this.inner = inner;
    }
    static Some(value) {
      return new _Option({ some: true, value });
    }
    static None() {
      return new _Option({ some: false });
    }
    match(matcher) {
      if (this.inner.some) {
        return matcher.some(this.inner.value);
      }
      return matcher.none();
    }
    map(fn) {
      return this.match({
        some: (t2) => _Option.Some(fn(t2)),
        none: () => _Option.None()
      });
    }
    andThen(fn) {
      return this.match({
        some: (t2) => fn(t2),
        none: () => _Option.None()
      });
    }
  };
  var Result = class _Result {
    constructor(inner) {
      this.inner = inner;
    }
    static Ok(value) {
      return new _Result({ ok: true, value });
    }
    static Err(error) {
      return new _Result({ ok: false, error });
    }
    isOk() {
      return this.inner.ok;
    }
    match(matcher) {
      if (this.inner.ok) {
        return matcher.ok(this.inner.value);
      }
      return matcher.err(this.inner.error);
    }
    map(fn) {
      return this.match({
        ok: (t2) => _Result.Ok(fn(t2)),
        err: (e2) => _Result.Err(e2)
      });
    }
    mapErr(fn) {
      return this.match({
        ok: (t2) => _Result.Ok(t2),
        err: (e2) => _Result.Err(fn(e2))
      });
    }
    andThen(fn) {
      return this.match({
        ok: (t2) => fn(t2),
        err: (e2) => _Result.Err(e2)
      });
    }
    asOk() {
      return this.match({
        ok: (t2) => Option.Some(t2),
        err: (_2) => Option.None()
      });
    }
  };
  var Ok = (value) => {
    return Result.Ok(value);
  };
  var Err = (error) => {
    return Result.Err(error);
  };
  function from(value) {
    return value;
  }

  // src/libraries/mithril-material-3/icon/base.ts
  var IconBase = (vnode) => {
    const attrs = vnode.attrs || {};
    const width = attrs.width || "24px";
    const height = attrs.height || "24px";
    const fill = attrs.fill || "currentColor";
    return {
      view: (vnode2) => {
        return re(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 -960 960 960",
            width,
            height,
            fill
          },
          vnode2.children
        );
      }
    };
  };

  // src/libraries/mithril-material-3/icon/more-vert.ts
  var MoreVert = () => {
    return {
      view: (vnode) => {
        return re(
          IconBase,
          { ...vnode.attrs },
          re("path", {
            d: "M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
          })
        );
      }
    };
  };

  // src/components/header.ts
  var Header = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs;
        return re("div", { class: "flex items-center" }, [
          re("span", { class: "flex flex-grow items-center" }, [
            re("h2", { class: "text-2xl m-2 text-on-surface" }, attrs.title),
            attrs.subtitle ? re("h2", { class: "text-on-surface-variant" }, attrs.subtitle) : []
          ]),
          re(MoreVert)
        ]);
      }
    };
  };

  // src/components/bookcover.ts
  var BookCover = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs;
        return re(
          "div",
          {
            key: from(attrs.entry.id),
            class: "bg-surface-bright rounded h-64 w-36 flex content-center"
          },
          [
            re("img", {
              class: "aspect-[9/16] max-h-64 max-w-36 object-contain my-auto",
              src: attrs.entry.cover
            })
          ]
        );
      }
    };
  };

  // src/database/client.ts
  var responseToResult = (response) => {
    if (response.code === void 0) {
      return Ok(response.data);
    }
    return Err(new Error(response.message));
  };
  var getBookshelves = async () => {
    return responseToResult(
      await re.request("/api/bookshelves", {
        method: "GET"
      })
    );
  };
  var getBooks = async (id) => {
    return responseToResult(
      await re.request("/api/bookshelves/:id", {
        params: {
          id: from(id)
        },
        method: "GET"
      })
    );
  };

  // src/components/bookshelf.ts
  var BookshelfEntry = () => {
    let books = Err(new Error("book cover didn't load"));
    return {
      oninit: async (vnode) => {
        const attrs = vnode.attrs;
        books = await getBooks(attrs.entry.id);
      },
      view: (vnode) => {
        const attrs = vnode.attrs;
        return books.match({
          ok: (books2) => {
            return re("div", { key: from(attrs.entry.id) }, [
              re(Header, { title: attrs.entry.name }),
              re("div", { class: "flex flex-row gap-3.5 overflow-x-scroll" }, [
                books2.map((book) => {
                  return re(BookCover, { entry: book.book });
                })
              ])
            ]);
          },
          err: (_2) => {
            return re("h1", "Error!");
          }
        });
      }
    };
  };
  var bookshelf_default = BookshelfEntry;

  // src/shared/state.ts
  var state2 = {
    serviceWorker: false,
    settings: {
      camera: {
        list: [],
        selection: null
      },
      database: {},
      search: {
        provider: "openlibrary",
        worldcatToken: null
      }
    }
  };

  // src/pages/library-bookshelves.ts
  var LibraryBookshelves = () => {
    let bookshelves = Err(
      new Error("bookshelves didn't load")
    );
    return {
      oninit: async (_2) => {
        bookshelves = await getBookshelves();
      },
      view: (vnode) => {
        if (!state2.serviceWorker) {
          return null;
        }
        return bookshelves.match({
          ok: (bookshelves2) => {
            return re("div", { class: "bg-zinc-100 px-4" }, [
              re(Fab, [
                re(button_default, { kind: "primary", size: "large", type: "circle" }, [
                  re(Add)
                ])
              ]),
              re("div", { class: "flex flex-col py-4 gap-y-2 md:gap-y-4" }, [
                bookshelves2.map((bookshelf) => {
                  return re(bookshelf_default, { entry: bookshelf }, []);
                })
              ])
            ]);
          },
          err: (_2) => {
            return re("h1", "Error!");
          }
        });
      }
    };
  };
  var library_bookshelves_default = LibraryBookshelves;

  // src/pages/library-tags.ts
  var LibraryTags = (vnode) => {
    return {
      view: (vnode2) => {
        return re("h1", "Tags!");
      }
    };
  };
  var library_tags_default = LibraryTags;

  // src/pages/library-wishlist.ts
  var LibraryWishlist = (vnode) => {
    return {
      view: (vnode2) => {
        return [
          re(Fab, [
            re(button_default, { kind: "primary", size: "large", type: "circle" }, re(Add))
          ]),
          re("h1", "Wishlist!")
        ];
      }
    };
  };
  var library_wishlist_default = LibraryWishlist;

  // src/components/base/label.ts
  var Label = () => {
    return {
      view: (vnode) => {
        return re(
          "label",
          {
            ...vnode.attrs || {},
            class: "block text-lg font-semibold leading-normal py-1"
          },
          vnode.children
        );
      }
    };
  };

  // src/components/base/select.ts
  var Select = () => {
    return {
      view: (vnode) => {
        return re(
          "select",
          {
            ...vnode.attrs || {},
            class: "bg-white border border-zinc-400 leading-normal text-base rounded-sm h-9 max-w-64 py-1.5 pl-2 pr-6"
          },
          vnode.children
        );
      }
    };
  };
  var Option2 = () => {
    return {
      view: (vnode) => {
        return re("option", vnode.children);
      }
    };
  };

  // src/pages/settings.ts
  var Settings = () => {
    return {
      view: (_vnode) => {
        return [
          re("h2", { class: "text-2xl m-2" }, "Camera"),
          re("div", { class: "p-2 mx-2 rounded-md shadow-sm" }, [
            re(Label, { for: "settings-camera-selection" }, "Camera Selection"),
            re(Select, { id: "settings-camera-selection" }, [
              re(Option2, "Choose an option"),
              re(Option2, "Slack"),
              re(Option2, "Skype"),
              re(Option2, "Hipchat")
            ])
          ]),
          re("h2", { class: "text-2xl m-2" }, "Database"),
          re("div", { class: " p-2 mx-2 rounded-md shadow-sm" }, []),
          re("h2", { class: "text-2xl m-2" }, "Search"),
          re("div", { class: "p-2 mx-2 rounded-md shadow-sm" }, [
            re(Label, { for: "settings-search-provider" }, "Search Provider"),
            re(Select, { id: "settings-search-provider" }, [
              re(Option2, "Choose an option"),
              re(Option2, "Slack"),
              re(Option2, "Skype"),
              re(Option2, "Hipchat")
            ])
          ])
        ];
      }
    };
  };
  var settings_default = Settings;

  // src/libraries/mithril-material-3/nav.ts
  var Nav = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs;
        return re("div", { class: "a-nav" }, [
          re(
            "div",
            { class: "a-nav--container" },
            attrs.items.map((item) => {
              return re(NavItem, { ...item }, []);
            })
          )
        ]);
      }
    };
  };
  var NavItem = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs;
        const isActive = re.route.get() === attrs.href;
        return re(
          re.route.Link,
          { ...attrs, class: `a-nav_item${isActive ? " -active" : ""}` },
          [
            re("div", { class: "a-nav_item--icon" }, [
              re(attrs.icon, { filled: isActive }),
              attrs.badge ? re("div", { class: "a-nav_item--badge" }, []) : []
            ]),
            re("div", { class: "a-nav_item--text" }, attrs.label)
          ]
        );
      }
    };
  };

  // src/libraries/mithril-material-3/icon/label.ts
  var Label2 = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs || {};
        const filled = attrs.filled || false;
        const OUTLINED = "M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Zm-98 0L600-680H200v400h400l142-200Zm-542 0v200-400 200Z";
        const FILLED = "M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Z";
        return re(
          IconBase,
          { ...vnode.attrs },
          re("path", {
            d: filled ? FILLED : OUTLINED
          })
        );
      }
    };
  };

  // src/libraries/mithril-material-3/icon/shelves.ts
  var Shelves = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs || {};
        const filled = attrs.filled || false;
        const OUTLINED = "M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z";
        const FILLED = "M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Z";
        return re(
          IconBase,
          { ...vnode.attrs },
          re("path", {
            d: filled ? FILLED : OUTLINED
          })
        );
      }
    };
  };

  // src/libraries/mithril-material-3/icon/shopping-mode.ts
  var ShoppingMode = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs || {};
        const filled = attrs.filled || false;
        const OUTLINED = "M446-80q-15 0-30-6t-27-18L103-390q-12-12-17.5-26.5T80-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T879-800v287q0 16-6 30.5T856-457L503-104q-12 12-27 18t-30 6Zm0-80 353-354v-286H513L160-446l286 286Zm253-480q25 0 42.5-17.5T759-700q0-25-17.5-42.5T699-760q-25 0-42.5 17.5T639-700q0 25 17.5 42.5T699-640ZM480-480Z";
        const FILLED = "M447-80q-15 0-30-6t-27-18L104-390q-12-12-17.5-26.5T81-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T880-800v287q0 16-6 30.5T857-457L504-104q-12 12-27 18t-30 6Zm253-560q25 0 42.5-17.5T760-700q0-25-17.5-42.5T700-760q-25 0-42.5 17.5T640-700q0 25 17.5 42.5T700-640Z";
        return re(
          IconBase,
          { ...vnode.attrs },
          re("path", {
            d: filled ? FILLED : OUTLINED
          })
        );
      }
    };
  };

  // src/libraries/mithril-material-3/icon/settings.ts
  var Settings2 = () => {
    return {
      view: (vnode) => {
        const attrs = vnode.attrs || {};
        const filled = attrs.filled || false;
        const OUTLINED = "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z";
        const FILLED = "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z";
        return re(
          IconBase,
          { ...vnode.attrs },
          re("path", {
            d: filled ? FILLED : OUTLINED
          })
        );
      }
    };
  };

  // src/shared/layout.ts
  var Layout = (_vnode) => {
    return {
      view: (vnode) => {
        const items = [
          {
            href: "/library/bookshelves",
            icon: Shelves,
            label: "Bookshelves"
          },
          {
            href: "/library/tags",
            icon: Label2,
            label: "Tags"
          },
          {
            href: "/library/wishlist",
            icon: ShoppingMode,
            label: "Wishlist"
          },
          {
            href: "/settings",
            icon: Settings2,
            label: "Settings"
          }
        ];
        return re.fragment({}, [
          re(Drawer),
          re("div", { class: "flex-1 overflow-y-scroll" }, vnode.children),
          re(Nav, { items }, [])
        ]);
      }
    };
  };
  var layout_default = Layout;

  // src/main.ts
  var wrapper = (comp) => {
    return {
      render: () => {
        return re(layout_default, re(comp));
      }
    };
  };
  var registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "./service-worker.js"
        );
        if (registration.waiting && registration.active) {
          addInfo("Please reload the tab to get updates.");
        } else if (registration.active) {
          state2.serviceWorker = true;
        } else {
          registration.addEventListener("updatefound", () => {
            if (registration.installing == null) {
              return;
            }
            registration.installing.addEventListener("statechange", (event) => {
              if (event.target == null) {
                return;
              }
              const worker = event.target;
              if (worker.state === "installed") {
                if (registration.active) {
                  addInfo("Please reload the tab to get updates.");
                } else {
                  state2.serviceWorker = true;
                }
              }
            });
          });
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };
  window.addEventListener("load", () => {
    registerServiceWorker();
    if (!window.PRODUCTION) {
      new EventSource("/esbuild").addEventListener(
        "change",
        () => location.reload()
      );
    }
    re.route(document.body, "/library/bookshelves", {
      "/add/bulk": add_bulk_default,
      "/add/scan": add_scan_default,
      "/add/search": add_search_default,
      "/library/bookshelves": wrapper(library_bookshelves_default),
      "/library/bookshelves/:bookshelfId": wrapper(library_bookshelf_default),
      "/library/tags": wrapper(library_tags_default),
      "/library/wishlist": wrapper(library_wishlist_default),
      "/settings": wrapper(settings_default)
    });
  });
})();
//# sourceMappingURL=main.js.map
