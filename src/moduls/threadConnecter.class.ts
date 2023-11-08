export class ThreadConnector {
    public chNum:number;
    public coIndex:number;
    public thIndex:number;
    // public anwserIndex:number;
    constructor(cN:number,ci:number,tI:number){
        this.chNum  = cN;   //channelindex
        this.coIndex= ci; // communikation index
        this.thIndex= tI; //threadIndex
    }

}
