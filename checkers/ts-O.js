module.exports=(input,output,answer)=>{
  try{
    const re=/^-?\d+(\.\d+)?$/;
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const o=tk(output),a=tk(answer);
    if(o.length!==a.length)return{ok:false,msg:`Cần in ${a.length} số, nhưng gặp ${o.length} số`};
    for(let i=0;i<a.length;i++){
      if(!re.test(o[i]))return{ok:false,msg:`Token ${i+1} không phải số thực hợp lệ: "${o[i].slice(0,30)}"`};
      const x=parseFloat(o[i]),y=parseFloat(a[i]);
      if(!isFinite(x)||Math.abs(x-y)>1.5e-4)return{ok:false,msg:`Test thứ ${i+1}: gặp ${o[i]}, đáp án ${a[i]} (sai số vượt 1e-4)`};
    }
    return{ok:true,msg:''};
  }catch(e){return{ok:false,msg:'Output không hợp lệ'};}
};
