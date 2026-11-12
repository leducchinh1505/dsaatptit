module.exports=(input,output,answer)=>{
  try{
    const isInt=s=>/^-?\d{1,12}$/.test(s);
    const it=String(input).split(/\s+/).filter(Boolean).map(Number);
    const n=it[0],k=it[1],a=it.slice(2,2+n);
    const out=String(output).split(/\s+/).filter(Boolean);
    const ans=String(answer).split(/\s+/).filter(Boolean);
    if(ans.length&&ans[0]==='-1'){
      if(out.length===1&&out[0]==='-1')return{ok:true,msg:''};
      return{ok:false,msg:'Không tồn tại cách chia, cần in -1'};
    }
    if(out.length===1&&out[0]==='-1')return{ok:false,msg:'Có cách chia thoả mãn nhưng bạn in -1'};
    if(out.length!==n)return{ok:false,msg:`Cần in đúng ${n} số, bạn in ${out.length} số`};
    const sums=new Array(k+1).fill(0),cnt=new Array(k+1).fill(0);
    for(let i=0;i<n;i++){
      if(!isInt(out[i]))return{ok:false,msg:`Giá trị thứ ${i+1} không phải số nguyên hợp lệ`};
      const g=Number(out[i]);
      if(g<1||g>k)return{ok:false,msg:`Nhóm của phần tử thứ ${i+1} là ${g}, nằm ngoài [1, ${k}]`};
      sums[g]+=a[i];cnt[g]++;
    }
    for(let g=1;g<=k;g++){
      if(cnt[g]===0)return{ok:false,msg:`Nhóm ${g} không có phần tử nào`};
      if(sums[g]!==sums[1])return{ok:false,msg:`Tổng nhóm ${g} (${sums[g]}) khác tổng nhóm 1 (${sums[1]})`};
    }
    return{ok:true,msg:''};
  }catch(e){return{ok:false,msg:'Output không hợp lệ'};}
};
