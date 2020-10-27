
const elements: number[] = [];

function generate (from: number, to: number){
    let i
    for(i=from;i<=to;i++){
        elements.push(i)
    }
}

function enqueue (){
    return elements
}

function dequeue (){
    return elements.shift();
}

function isEmpty () {
    return elements.length == 0;
};


export default {enqueue, dequeue, generate, isEmpty}
  
