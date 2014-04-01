/* IBM Unica Page Tagging Script v2.3.0
 *
 * Licensed Materials - Property of IBM (c) Copyright IBM Corporation 2004,2011.
 * U.S. Government Users Restricted Rights: Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var NTPT_IMGSRC = 'http://ws1.ems.eosdis.nasa.gov/images/ntpagetag.gif';

var NTPT_FLDS = {};
NTPT_FLDS.lc = true; // Document location
NTPT_FLDS.rf = true; // Document referrer
NTPT_FLDS.rs = true; // User's screen resolution
NTPT_FLDS.cd = true; // User's color depth
NTPT_FLDS.ln = true; // Browser language
NTPT_FLDS.tz = true; // User's timezone
NTPT_FLDS.jv = true; // Browser's Java support
NTPT_FLDS.ck = true; // Cookies
NTPT_FLDS.iv = false; // Initial view

NTPT_FLDS.sc = true; // HTTP status code errors

var NTPT_MAXTAGWAIT = 1.0; // Max delay (secs) on link-tags and submit-tags
// INCREASE THE MAX WAIT TIME ABOVE IF PAGE LOAD TIMES EXCEED 1 SECOND

var NTPT_HTTPSIMGSRC = 'https://ws1.ems.eosdis.nasa.gov/images/ntpagetag.gif';
var NTPT_GLBLREFTOP = false;
var NTPT_SET_IDCOOKIE = false;
var NTPT_IDCOOKIE_NAME = 'SaneID';
var NTPT_SET_SESSION_COOKIE = false;
var NTPT_SESSION_COOKIE_NAME = 'NetInsightSessionID';

// Variables that need to be modified on a per-site basis

var NTPT_GLBLEXTRA = '';
var NTPT_IDCOOKIE_DOMAIN = '';
var NTPT_GLBLCOOKIES = [ ];

/*** END OF USER-CONFIGURABLE VARIABLES ***/
(function(){var Y=document,b=window,PG="undefined",rW="string",h=null,X=true,C=false;function g(value){return((typeof(value)===rW)&&(value!==""));};function v4(l){return(encodeURIComponent?encodeURIComponent(l):escape(l));};function WH(l){return(decodeURIComponent?decodeURIComponent(l):unescape(l));};function M(O,l,PC,hb){var H="",t;H=O+'='+v4(l)+";";if(hb){H+=" domain="+hb+";";}if(PC>0){t=new Date();t.setTime(t.getTime()+(PC*1000));H+=" expires="+t.toGMTString()+";";}H+=" path=/";Y.cookie=H;};function a(O){var N,e,q,H;if(g(O)){N=O+"=";H=Y.cookie;if(H.length>0){q=rq(N,H,0);if(q!==-1){q+=N.length;e=H.indexOf(";",q);if(e===-1){e=H.length;}return WH(H.substring(q,e));};};}return h;};function rq(N,H,pe){var q=H.indexOf(N,pe);if(q<0){return-1;}else if((q===0)||((q>1)&&(H.substring(q-2,q)==="; "))){return q;}return rq(N,H,(q+1));};function nE(My){var R="",G;for(G in My){if(g(My[G])){if(R!==""){R+=";";}R+=G+"="+My[G];};}return R;};function GO(m2){var hr='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';if(m2<62){return hr.charAt(m2);}return(GO(Math.floor(m2/62))+hr.charAt(m2%62));};function Y1(){var Em="",tC=new Date(),i9;for(i9=0;i9<11;i9+=1){Em+=GO(Math.round(Math.random()*61));}return(Em+"-"+GO(tC.getTime()));};function tG(p,gC){return(p+(((p==='')||((gC==='')||(gC.substring(0,1)==='&')))?'':'&')+gC);};function gT(){var dF=new Date();return(dF.getTime()+'.'+Math.floor(Math.random()*1000));};function r(qe,T3){return(typeof(b[qe])!==PG)?b[qe]:T3;};(function(){var A="NTPT_",ux=r(A+"GLBLCOOKIES",h),Lo=r(A+"PGCOOKIES",h),sh=r(A+"SET_IDCOOKIE",C),P=r(A+"IDCOOKIE_NAME","SaneID"),qD=r(A+"IDCOOKIE_DOMAIN",h),dd=r(A+"IDCOOKIE_EXPIRE",155520000),iu=r(A+"SET_SESSION_COOKIE",C),Uu=r(A+"SESSION_COOKIE_NAME","NetInsightSessionID"),PY=r(A+"SESSION_COOKIE_DOMAIN",h),Pc=r(A+"HTTPSIMGSRC",""),U2=r(A+"PGREFTOP",r(A+"GLBLREFTOP",C)),ei=r(A+"NOINITIALTAG",C),T4=r(A+"MAXTAGWAIT",1.0),yR=NTPT_IMGSRC,s=NTPT_FLDS,I=h,Q=h,K=h,c=[],m={},o=new Array(10),z;for(z=0;z<o.length;z+=1){o[z]=h;}function v(O,bK){if(typeof(bK)!==PG){c[O]=bK.toString();}};function Od(O){c[O]='';};function j0(B){var N5,T,Rt;if(g(B)){N5=B.split('&');for(Rt=0;Rt<N5.length;Rt+=1){T=N5[Rt].split('=');if(T.length===2){v(T[0],WH(T[1]));};};}};function TY(B){var dM='',G;j0(r(A+'GLBLEXTRA',''));if(!Q){j0(r(A+'PGEXTRA',''));}j0(B);for(G in c){if(g(c[G])){dM=tG(dM,G+'='+v4(c[G]));};}return dM;};function iy(){var G;m.c=[];for(G in c){if(g(c[G])){m.c[G]=c[G];};}};function _U(){var G;c=[];for(G in m.c){if(g(m.c[G])){c[G]=m.c[G];};}};function wG(_,L,D){if(o[_]!==h){o[_].onload=L;o[_].onerror=L;o[_].onabort=L;}return setTimeout(L,(D*1000));};function ad(j,vc){if(!g(j)){return;}z=((z+1)%o.length);if(o[z]===h){o[z]=new Image(1,1);}o[z].src=j+'?'+vc;};function xy(B){var j,vc;if((Pc!=='')&&(Y.location.protocol==='https:')){j=Pc;}else{j=yR;}vc=TY(B);ad(j,vc);_U();};function uq(B){v('ets',gT());xy(B);return X;};function Ra(){if(VG){clearTimeout(VG);VG=h;}if(Q){var KW=Q;Q=h;if(KW.href){b.location.href=KW.href;};}};function ZH(f,B,D){var F;if(!f||!f.href){return X;}if(Q){return C;}Q=f;if(s.lc){v('lc',f.href);}if(s.rf){if(!U2||!top||!top.document){v('rf',Y.location);};}uq(B);if(D){F=D;}else{F=T4;}if(F>0&&(Q.target==""||Q.target==b.name)){VG=wG(z,function(){Ra();},F);return C;}Q=h;return X;};function Ko(){if(I){clearTimeout(I);I=h;}if(K){var LY=K;K=h;LY.submit();LY.onsubmit=LY.KN;}};function aF(Z,B,D){var F;if(!Z||!Z.submit){return X;}if(K){return C;}K=Z;uq(B);if(D){F=D;}else{F=T4;}if(F>0){Z.KN=Z.onsubmit;Z.onsubmit=h;I=wG(z,function(){Ko();},F);return C;}K=h;return X;};function UL(){var nY;if(U2&&top&&top.document){nY=top.document.referrer;}else{nY=Y.referrer;}v('rf',nY);};function sR(){var k;if(navigator.language){k=navigator.language;}else if(navigator.userLanguage){k=navigator.userLanguage;}else{k='';}if(k.length>2){k=k.substring(0,2);}k=k.toLowerCase();v('ln',k);};function K2(){var w,dF=new Date(),U=dF.getTimezoneOffset(),i;w='GMT';if(U!==0){if(U>0){w+=' -';}else{w+=' +';}U=Math.abs(U);i=Math.floor(U/60);U-=i*60;if(i<10){w+='0';}w+=i+':';if(U<10){w+='0';}w+=U;}v('tz',w);};function wt(){var J=[],Pi=C,S4='ck',S,H,d,G;v('js','1');v('ts',gT());if(s.lc){v('lc',Y.location);}if(s.rf){UL();}if(self.screen){if(s.rs){v('rs',self.screen.width+'x'+self.screen.height);}if(s.cd){v('cd',self.screen.colorDepth);};}if(s.ln){sR();}if(s.tz){K2();}if(s.jv){v('jv',navigator.javaEnabled()?'1':'0');}if(iu&&!a(Uu)){M(Uu,1,0,PY);if(s.iv&&a(Uu)){v('iv','1');};}if(s.ck){if(ux){for(S=0;S<ux.length;S+=1){J[ux[S]]="";};}if(Lo){for(S=0;S<Lo.length;S+=1){J[Lo[S]]="";};}for(G in J){if(typeof(J[G])===rW){H=a(G);if(H){J[G]=H;};};}if(sh){H=a(P);if(H){J[P]=H;Pi=X;};}d=nE(J);if(d!==""){v(S4,d);};}iy();if(!ei){xy('');}Od('iv');iy();if(sh&&!Pi){H=a(P);if(!H){H=Y1();M(P,H,dd,qD);if(s.ck&&a(P)){J[P]=H;d=nE(J);if(d!==""){v(S4,d);iy();};};};}};function Wc(O,l){var p,Xu,S,yf;p=Y.location.search.substring(1);yf=O+"="+l;Xu=p.split("&");for(S=0;S<Xu.length;S+=1){if(Xu[S]===yf){return X;};}return C;};function vj(){var tS=r(A+"EM_COOKIE_PREFIX","NetInsightEM"),jG=tS+"Session",l3=tS,PF=r(A+"EM_COOKIE_TIMEOUT",1800),Rg="emsgpcat",ED="1",pZ="1";if(a(jG)||a(l3)||Wc(Rg,ED)){M(jG,pZ,0,qD);M(l3,pZ,PF,qD);v(Rg,ED);return X;}return C;};function EZ(){return(s.gsme?vj():X);};if(EZ()){b.ntptAddPair=function(W,V){return v(W,V);};b.ntptDropPair=function(W){return Od(W);};b.ntptEventTag=function(W){return uq(W);};b.ntptLinkTag=function(W,V,Qc){return ZH(W,V,Qc);};b.ntptSubmitTag=function(W,V,Qc){return aF(W,V,Qc);};wt();}else{b.ntptAddPair=b.ntptDropPair=b.ntptEventTag=b.ntptLinkTag=b.ntptSubmitTag=function(){return X;};}}());}());
