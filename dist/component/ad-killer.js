/*! kiko's blog 2013-03-19 11:04:54 */
(function(){var e=this.adKiller_by_kikoshoung={},o=/(baidu|google|alimama|mediav|sogou)/,n=/(000dn|ggmm777|17leyi|37cs|49ko|91hui|91mangrandi|91tiger|14yaa|144gg|a135|arpg2|game3737|mediav|qiyou|sogou|twcczhu)/,t=[],l=[document.documentElement.clientWidth,document.documentElement.clientHeight],a={dom:document.getElementById("ad-killer-panel")};e.domScanner=function(e){var a=e.children.length;if(a)for(var i=0,d=e.children;a>i;i++){var c=d[i],s=c.style.position;if(c.position,c.tagName,"SCRIPT"!==c.tagName){var r=""+c.id+c.className+c.name+c.src+c.href+c.style.background;c.onload&&(r+=""+c.onload),"IFRAME"===c.tagName&&r.match(o)||r.match(n)?t.push(c):("absolute"===s||"fixed"===s)&&l[0]===parseInt(c.style.clientWidth)&&l[1]<=parseInt(c.style.clientHeight)?(t.push(c),console.log("float")):arguments.callee(c)}}},e.killSuspectableDoms=function(e){var n=e.parentNode,t=""+n.id+n.className+n.name+n.src+n.href+n.style.background;n.removeChild(e),t.match(o)&&n.parentNode.removeChild(n)},e.excu=function(){a.dom.style.display="block",a.dom.innerHTML="\u6b63\u5728\u626b\u63cf\u6076\u610f\u5e7f\u544a...",a.dom.style.backgroundColor="red",a.dom.style.color="white",e.domScanner(document.getElementsByTagName("body")[0]);for(var o=0;t.length>o;o++)e.killSuspectableDoms(t[o]);a.dom.innerHTML="\u5df2\u4e3a\u4f60\u6e05\u9664\u4e86"+t.length+"\u4e2a\u5e7f\u544a",a.dom.style.backgroundColor="green",t=[],setTimeout(function(){a.dom.style.display="none"},2e3)},e.excu()}).call(this);