module.exports=(input,output,answer)=>{
  try{
    const a=String(output).split(/\s+/).filter(Boolean).map(x=>x.toLowerCase());
    const b=String(answer).split(/\s+/).filter(Boolean).map(x=>x.toLowerCase());
    if(a.length!==b.length) return {ok:false,msg:`Số dòng đáp án là ${a.length}, cần ${b.length}`};
    for(let i=0;i<b.length;i++){
      if(a[i]!=='yes'&&a[i]!=='no') return {ok:false,msg:`Truy vấn ${i+1}: gặp "${a[i].slice(0,20)}", cần Yes hoặc No`};
      if(a[i]!==b[i]) return {ok:false,msg:`Truy vấn ${i+1}: gặp ${a[i]}, cần ${b[i]}`};
    }
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
