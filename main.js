const SISSIX = { gitHash: "cd9ed08eb721c9d38f988cae7c8d3e2172f58246", production: true };

(()=>{function ue(e,n,i,s,m,d){return{tag:e,key:n,attrs:i,children:s,text:m,dom:d,domSize:void 0,state:void 0,events:void 0,instance:void 0}}ue.normalize=function(e){return Array.isArray(e)?ue("[",void 0,void 0,ue.normalizeChildren(e),void 0,void 0):e==null||typeof e=="boolean"?null:typeof e=="object"?e:ue("#",void 0,void 0,String(e),void 0,void 0)},ue.normalizeChildren=function(e){var n=[];if(e.length){for(var i=e[0]!=null&&e[0].key!=null,s=1;s<e.length;s++)if((e[s]!=null&&e[s].key!=null)!==i)throw new TypeError(!i||e[s]==null&&typeof e[s]!="boolean"?"In fragments, vnodes must either all have keys or none have keys.":"In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole.");for(s=0;s<e.length;s++)n[s]=ue.normalize(e[s])}return n};var se=ue,$t=se,mt=function(){var e,n=arguments[this],i=this+1;if(n==null?n={}:(typeof n!="object"||n.tag!=null||Array.isArray(n))&&(n={},i=this),arguments.length===i+1)e=arguments[i],Array.isArray(e)||(e=[e]);else for(e=[];i<arguments.length;)e.push(arguments[i++]);return $t("",n.key,n,e)},we={}.hasOwnProperty,Vt=se,Qt=mt,de=we,Yt=/(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g,Xe={};function et(e){for(var n in e)if(de.call(e,n))return!1;return!0}var dt=function(e){if(e==null||typeof e!="string"&&typeof e!="function"&&typeof e.view!="function")throw Error("The selector must be either a string or a component.");var n=Qt.apply(1,arguments);return typeof e=="string"&&(n.children=Vt.normalizeChildren(n.children),e!=="[")?function(i,s){var m=s.attrs,d=de.call(m,"class"),h=d?m.class:m.className;if(s.tag=i.tag,s.attrs={},!et(i.attrs)&&!et(m)){var w={};for(var x in m)de.call(m,x)&&(w[x]=m[x]);m=w}for(var x in i.attrs)de.call(i.attrs,x)&&x!=="className"&&!de.call(m,x)&&(m[x]=i.attrs[x]);for(var x in h==null&&i.attrs.className==null||(m.className=h!=null?i.attrs.className!=null?String(i.attrs.className)+" "+String(h):h:i.attrs.className!=null?i.attrs.className:null),d&&(m.class=null),m)if(de.call(m,x)&&x!=="key"){s.attrs=m;break}return s}(Xe[e]||function(i){for(var s,m="div",d=[],h={};s=Yt.exec(i);){var w=s[1],x=s[2];if(w===""&&x!=="")m=x;else if(w==="#")h.id=x;else if(w===".")d.push(x);else if(s[3][0]==="["){var k=s[6];k&&(k=k.replace(/\\(["'])/g,"$1").replace(/\\\\/g,"\\")),s[4]==="class"?d.push(k):h[s[4]]=k===""?k:k||!0}}return d.length>0&&(h.className=d.join(" ")),Xe[i]={tag:m,attrs:h}}(e),n):(n.tag=e,n)},Gt=se,Jt=se,Xt=mt,Ze=dt;Ze.trust=function(e){return e==null&&(e=""),Gt("<",void 0,void 0,e,void 0,void 0)},Ze.fragment=function(){var e=Xt.apply(0,arguments);return e.tag="[",e.children=Jt.normalizeChildren(e.children),e};var er=Ze,tt=new WeakMap,He={delayedRemoval:tt,domFor:function*({dom:e,domSize:n},{generation:i}={}){if(e!=null)do{let{nextSibling:s}=e;tt.get(e)===i&&(yield e,n--),e=s}while(n)}},De=se,rt=He.delayedRemoval,Fe=He.domFor,ft=function(e){var n,i,s=e&&e.document,m={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"};function d(r){return r.attrs&&r.attrs.xmlns||m[r.tag]}function h(r,t){if(r.state!==t)throw new Error("'vnode.state' must not be modified.")}function w(r){var t=r.state;try{return this.apply(t,arguments)}finally{h(r,t)}}function x(){try{return s.activeElement}catch{return null}}function k(r,t,a,c,v,y,O){for(var u=a;u<c;u++){var l=t[u];l!=null&&p(r,l,v,O,y)}}function p(r,t,a,c,v){var y=t.tag;if(typeof y=="string")switch(t.state={},t.attrs!=null&&Le(t.attrs,t,a),y){case"#":(function(O,u,l){u.dom=s.createTextNode(u.children),z(O,u.dom,l)})(r,t,v);break;case"<":M(r,t,c,v);break;case"[":(function(O,u,l,f,q){var g=s.createDocumentFragment();if(u.children!=null){var E=u.children;k(g,E,0,E.length,l,null,f)}u.dom=g.firstChild,u.domSize=g.childNodes.length,z(O,g,q)})(r,t,a,c,v);break;default:(function(O,u,l,f,q){var g=u.tag,E=u.attrs,b=E&&E.is;f=d(u)||f;var Z=f?b?s.createElementNS(f,g,{is:b}):s.createElementNS(f,g):b?s.createElement(g,{is:b}):s.createElement(g);if(u.dom=Z,E!=null&&function(C,B,re){C.tag==="input"&&B.type!=null&&C.dom.setAttribute("type",B.type);var ze=B!=null&&C.tag==="input"&&B.type==="file";for(var ve in B)L(C,ve,null,B[ve],re,ze)}(u,E,f),z(O,Z,q),!S(u)&&u.children!=null){var P=u.children;k(Z,P,0,P.length,l,null,f),u.tag==="select"&&E!=null&&function(C,B){if("value"in B)if(B.value===null)C.dom.selectedIndex!==-1&&(C.dom.value=null);else{var re=""+B.value;C.dom.value===re&&C.dom.selectedIndex!==-1||(C.dom.value=re)}"selectedIndex"in B&&L(C,"selectedIndex",null,B.selectedIndex,void 0)}(u,E)}})(r,t,a,c,v)}else(function(O,u,l,f,q){(function(g,E){var b;if(typeof g.tag.view=="function"){if(g.state=Object.create(g.tag),(b=g.state.view).$$reentrantLock$$!=null)return;b.$$reentrantLock$$=!0}else{if(g.state=void 0,(b=g.tag).$$reentrantLock$$!=null)return;b.$$reentrantLock$$=!0,g.state=g.tag.prototype!=null&&typeof g.tag.prototype.view=="function"?new g.tag(g):g.tag(g)}if(Le(g.state,g,E),g.attrs!=null&&Le(g.attrs,g,E),g.instance=De.normalize(w.call(g.state.view,g)),g.instance===g)throw Error("A view cannot return the vnode it received as argument");b.$$reentrantLock$$=null})(u,l),u.instance!=null?(p(O,u.instance,l,f,q),u.dom=u.instance.dom,u.domSize=u.dom!=null?u.instance.domSize:0):u.domSize=0})(r,t,a,c,v)}var U={caption:"table",thead:"table",tbody:"table",tfoot:"table",tr:"tbody",th:"tr",td:"tr",colgroup:"table",col:"colgroup"};function M(r,t,a,c){var v=t.children.match(/^\s*?<(\w+)/im)||[],y=s.createElement(U[v[1]]||"div");a==="http://www.w3.org/2000/svg"?(y.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+t.children+"</svg>",y=y.firstChild):y.innerHTML=t.children,t.dom=y.firstChild,t.domSize=y.childNodes.length;for(var O,u=s.createDocumentFragment();O=y.firstChild;)u.appendChild(O);z(r,u,c)}function N(r,t,a,c,v,y){if(t!==a&&(t!=null||a!=null))if(t==null||t.length===0)k(r,a,0,a.length,c,v,y);else if(a==null||a.length===0)R(r,t,0,t.length);else{var O=t[0]!=null&&t[0].key!=null,u=a[0]!=null&&a[0].key!=null,l=0,f=0;if(!O)for(;f<t.length&&t[f]==null;)f++;if(!u)for(;l<a.length&&a[l]==null;)l++;if(O!==u)R(r,t,f,t.length),k(r,a,l,a.length,c,v,y);else if(u){for(var q,g,E,b,Z,P=t.length-1,C=a.length-1;P>=f&&C>=l&&(E=t[P],b=a[C],E.key===b.key);)E!==b&&j(r,E,b,c,v,y),b.dom!=null&&(v=b.dom),P--,C--;for(;P>=f&&C>=l&&(q=t[f],g=a[l],q.key===g.key);)f++,l++,q!==g&&j(r,q,g,c,Q(t,f,v),y);for(;P>=f&&C>=l&&l!==C&&q.key===b.key&&E.key===g.key;)A(r,E,Z=Q(t,f,v)),E!==g&&j(r,E,g,c,Z,y),++l<=--C&&A(r,q,v),q!==b&&j(r,q,b,c,v,y),b.dom!=null&&(v=b.dom),f++,E=t[--P],b=a[C],q=t[f],g=a[l];for(;P>=f&&C>=l&&E.key===b.key;)E!==b&&j(r,E,b,c,v,y),b.dom!=null&&(v=b.dom),C--,E=t[--P],b=a[C];if(l>C)R(r,t,f,P+1);else if(f>P)k(r,a,l,C+1,c,v,y);else{var B,re,ze=v,ve=C-l+1,he=new Array(ve),Re=0,D=0,Be=2147483647,Ne=0;for(D=0;D<ve;D++)he[D]=-1;for(D=C;D>=l;D--){B==null&&(B=V(t,f,P+1));var me=B[(b=a[D]).key];me!=null&&(Be=me<Be?me:-1,he[D-l]=me,E=t[me],t[me]=null,E!==b&&j(r,E,b,c,v,y),b.dom!=null&&(v=b.dom),Ne++)}if(v=ze,Ne!==P-f+1&&R(r,t,f,P+1),Ne===0)k(r,a,l,C+1,c,v,y);else if(Be===-1)for(re=function(oe){var X=[0],J=0,ie=0,$=0,Ge=K.length=oe.length;for($=0;$<Ge;$++)K[$]=oe[$];for($=0;$<Ge;++$)if(oe[$]!==-1){var Je=X[X.length-1];if(oe[Je]<oe[$])K[$]=Je,X.push($);else{for(J=0,ie=X.length-1;J<ie;){var je=(J>>>1)+(ie>>>1)+(J&ie&1);oe[X[je]]<oe[$]?J=je+1:ie=je}oe[$]<oe[X[J]]&&(J>0&&(K[$]=X[J-1]),X[J]=$)}}for(J=X.length,ie=X[J-1];J-- >0;)X[J]=ie,ie=K[ie];return K.length=0,X}(he),Re=re.length-1,D=C;D>=l;D--)g=a[D],he[D-l]===-1?p(r,g,c,y,v):re[Re]===D-l?Re--:A(r,g,v),g.dom!=null&&(v=a[D].dom);else for(D=C;D>=l;D--)g=a[D],he[D-l]===-1&&p(r,g,c,y,v),g.dom!=null&&(v=a[D].dom)}}else{var Pe=t.length<a.length?t.length:a.length;for(l=l<f?l:f;l<Pe;l++)(q=t[l])===(g=a[l])||q==null&&g==null||(q==null?p(r,g,c,y,Q(t,l+1,v)):g==null?I(r,q):j(r,q,g,c,Q(t,l+1,v),y));t.length>Pe&&R(r,t,l,t.length),a.length>Pe&&k(r,a,l,a.length,c,v,y)}}}function j(r,t,a,c,v,y){var O=t.tag;if(O===a.tag){if(a.state=t.state,a.events=t.events,function(u,l){do{var f;if(u.attrs!=null&&typeof u.attrs.onbeforeupdate=="function"&&(f=w.call(u.attrs.onbeforeupdate,u,l))!==void 0&&!f||typeof u.tag!="string"&&typeof u.state.onbeforeupdate=="function"&&(f=w.call(u.state.onbeforeupdate,u,l))!==void 0&&!f)break;return!1}while(!1);return u.dom=l.dom,u.domSize=l.domSize,u.instance=l.instance,u.attrs=l.attrs,u.children=l.children,u.text=l.text,!0}(a,t))return;if(typeof O=="string")switch(a.attrs!=null&&Ae(a.attrs,a,c),O){case"#":(function(u,l){u.children.toString()!==l.children.toString()&&(u.dom.nodeValue=l.children),l.dom=u.dom})(t,a);break;case"<":(function(u,l,f,q,g){l.children!==f.children?(H(u,l,void 0),M(u,f,q,g)):(f.dom=l.dom,f.domSize=l.domSize)})(r,t,a,y,v);break;case"[":(function(u,l,f,q,g,E){N(u,l.children,f.children,q,g,E);var b=0,Z=f.children;if(f.dom=null,Z!=null){for(var P=0;P<Z.length;P++){var C=Z[P];C!=null&&C.dom!=null&&(f.dom==null&&(f.dom=C.dom),b+=C.domSize||1)}b!==1&&(f.domSize=b)}})(r,t,a,c,v,y);break;default:(function(u,l,f,q){var g=l.dom=u.dom;q=d(l)||q,l.tag==="textarea"&&l.attrs==null&&(l.attrs={}),function(E,b,Z,P){if(b&&b===Z&&console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"),Z!=null){E.tag==="input"&&Z.type!=null&&E.dom.setAttribute("type",Z.type);var C=E.tag==="input"&&Z.type==="file";for(var B in Z)L(E,B,b&&b[B],Z[B],P,C)}var re;if(b!=null)for(var B in b)(re=b[B])==null||Z!=null&&Z[B]!=null||W(E,B,re,P)}(l,u.attrs,l.attrs,q),S(l)||N(g,u.children,l.children,f,null,q)})(t,a,c,y)}else(function(u,l,f,q,g,E){if(f.instance=De.normalize(w.call(f.state.view,f)),f.instance===f)throw Error("A view cannot return the vnode it received as argument");Ae(f.state,f,q),f.attrs!=null&&Ae(f.attrs,f,q),f.instance!=null?(l.instance==null?p(u,f.instance,q,E,g):j(u,l.instance,f.instance,q,g,E),f.dom=f.instance.dom,f.domSize=f.instance.domSize):l.instance!=null?(I(u,l.instance),f.dom=void 0,f.domSize=0):(f.dom=l.dom,f.domSize=l.domSize)})(r,t,a,c,v,y)}else I(r,t),p(r,a,c,y,v)}function V(r,t,a){for(var c=Object.create(null);t<a;t++){var v=r[t];if(v!=null){var y=v.key;y!=null&&(c[y]=t)}}return c}var K=[];function Q(r,t,a){for(;t<r.length;t++)if(r[t]!=null&&r[t].dom!=null)return r[t].dom;return a}function A(r,t,a){if(t.dom!=null){var c;if(t.domSize==null)c=t.dom;else for(var v of(c=s.createDocumentFragment(),Fe(t)))c.appendChild(v);z(r,c,a)}}function z(r,t,a){a!=null?r.insertBefore(t,a):r.appendChild(t)}function S(r){if(r.attrs==null||r.attrs.contenteditable==null&&r.attrs.contentEditable==null)return!1;var t=r.children;if(t!=null&&t.length===1&&t[0].tag==="<"){var a=t[0].children;r.dom.innerHTML!==a&&(r.dom.innerHTML=a)}else if(t!=null&&t.length!==0)throw new Error("Child node of a contenteditable must be trusted.");return!0}function R(r,t,a,c){for(var v=a;v<c;v++){var y=t[v];y!=null&&I(r,y)}}function I(r,t){var a,c,v,y,O=0,u=t.state;if(typeof t.tag!="string"&&typeof t.state.onbeforeremove=="function"&&(v=w.call(t.state.onbeforeremove,t))!=null&&typeof v.then=="function"&&(O=1,a=v),t.attrs&&typeof t.attrs.onbeforeremove=="function"&&(v=w.call(t.attrs.onbeforeremove,t))!=null&&typeof v.then=="function"&&(O|=2,c=v),h(t,u),O){for(var l of(y=i,Fe(t)))rt.set(l,y);a?.finally(function(){1&O&&((O&=2)||(h(t,u),T(t),H(r,t,y)))}),c?.finally(function(){2&O&&((O&=1)||(h(t,u),T(t),H(r,t,y)))})}else T(t),H(r,t,y)}function H(r,t,a){if(t.dom!=null)if(t.domSize==null)rt.get(t.dom)===a&&r.removeChild(t.dom);else for(var c of Fe(t,{generation:a}))r.removeChild(c)}function T(r){if(typeof r.tag!="string"&&typeof r.state.onremove=="function"&&w.call(r.state.onremove,r),r.attrs&&typeof r.attrs.onremove=="function"&&w.call(r.attrs.onremove,r),typeof r.tag!="string")r.instance!=null&&T(r.instance);else{var t=r.children;if(Array.isArray(t))for(var a=0;a<t.length;a++){var c=t[a];c!=null&&T(c)}}}function L(r,t,a,c,v,y){if(!(t==="key"||t==="is"||c==null||F(t)||a===c&&!function(O,u){return u==="value"||u==="checked"||u==="selectedIndex"||u==="selected"&&O.dom===x()||O.tag==="option"&&O.dom.parentNode===s.activeElement}(r,t)&&typeof c!="object"||t==="type"&&r.tag==="input")){if(t[0]==="o"&&t[1]==="n")return Ye(r,t,c);if(t.slice(0,6)==="xlink:")r.dom.setAttributeNS("http://www.w3.org/1999/xlink",t.slice(6),c);else if(t==="style")Qe(r.dom,a,c);else if(ne(r,t,v)){if(t==="value"){if((r.tag==="input"||r.tag==="textarea")&&r.dom.value===""+c&&(y||r.dom===x())||r.tag==="select"&&a!==null&&r.dom.value===""+c||r.tag==="option"&&a!==null&&r.dom.value===""+c)return;if(y&&""+c!="")return void console.error("`value` is read-only on file inputs!")}r.dom[t]=c}else typeof c=="boolean"?c?r.dom.setAttribute(t,""):r.dom.removeAttribute(t):r.dom.setAttribute(t==="className"?"class":t,c)}}function W(r,t,a,c){if(t!=="key"&&t!=="is"&&a!=null&&!F(t))if(t[0]==="o"&&t[1]==="n")Ye(r,t,void 0);else if(t==="style")Qe(r.dom,a,null);else if(!ne(r,t,c)||t==="className"||t==="title"||t==="value"&&(r.tag==="option"||r.tag==="select"&&r.dom.selectedIndex===-1&&r.dom===x())||r.tag==="input"&&t==="type"){var v=t.indexOf(":");v!==-1&&(t=t.slice(v+1)),a!==!1&&r.dom.removeAttribute(t==="className"?"class":t)}else r.dom[t]=null}function F(r){return r==="oninit"||r==="oncreate"||r==="onupdate"||r==="onremove"||r==="onbeforeremove"||r==="onbeforeupdate"}function ne(r,t,a){return a===void 0&&(r.tag.indexOf("-")>-1||r.attrs!=null&&r.attrs.is||t!=="href"&&t!=="list"&&t!=="form"&&t!=="width"&&t!=="height")&&t in r.dom}var G,Y=/[A-Z]/g;function Ve(r){return"-"+r.toLowerCase()}function qe(r){return r[0]==="-"&&r[1]==="-"?r:r==="cssFloat"?"float":r.replace(Y,Ve)}function Qe(r,t,a){if(t!==a)if(a==null)r.style="";else if(typeof a!="object")r.style=a;else if(t==null||typeof t!="object")for(var c in r.style.cssText="",a)(v=a[c])!=null&&r.style.setProperty(qe(c),String(v));else{for(var c in a){var v;(v=a[c])!=null&&(v=String(v))!==String(t[c])&&r.style.setProperty(qe(c),v)}for(var c in t)t[c]!=null&&a[c]==null&&r.style.removeProperty(qe(c))}}function Ie(){this._=n}function Ye(r,t,a){if(r.events!=null){if(r.events._=n,r.events[t]===a)return;a==null||typeof a!="function"&&typeof a!="object"?(r.events[t]!=null&&r.dom.removeEventListener(t.slice(2),r.events,!1),r.events[t]=void 0):(r.events[t]==null&&r.dom.addEventListener(t.slice(2),r.events,!1),r.events[t]=a)}else a==null||typeof a!="function"&&typeof a!="object"||(r.events=new Ie,r.dom.addEventListener(t.slice(2),r.events,!1),r.events[t]=a)}function Le(r,t,a){typeof r.oninit=="function"&&w.call(r.oninit,t),typeof r.oncreate=="function"&&a.push(w.bind(r.oncreate,t))}function Ae(r,t,a){typeof r.onupdate=="function"&&a.push(w.bind(r.onupdate,t))}return Ie.prototype=Object.create(null),Ie.prototype.handleEvent=function(r){var t,a=this["on"+r.type];typeof a=="function"?t=a.call(r.currentTarget,r):typeof a.handleEvent=="function"&&a.handleEvent(r),this._&&r.redraw!==!1&&(0,this._)(),t===!1&&(r.preventDefault(),r.stopPropagation())},function(r,t,a){if(!r)throw new TypeError("DOM element being rendered to does not exist.");if(G!=null&&r.contains(G))throw new TypeError("Node is currently being rendered to and thus is locked.");var c=n,v=G,y=[],O=x(),u=r.namespaceURI;G=r,n=typeof a=="function"?a:void 0,i={};try{r.vnodes==null&&(r.textContent=""),t=De.normalizeChildren(Array.isArray(t)?t:[t]),N(r,r.vnodes,t,y,null,u==="http://www.w3.org/1999/xhtml"?void 0:u),r.vnodes=t,O!=null&&x()!==O&&typeof O.focus=="function"&&O.focus();for(var l=0;l<y.length;l++)y[l]()}finally{n=c,G=v}}}(typeof window<"u"?window:null),nt=se,Ue=function(e,n,i){var s=[],m=!1,d=-1;function h(){for(d=0;d<s.length;d+=2)try{e(s[d],nt(s[d+1]),w)}catch(x){i.error(x)}d=-1}function w(){m||(m=!0,n(function(){m=!1,h()}))}return w.sync=h,{mount:function(x,k){if(k!=null&&k.view==null&&typeof k!="function")throw new TypeError("m.mount expects a component, not a vnode.");var p=s.indexOf(x);p>=0&&(s.splice(p,2),p<=d&&(d-=2),e(x,[])),k!=null&&(s.push(x,k),e(x,nt(k),w))},redraw:w}}(ft,typeof requestAnimationFrame<"u"?requestAnimationFrame:null,typeof console<"u"?console:null),pt=function(e){if(Object.prototype.toString.call(e)!=="[object Object]")return"";var n=[];for(var i in e)s(i,e[i]);return n.join("&");function s(m,d){if(Array.isArray(d))for(var h=0;h<d.length;h++)s(m+"["+h+"]",d[h]);else if(Object.prototype.toString.call(d)==="[object Object]")for(var h in d)s(m+"["+h+"]",d[h]);else n.push(encodeURIComponent(m)+(d!=null&&d!==""?"="+encodeURIComponent(d):""))}},tr=we,vt=Object.assign||function(e,n){for(var i in n)tr.call(n,i)&&(e[i]=n[i])},rr=pt,nr=vt,Ke=function(e,n){if(/:([^\/\.-]+)(\.{3})?:/.test(e))throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");if(n==null)return e;var i=e.indexOf("?"),s=e.indexOf("#"),m=s<0?e.length:s,d=i<0?m:i,h=e.slice(0,d),w={};nr(w,n);var x=h.replace(/:([^\/\.-]+)(\.{3})?/g,function(V,K,Q){return delete w[K],n[K]==null?V:Q?n[K]:encodeURIComponent(String(n[K]))}),k=x.indexOf("?"),p=x.indexOf("#"),U=p<0?x.length:p,M=k<0?U:k,N=x.slice(0,M);i>=0&&(N+=e.slice(i,m)),k>=0&&(N+=(i<0?"?":"&")+x.slice(k,U));var j=rr(w);return j&&(N+=(i<0&&k<0?"?":"&")+j),s>=0&&(N+=e.slice(s)),p>=0&&(N+=(s<0?"":"&")+x.slice(p)),N},or=Ke,ot=we,ir=function(e,n){function i(m){return new Promise(m)}function s(m,d){for(var h in m.headers)if(ot.call(m.headers,h)&&h.toLowerCase()===d)return!0;return!1}return i.prototype=Promise.prototype,i.__proto__=Promise,{request:function(m,d){typeof m!="string"?(d=m,m=m.url):d==null&&(d={});var h=function(k,p){return new Promise(function(U,M){k=or(k,p.params);var N,j=p.method!=null?p.method.toUpperCase():"GET",V=p.body,K=(p.serialize==null||p.serialize===JSON.serialize)&&!(V instanceof e.FormData||V instanceof e.URLSearchParams),Q=p.responseType||(typeof p.extract=="function"?"":"json"),A=new e.XMLHttpRequest,z=!1,S=!1,R=A,I=A.abort;for(var H in A.abort=function(){z=!0,I.call(this)},A.open(j,k,p.async!==!1,typeof p.user=="string"?p.user:void 0,typeof p.password=="string"?p.password:void 0),K&&V!=null&&!s(p,"content-type")&&A.setRequestHeader("Content-Type","application/json; charset=utf-8"),typeof p.deserialize=="function"||s(p,"accept")||A.setRequestHeader("Accept","application/json, text/*"),p.withCredentials&&(A.withCredentials=p.withCredentials),p.timeout&&(A.timeout=p.timeout),A.responseType=Q,p.headers)ot.call(p.headers,H)&&A.setRequestHeader(H,p.headers[H]);A.onreadystatechange=function(T){if(!z&&T.target.readyState===4)try{var L,W=T.target.status>=200&&T.target.status<300||T.target.status===304||/^file:\/\//i.test(k),F=T.target.response;if(Q==="json"){if(!T.target.responseType&&typeof p.extract!="function")try{F=JSON.parse(T.target.responseText)}catch{F=null}}else Q&&Q!=="text"||F==null&&(F=T.target.responseText);if(typeof p.extract=="function"?(F=p.extract(T.target,p),W=!0):typeof p.deserialize=="function"&&(F=p.deserialize(F)),W){if(typeof p.type=="function")if(Array.isArray(F))for(var ne=0;ne<F.length;ne++)F[ne]=new p.type(F[ne]);else F=new p.type(F);U(F)}else{var G=function(){try{L=T.target.responseText}catch{L=F}var Y=new Error(L);Y.code=T.target.status,Y.response=F,M(Y)};A.status===0?setTimeout(function(){S||G()}):G()}}catch(Y){M(Y)}},A.ontimeout=function(T){S=!0;var L=new Error("Request timed out");L.code=T.target.status,M(L)},typeof p.config=="function"&&(A=p.config(A,p,k)||A)!==R&&(N=A.abort,A.abort=function(){z=!0,N.call(this)}),V==null?A.send():typeof p.serialize=="function"?A.send(p.serialize(V)):V instanceof e.FormData||V instanceof e.URLSearchParams?A.send(V):A.send(JSON.stringify(V))})}(m,d);if(d.background===!0)return h;var w=0;function x(){--w==0&&typeof n=="function"&&n()}return function k(p){var U=p.then;return p.constructor=i,p.then=function(){w++;var M=U.apply(p,arguments);return M.then(x,function(N){if(x(),w===0)throw N}),k(M)},p}(h)}}}(typeof window<"u"?window:null,Ue.redraw);function it(e){try{return decodeURIComponent(e)}catch{return e}}var ht=function(e){if(e===""||e==null)return{};e.charAt(0)==="?"&&(e=e.slice(1));for(var n=e.split("&"),i={},s={},m=0;m<n.length;m++){var d=n[m].split("="),h=it(d[0]),w=d.length===2?it(d[1]):"";w==="true"?w=!0:w==="false"&&(w=!1);var x=h.split(/\]\[?|\[/),k=s;h.indexOf("[")>-1&&x.pop();for(var p=0;p<x.length;p++){var U=x[p],M=x[p+1],N=M==""||!isNaN(parseInt(M,10));if(U==="")i[h=x.slice(0,p).join()]==null&&(i[h]=Array.isArray(k)?k.length:0),U=i[h]++;else if(U==="__proto__")break;if(p===x.length-1)k[U]=w;else{var j=Object.getOwnPropertyDescriptor(k,U);j!=null&&(j=j.value),j==null&&(k[U]=j=N?[]:{}),k=j}}}return s},ar=ht,_e=function(e){var n=e.indexOf("?"),i=e.indexOf("#"),s=i<0?e.length:i,m=n<0?s:n,d=e.slice(0,m).replace(/\/{2,}/g,"/");return d?d[0]!=="/"&&(d="/"+d):d="/",{path:d,params:n<0?{}:ar(e.slice(n+1,s))}},sr=_e,at=we,st=new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$"),gt=function(e,n){var i={};if(n!=null)for(var s in e)at.call(e,s)&&!st.test(s)&&n.indexOf(s)<0&&(i[s]=e[s]);else for(var s in e)at.call(e,s)&&!st.test(s)&&(i[s]=e[s]);return i},lr=se,ur=dt,lt=Ke,ut=_e,cr=function(e){var n=sr(e),i=Object.keys(n.params),s=[],m=new RegExp("^"+n.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,function(d,h,w){return h==null?"\\"+d:(s.push({k:h,r:w==="..."}),w==="..."?"(.*)":w==="."?"([^/]+)\\.":"([^/]+)"+(w||""))})+"$");return function(d){for(var h=0;h<i.length;h++)if(n.params[i[h]]!==d.params[i[h]])return!1;if(!s.length)return m.test(d.path);var w=m.exec(d.path);if(w==null)return!1;for(h=0;h<s.length;h++)d.params[s[h].k]=s[h].r?w[h+1]:decodeURIComponent(w[h+1]);return!0}},mr=vt,dr=gt,Me={};function fr(e){try{return decodeURIComponent(e)}catch{return e}}var pr=function(e,n){var i,s,m,d,h,w,x=e==null?null:typeof e.setImmediate=="function"?e.setImmediate:e.setTimeout,k=Promise.resolve(),p=!1,U=!1,M=0,N=Me,j={onbeforeupdate:function(){return!(!(M=M?2:1)||Me===N)},onremove:function(){e.removeEventListener("popstate",Q,!1),e.removeEventListener("hashchange",K,!1)},view:function(){if(M&&Me!==N){var S=[lr(m,d.key,d)];return N&&(S=N.render(S[0])),S}}},V=z.SKIP={};function K(){p=!1;var S=e.location.hash;z.prefix[0]!=="#"&&(S=e.location.search+S,z.prefix[0]!=="?"&&(S=e.location.pathname+S)[0]!=="/"&&(S="/"+S));var R=S.concat().replace(/(?:%[a-f89][a-f0-9])+/gim,fr).slice(z.prefix.length),I=ut(R);function H(T){console.error(T),A(s,null,{replace:!0})}mr(I.params,e.history.state),function T(L){for(;L<i.length;L++)if(i[L].check(I)){var W=i[L].component,F=i[L].route,ne=W,G=w=function(Y){if(G===w){if(Y===V)return T(L+1);m=Y==null||typeof Y.view!="function"&&typeof Y!="function"?"div":Y,d=I.params,h=R,w=null,N=W.render?W:null,M===2?n.redraw():(M=2,n.redraw.sync())}};return void(W.view||typeof W=="function"?(W={},G(ne)):W.onmatch?k.then(function(){return W.onmatch(I.params,R,F)}).then(G,R===s?null:H):G("div"))}if(R===s)throw new Error("Could not resolve default route "+s+".");A(s,null,{replace:!0})}(0)}function Q(){p||(p=!0,x(K))}function A(S,R,I){if(S=lt(S,R),U){Q();var H=I?I.state:null,T=I?I.title:null;I&&I.replace?e.history.replaceState(H,T,z.prefix+S):e.history.pushState(H,T,z.prefix+S)}else e.location.href=z.prefix+S}function z(S,R,I){if(!S)throw new TypeError("DOM element being rendered to does not exist.");if(i=Object.keys(I).map(function(T){if(T[0]!=="/")throw new SyntaxError("Routes must start with a '/'.");if(/:([^\/\.-]+)(\.{3})?:/.test(T))throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");return{route:T,component:I[T],check:cr(T)}}),s=R,R!=null){var H=ut(R);if(!i.some(function(T){return T.check(H)}))throw new ReferenceError("Default route doesn't match any known routes.")}typeof e.history.pushState=="function"?e.addEventListener("popstate",Q,!1):z.prefix[0]==="#"&&e.addEventListener("hashchange",K,!1),U=!0,n.mount(S,j),K()}return z.set=function(S,R,I){w!=null&&((I=I||{}).replace=!0),w=null,A(S,R,I)},z.get=function(){return h},z.prefix="#!",z.Link={view:function(S){var R,I,H,T=ur(S.attrs.selector||"a",dr(S.attrs,["options","params","selector","onclick"]),S.children);return(T.attrs.disabled=!!T.attrs.disabled)?(T.attrs.href=null,T.attrs["aria-disabled"]="true"):(R=S.attrs.options,I=S.attrs.onclick,H=lt(T.attrs.href,S.attrs.params),T.attrs.href=z.prefix+H,T.attrs.onclick=function(L){var W;typeof I=="function"?W=I.call(L.currentTarget,L):I==null||typeof I!="object"||typeof I.handleEvent=="function"&&I.handleEvent(L),W===!1||L.defaultPrevented||L.button!==0&&L.which!==0&&L.which!==1||L.currentTarget.target&&L.currentTarget.target!=="_self"||L.ctrlKey||L.metaKey||L.shiftKey||L.altKey||(L.preventDefault(),L.redraw=!1,z.set(H,null,R))}),T}},z.param=function(S){return d&&S!=null?d[S]:d},z}(typeof window<"u"?window:null,Ue),ye=er,vr=ir,ct=Ue,hr=He,_=function(){return ye.apply(this,arguments)};_.m=ye,_.trust=ye.trust,_.fragment=ye.fragment,_.Fragment="[",_.mount=ct.mount,_.route=pr,_.render=ft,_.redraw=ct.redraw,_.request=vr.request,_.parseQueryString=ht,_.buildQueryString=pt,_.parsePathname=_e,_.buildPathname=Ke,_.vnode=se,_.censor=gt,_.domFor=hr.domFor;var o=_,Cr=o.Fragment,Or=o.buildPathname,qr=o.buildQueryString,Ir=o.censor,Lr=o.domFor,Ar=o.fragment,zr=o.m,Rr=o.mount,Br=o.parsePathname,Nr=o.parseQueryString,Pr=o.redraw,jr=o.render,Dr=o.request,Fr=o.route,Mr=o.trust,Zr=o.vnode;var gr="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var yt=(e=21)=>{let n="",i=crypto.getRandomValues(new Uint8Array(e));for(;e--;)n+=gr[i[e]&63];return n};var fe={list:[],destroy:e=>{let n=fe.list.findIndex(i=>i.id===e.id);fe.list.slice(n,1)}};var wt=(e,n=3e3)=>{fe.list.push({id:yt(),type:0,text:e,timeout:n})};var xt=()=>({view:()=>o("div",fe.list.map(e=>o("div",{key:e.id},o(yr,{toast:e}))))}),yr=()=>({oninit:e=>{setTimeout(()=>{fe.destroy(e.attrs.toast)},e.attrs.toast.timeout)},onbeforeremove:e=>{e.dom.classList.add(""),setTimeout(()=>{fe.destroy(e.attrs.toast),o.redraw()},300)},view:e=>o("div")});var wr=e=>({view:n=>{}}),kt=wr;var xr=e=>({view:n=>{}}),Tt=xr;var br=e=>({view:n=>{}}),Et=br;var xe="none",be={none:"-elevation-none",small:"-elevation-small",medium:"-elevation-medium",large:"-elevation-large"},ke="primary",Te={fill:"-fill",primary:"-primary",secondary:"-secondary",tertiary:"-tertiary"},St="round",Ct={round:"-round",square:"-square"},Ee="medium",Se={small:"-small",medium:"-medium",large:"-large",extra:"-extra"};var le=()=>({view:e=>{let n=e.attrs,i=n.disabled||!1,s=be[n.elevation||xe],m=Te[n.kind||ke],d=Ct[n.shape||St],h=Se[n.size||Ee];return o("button",{class:`a-button ${s} ${m} ${d} ${h}`,disabled:i},[n.icon?n.icon:[],e.children])}});var pe=()=>({view:e=>{let n=e.attrs,i=be[n.elevation||xe],s=Te[n.kind||ke],m=Se[n.size||Ee];return[e.children,o("button",{...n,class:`a-fab ${i} ${s} ${m}`},[n.icon])]}});var ee=e=>{let n=e.attrs||{},i=n.width||"24px",s=n.height||"24px",m=n.fill||"currentColor";return{view:d=>o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 -960 960 960",width:i,height:s,fill:m},d.children)}};var te=()=>({view:e=>o(ee,{...e.attrs},o("path",{d:"M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"}))});var Ot=e=>({view:n=>[o(pe,{kind:"tertiary",icon:o(te)},[o(le,{icon:o(te)},"Bulk Scan"),o(le,{icon:o(te)},"Scan"),o(le,{icon:o(te)},"Add")]),o("h1","Books!")]});var Ce=class e{constructor(n){this.inner=n}static Some(n){return new e({some:!0,value:n})}static None(){return new e({some:!1})}match(n){return this.inner.some?n.some(this.inner.value):n.none()}map(n){return this.match({some:i=>e.Some(n(i)),none:()=>e.None()})}andThen(n){return this.match({some:i=>n(i),none:()=>e.None()})}};var Oe=class e{constructor(n){this.inner=n}static Ok(n){return new e({ok:!0,value:n})}static Err(n){return new e({ok:!1,error:n})}isOk(){return this.inner.ok}match(n){return this.inner.ok?n.ok(this.inner.value):n.err(this.inner.error)}map(n){return this.match({ok:i=>e.Ok(n(i)),err:i=>e.Err(i)})}mapErr(n){return this.match({ok:i=>e.Ok(i),err:i=>e.Err(n(i))})}andThen(n){return this.match({ok:i=>n(i),err:i=>e.Err(i)})}asOk(){return this.match({ok:n=>Ce.Some(n),err:n=>Ce.None()})}},qt=e=>Oe.Ok(e),ce=e=>Oe.Err(e);var Lt=async(e,n)=>{let i=await fetch(n,{method:e,headers:{Accept:"application/json"}});if(i.status===200){let s=await i.json();return qt(s.data)}if(i.status===404||i.status===500){let s=await i.json();return ce(new Error(s.message))}return ce(new Error(`Fetch '${n}' responded with an unknown status code`))},At=async()=>Lt("GET","/api/bookshelves"),zt=async e=>Lt("GET",`/api/bookshelves/${e}`);var Rt=()=>({view:e=>o(ee,{...e.attrs},o("path",{d:"M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"}))});var Bt=()=>({view:e=>{let n=e.attrs;return o("div",{class:"flex items-center"},[o("span",{class:"flex flex-grow items-center"},[o("h2",{class:"text-2xl m-2 text-on-surface"},n.title),n.subtitle?o("h2",{class:"text-on-surface-variant"},n.subtitle):[]]),o(Rt)])}});var Nt=()=>({view:e=>{let n=e.attrs;return o("div",{key:n.entry.id,class:"bg-surface-bright rounded h-64 w-36 flex content-center"},[o("img",{class:"aspect-[9/16] max-h-64 max-w-36 object-contain my-auto",src:n.entry.cover})])}});var kr=()=>{let e=ce(new Error("book cover didn't load"));return{oninit:async n=>{let i=n.attrs;e=await zt(i.entry.id),o.redraw()},view:n=>{let i=n.attrs;return e.match({ok:s=>o("div",{key:i.entry.id},[o(Bt,{title:i.entry.name}),o("div",{class:"flex flex-row gap-3.5 overflow-x-scroll"},[s.map(m=>o(Nt,{entry:m.book}))])]),err:s=>null})}}},Pt=kr;var jt=()=>{let e=ce(new Error("bookshelves didn't load")),n=!1,i=()=>{n=!n};return{oninit:async()=>{e=await At(),o.redraw()},view:s=>e.match({ok:m=>o("div",{class:"bg-zinc-100 px-4"},[o(pe,{kind:"tertiary",icon:o(te),onclick:i},[n?[o("div",{class:"absolute right-6 bottom-40 flex flex-col gap-2"},[o(le,{size:"small",icon:o(te)},"Bulk Scan"),o(le,{size:"small",icon:o(te)},"Scan"),o(le,{size:"small",icon:o(te)},"Add")])]:null]),o("div",{class:"flex flex-col py-4 gap-y-2 md:gap-y-4"},[m.map(d=>o(Pt,{entry:d},[]))])]),err:m=>null})}};var Dt=e=>({view:n=>o("h1","Tags!")});var Ft=e=>({view:n=>[o(pe,{kind:"tertiary",icon:o(te)},[]),o("h1","Wishlist!")]});var We=()=>({view:e=>o("label",{...e.attrs||{},class:"block text-lg font-semibold leading-normal py-1"},e.children)});var $e=()=>({view:e=>o("select",{...e.attrs||{},class:"bg-white border border-zinc-400 leading-normal text-base rounded-sm h-9 max-w-64 py-1.5 pl-2 pr-6"},e.children)}),ae=()=>({view:e=>o("option",e.children)});var Mt=()=>({view:e=>[o("h2",{class:"text-2xl m-2"},"Camera"),o("div",{class:"p-2 mx-2 rounded-md shadow-sm"},[o(We,{for:"settings-camera-selection"},"Camera Selection"),o($e,{id:"settings-camera-selection"},[o(ae,"Choose an option"),o(ae,"Slack"),o(ae,"Skype"),o(ae,"Hipchat")])]),o("h2",{class:"text-2xl m-2"},"Database"),o("div",{class:" p-2 mx-2 rounded-md shadow-sm"},[]),o("h2",{class:"text-2xl m-2"},"Search"),o("div",{class:"p-2 mx-2 rounded-md shadow-sm"},[o(We,{for:"settings-search-provider"},"Search Provider"),o($e,{id:"settings-search-provider"},[o(ae,"Choose an option"),o(ae,"Slack"),o(ae,"Skype"),o(ae,"Hipchat")])])]});var Zt=()=>({view:e=>{let n=e.attrs;return o("div",{class:"a-nav"},[o("div",{class:"a-nav--container"},n.items.map(i=>o(Tr,{...i},[])))])}}),Tr=()=>({view:e=>{let n=e.attrs,i=o.route.get()===n.href;return o(o.route.Link,{...n,class:`a-nav_item${i?" -active":""}`},[o("div",{class:"a-nav_item--icon"},[o(n.icon,{filled:i}),n.badge?o("div",{class:"a-nav_item--badge"},[]):[]]),o("div",{class:"a-nav_item--text"},n.label)])}});var Ht=()=>({view:e=>{let i=(e.attrs||{}).filled||!1;return o(ee,{...e.attrs},o("path",{d:i?"M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Z":"M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Zm-98 0L600-680H200v400h400l142-200Zm-542 0v200-400 200Z"}))}});var Ut=()=>({view:e=>{let i=(e.attrs||{}).filled||!1;return o(ee,{...e.attrs},o("path",{d:i?"M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Z":"M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z"}))}});var Kt=()=>({view:e=>{let i=(e.attrs||{}).filled||!1;return o(ee,{...e.attrs},o("path",{d:i?"M447-80q-15 0-30-6t-27-18L104-390q-12-12-17.5-26.5T81-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T880-800v287q0 16-6 30.5T857-457L504-104q-12 12-27 18t-30 6Zm253-560q25 0 42.5-17.5T760-700q0-25-17.5-42.5T700-760q-25 0-42.5 17.5T640-700q0 25 17.5 42.5T700-640Z":"M446-80q-15 0-30-6t-27-18L103-390q-12-12-17.5-26.5T80-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T879-800v287q0 16-6 30.5T856-457L503-104q-12 12-27 18t-30 6Zm0-80 353-354v-286H513L160-446l286 286Zm253-480q25 0 42.5-17.5T759-700q0-25-17.5-42.5T699-760q-25 0-42.5 17.5T639-700q0 25 17.5 42.5T699-640ZM480-480Z"}))}});var _t=()=>({view:e=>{let i=(e.attrs||{}).filled||!1;return o(ee,{...e.attrs},o("path",{d:i?"m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z":"m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"}))}});var Er=e=>({view:n=>{let i=[{href:"bookshelves",icon:Ut,label:"Bookshelves"},{href:"tags",icon:Ht,label:"Tags"},{href:"wishlist",icon:Kt,label:"Wishlist"},{href:"/settings",icon:_t,label:"Settings"}];return o.fragment({},[o(xt),o("div",{class:"flex-1 overflow-y-scroll"},n.children),o(Zt,{items:i},[])])}}),Wt=Er;var ge=e=>({render:()=>o(Wt,o(e))}),Sr=async()=>{let e=null,n=null,i=h=>{e=h,e.addEventListener("updatefound",()=>s())},s=()=>{n&&n.removeEventListener("statechange",m),n=e?.installing,n?.addEventListener("statechange",m)},m=()=>{n&&n.state==="installed"&&navigator.serviceWorker.controller&&(n=null,d())},d=()=>{wt("ANd update is ready, please reload",60*10*10)};"serviceWorker"in navigator&&navigator.serviceWorker.register("./service-worker.js",{scope:"./"}).then(h=>i(h),h=>console.error("Could not register service worker:",h))};window.addEventListener("load",()=>{Sr(),SISSIX.production||new EventSource("/esbuild").addEventListener("change",()=>location.reload()),o.route(document.body,"/bookshelves",{"/add/bulk":kt,"/add/scan":Tt,"/add/search":Et,"/bookshelves":ge(jt),"/bookshelves/:bookshelfId":ge(Ot),"/tags":ge(Dt),"/wishlist":ge(Ft),"/settings":ge(Mt)})});})();
//# sourceMappingURL=main.js.map
