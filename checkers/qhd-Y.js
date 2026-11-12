module.exports=(input,output,answer)=>{
  try{
    const tk=s=>String(s).split(/\s+/).filter(Boolean);
    const inp=tk(input).map(Number), o=tk(output), ab=tk(answer);
    let ip=0, op=0, ap=0;
    const t=inp[ip++];
    const isInt=x=>/^\d+$/.test(x);
    for(let tc=1;tc<=t;tc++){
      const n=inp[ip++], c=inp[ip++]; const v=[0],w=[0];
      for(let i=1;i<=n;i++){v.push(inp[ip++]);w.push(inp[ip++]);}
      const best=Number(ab[ap++]); const bk=Number(ab[ap++]); ap+=bk;
      if(op+2>o.length) return {ok:false,msg:`Test ${tc}: thiếu dữ liệu output`};
      if(!isInt(o[op])||!isInt(o[op+1])) return {ok:false,msg:`Test ${tc}: tổng giá trị và số đồ vật phải là số nguyên không âm`};
      const V=Number(o[op++]), K=Number(o[op++]);
      if(V!==best) return {ok:false,msg:`Test ${tc}: tổng giá trị là ${V}, đáp án tối ưu là ${best}`};
      if(K>n||op+K>o.length) return {ok:false,msg:`Test ${tc}: số đồ vật ${K} không hợp lệ hoặc thiếu chỉ số`};
      const seen=new Set(); let sw=0, sv=0;
      for(let i=0;i<K;i++){
        const x=o[op++];
        if(!isInt(x)) return {ok:false,msg:`Test ${tc}: chỉ số "${x.slice(0,20)}" không hợp lệ`};
        const id=Number(x);
        if(id<1||id>n) return {ok:false,msg:`Test ${tc}: chỉ số ${id} nằm ngoài [1, ${n}]`};
        if(seen.has(id)) return {ok:false,msg:`Test ${tc}: chỉ số ${id} bị lặp`};
        seen.add(id); sw+=w[id]; sv+=v[id];
      }
      if(sw>c) return {ok:false,msg:`Test ${tc}: tổng khối lượng ${sw} vượt sức chứa ${c}`};
      if(sv!==V) return {ok:false,msg:`Test ${tc}: các đồ vật đã chọn có tổng giá trị ${sv}, khác ${V} đã in`};
    }
    if(op!==o.length) return {ok:false,msg:'Output thừa dữ liệu'};
    return {ok:true,msg:''};
  }catch(e){return {ok:false,msg:'Output không hợp lệ'};}
};
