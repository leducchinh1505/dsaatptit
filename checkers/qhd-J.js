function isSub(s,t){let p=0;for(let i=0;i<t.length&&p<s.length;i++)if(t[i]===s[p])p++;return p===s.length;}
module.exports=(input,output,answer)=>{
  try{
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const [a,b]=tk(input); const best=tk(answer)[0]||'NO';
    const o=tk(output);
    if(o.length!==1) return {ok:false,msg:'Output phải gồm đúng một xâu (hoặc NO)'};
    if(best==='NO') return o[0]==='NO'?{ok:true,msg:''}:{ok:false,msg:'Không có xâu con chung, cần in NO'};
    if(o[0]==='NO') return {ok:false,msg:`Có xâu con chung độ dài ${best.length} nhưng bạn in NO`};
    const c=o[0];
    if(!/^[a-z]+$/.test(c)) return {ok:false,msg:'Xâu in ra chứa ký tự không hợp lệ'};
    if(!isSub(c,a)) return {ok:false,msg:'Xâu in ra không phải xâu con của a'};
    if(!isSub(c,b)) return {ok:false,msg:'Xâu in ra không phải xâu con của b'};
    if(c.length!==best.length) return {ok:false,msg:`Độ dài là ${c.length}, đáp án tối ưu là ${best.length}`};
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
