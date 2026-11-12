module.exports=(input,output,answer)=>{
  try{
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const inp=tk(input).map(Number), n=inp[0], a=inp.slice(1,1+n);
    const best=Number(tk(answer)[0]);
    const o=tk(output);
    if(o.length===0) return {ok:false,msg:'Output rỗng'};
    if(!/^-?\d+$/.test(o[0])) return {ok:false,msg:'Dòng đầu phải là một số nguyên'};
    const m=Number(o[0]);
    if(m!==best) return {ok:false,msg:`Độ dài dãy là ${m}, đáp án tối ưu là ${best}`};
    if(o.length!==m+1) return {ok:false,msg:`Cần ${m} phần tử của dãy nhưng có ${o.length-1}`};
    const seq=[];
    for(let i=1;i<=m;i++){ if(!/^-?\d+$/.test(o[i])) return {ok:false,msg:`Phần tử thứ ${i} không phải số nguyên`}; seq.push(Number(o[i])); }
    for(let i=1;i<m;i++) if(!(seq[i-1]<seq[i])) return {ok:false,msg:`Dãy không tăng ngặt tại vị trí ${i+1}`};
    let p=0;
    for(let i=0;i<n&&p<m;i++) if(a[i]===seq[p]) p++;
    if(p!==m) return {ok:false,msg:'Dãy in ra không phải dãy con của a'};
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
