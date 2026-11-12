function isSub(s,t){let p=0;for(let i=0;i<t.length&&p<s.length;i++)if(t[i]===s[p])p++;return p===s.length;}
module.exports=(input,output,answer)=>{
  try{
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const it=tk(input); const s=it[1]||''; const best=tk(answer)[0]||'';
    const o=tk(output);
    if(o.length!==1) return {ok:false,msg:'Output phải gồm đúng một xâu'};
    const c=o[0];
    if(!/^[a-z]+$/.test(c)) return {ok:false,msg:'Xâu in ra chứa ký tự không hợp lệ'};
    if(c!==c.split('').reverse().join('')) return {ok:false,msg:'Xâu in ra không đối xứng'};
    if(!isSub(c,s)) return {ok:false,msg:'Xâu in ra không phải xâu con của s'};
    if(c.length!==best.length) return {ok:false,msg:`Độ dài là ${c.length}, đáp án tối ưu là ${best.length}`};
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
