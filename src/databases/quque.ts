const antrian_in: number[] = []
const antrian_out: number[] = []
var _start: number = 0
var _finish: number = 100

function generate (){
    _start = (_start > 0 && _start != undefined ) ? _start: 1
    _finish = (_finish > 0 && _finish > _start && _finish != undefined && _finish > 100) ? _finish : 100
    let i
    for(i=_start;i<=_finish;i++){
        antrian_in.push(i)
    }
}

function set_range(start: number, finish: number){
    _start = (start > 0 && start != undefined ) ? start: 1
    _finish = (finish > 0 && finish > start && finish != undefined && finish < 100) ? finish : 100

    return {
        "start": _start,
        "finish": _finish
    }
}

function enqueue (){
    return antrian_in
}

function dequeue (){
    const _in = antrian_in.shift()
    antrian_out.push(Number(_in))

    return _in;

}

function data_antrian (){
    return antrian_out
}

function isEmpty () {
    return antrian_in.length == 0;
};


export default {enqueue, dequeue, generate, isEmpty, data_antrian, set_range}
  
