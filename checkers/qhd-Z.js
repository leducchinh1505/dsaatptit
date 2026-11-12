function isSub(s,t){let p=0;for(let i=0;i<t.length&&p<s.length;i++)if(t[i]===s[p])p++;return p===s.length;}
module.exports=(input,output,answer)=>{
  try{
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const [a,b]=tk(input); const best=tk(answer)[0]||'';
    const o=tk(output);
    if(o.length!==1) return {ok:false,msg:'Output phải gồm đúng một xâu'};
    const c=o[0];
    if(!/^[a-z]+$/.test(c)) return {ok:false,msg:'Xâu in ra chứa ký tự không hợp lệ'};
    if(!isSub(a,c)) return {ok:false,msg:'Xâu in ra không chứa a như một xâu con'};
    if(!isSub(b,c)) return {ok:false,msg:'Xâu in ra không chứa b như một xâu con'};
    if(c.length!==best.length) return {ok:false,msg:`Độ dài là ${c.length}, đáp án ngắn nhất là ${best.length}`};
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
